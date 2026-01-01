import {
	getAvailableWidth,
	getAvailableWidthWhenSharing,
} from "./element-utils";

type TruncateOptions = {
	boundingElement?: HTMLElement;
	targetElement: HTMLElement;
	originalText: string;
	ellipsisSymbol: string;
	lineLimit: number;
};

type TruncateResult = {
	firstHalf: string;
	secondHalf: string;
	ellipsisSymbol: string;
	truncated: boolean;
};

// Helper to set content with ellipsis as plain text (for measuring)
const setTextContent = (
	element: HTMLElement,
	first: string,
	ellipsis: string,
	second: string,
) => {
	element.textContent = first + ellipsis + second;
};

// Helper to set content with ellipsis wrapped in a span (for final render)
const setHtmlContent = (
	element: HTMLElement,
	first: string,
	ellipsis: string,
	second: string,
) => {
	// Escape HTML entities in text parts
	const escapeHtml = (text: string) =>
		text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");

	element.innerHTML = `${escapeHtml(first)}<span part="ellipsis">${escapeHtml(ellipsis)}</span>${escapeHtml(second)}`;
};

const truncateText = ({
	boundingElement,
	targetElement,
	originalText,
	ellipsisSymbol,
	lineLimit,
}: TruncateOptions): TruncateResult => {
	let availableWidth = boundingElement
		? getAvailableWidthWhenSharing(targetElement, boundingElement)
		: getAvailableWidth(targetElement);

	if (lineLimit > 1) {
		// For multiline, multiply available width by line count
		// Subtract some buffer for the last line
		availableWidth = availableWidth * lineLimit - 20;
	}

	// If available width is 0 or negative, we can't truncate properly
	// Return original text and let CSS handle overflow
	if (availableWidth <= 0) {
		targetElement.textContent = originalText;
		return {
			firstHalf: originalText,
			secondHalf: "",
			ellipsisSymbol: "",
			truncated: false,
		};
	}

	// First, check if the original text actually fits in the DOM
	targetElement.textContent = originalText;

	// Check if element has actual dimensions - if clientWidth is 0,
	// the element isn't properly laid out yet
	if (targetElement.clientWidth === 0) {
		return {
			firstHalf: originalText,
			secondHalf: "",
			ellipsisSymbol: "",
			truncated: false,
		};
	}

	// Helper to check overflow based on lineLimit
	const checkOverflow = () =>
		targetElement.scrollWidth > targetElement.clientWidth ||
		(lineLimit > 1 && targetElement.scrollHeight > targetElement.clientHeight);

	// Check if original text fits
	if (!checkOverflow()) {
		return {
			firstHalf: originalText,
			secondHalf: "",
			ellipsisSymbol: "",
			truncated: false,
		};
	}

	const originalTextLength = originalText.length;

	// Use binary search to find optimal truncation point
	// This is more reliable across browsers than character width estimation
	let left = 0;
	let right = Math.floor(originalTextLength / 2);
	let bestFirstHalf = "";
	let bestSecondHalf = "";

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const firstHalf = originalText.slice(0, mid);
		const secondHalf = originalText.slice(originalTextLength - mid);
		const testResult = firstHalf + ellipsisSymbol + secondHalf;

		targetElement.textContent = testResult;

		if (checkOverflow()) {
			right = mid - 1;
		} else {
			bestFirstHalf = firstHalf;
			bestSecondHalf = secondHalf;
			left = mid + 1;
		}
	}

	setTextContent(targetElement, bestFirstHalf, ellipsisSymbol, bestSecondHalf);

	// Fine-tune: try adding more characters from each end
	let canAddMore = true;
	let firstIndex = bestFirstHalf.length;
	let lastIndex = originalTextLength - bestSecondHalf.length - 1;

	while (canAddMore && firstIndex <= lastIndex) {
		let added = false;

		// Try adding from the end first
		if (lastIndex >= 0 && lastIndex < originalTextLength) {
			const testSecond = originalText[lastIndex] + bestSecondHalf;
			setTextContent(targetElement, bestFirstHalf, ellipsisSymbol, testSecond);
			if (!checkOverflow()) {
				bestSecondHalf = testSecond;
				lastIndex--;
				added = true;
			}
		}

		// Try adding from the start
		if (!added && firstIndex < originalTextLength) {
			const testFirst = bestFirstHalf + originalText[firstIndex];
			setTextContent(targetElement, testFirst, ellipsisSymbol, bestSecondHalf);
			if (!checkOverflow()) {
				bestFirstHalf = testFirst;
				firstIndex++;
				added = true;
			}
		}

		canAddMore = added;
	}

	return {
		firstHalf: bestFirstHalf,
		secondHalf: bestSecondHalf,
		ellipsisSymbol,
		truncated: true,
	};
};

export const truncateOnResize = ({
	boundingElement,
	targetElement,
	originalText = "",
	ellipsisSymbol = "...",
	lineLimit = 1,
}: TruncateOptions) => {
	// If there's no original text, nothing to do.
	if (!originalText) return () => {};

	let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

	// Helper that performs a single truncation pass.
	const runTruncate = () => {
		const result = truncateText({
			boundingElement,
			targetElement,
			/* Below checks provide run-time guarantees */
			originalText: String(originalText),
			ellipsisSymbol:
				typeof ellipsisSymbol === "string" ? ellipsisSymbol : "...",
			lineLimit: typeof lineLimit === "number" ? lineLimit : 1,
		});

		// Update the DOM with ellipsis wrapped in a styleable span
		if (result.truncated) {
			setHtmlContent(
				targetElement,
				result.firstHalf,
				result.ellipsisSymbol,
				result.secondHalf,
			);
		} else {
			// No truncation needed, just set plain text
			targetElement.textContent = result.firstHalf;
		}
	};

	// Run once immediately so the element is correct on initial render/layout.
	runTruncate();

	// Debounced resize handler to prevent excessive updates
	const debouncedTruncate = () => {
		if (resizeTimeout) {
			clearTimeout(resizeTimeout);
		}
		resizeTimeout = setTimeout(() => {
			runTruncate();
			resizeTimeout = null;
		}, 10);
	};

	// Observe resizes to recompute truncation. Prefer observing the offsetParent
	// (so changes to the container width trigger recalculation). If offsetParent
	// is not available, observe the element itself.
	const observer = new ResizeObserver(() => {
		debouncedTruncate();
	});

	// For shadow DOM, observe the host element or boundingElement if provided
	const rootNode = targetElement.getRootNode();
	const isShadowDOM = rootNode instanceof ShadowRoot;

	let observeTarget: Element;
	if (boundingElement) {
		observeTarget = boundingElement;
	} else if (isShadowDOM) {
		observeTarget = (rootNode as ShadowRoot).host as Element;
	} else {
		observeTarget = (targetElement.offsetParent || targetElement) as Element;
	}

	observer.observe(observeTarget);

	return () => {
		observer.disconnect();
		if (resizeTimeout) {
			clearTimeout(resizeTimeout);
		}
	};
};
