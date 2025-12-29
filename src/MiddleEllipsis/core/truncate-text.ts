import {
	getAvailableWidth,
	getAvailableWidthWhenSharing,
	getElementProperties,
} from "./element-utils";
import { getCharacterWidth, getStringWidth } from "./string-utils";

type TruncateOptions = {
	boundingElement?: HTMLElement;
	targetElement: HTMLElement;
	originalText: string;
	ellipsisSymbol: string;
	lineLimit: number;
};

const truncateText = ({
	boundingElement,
	targetElement,
	originalText,
	ellipsisSymbol,
	lineLimit,
}: TruncateOptions) => {
	const { fontSize, fontFamily } = getElementProperties(targetElement);
	let availableWidth = boundingElement
		? getAvailableWidthWhenSharing(targetElement, boundingElement)
		: getAvailableWidth(targetElement);

	if (lineLimit > 1) {
		availableWidth =
			availableWidth * lineLimit - getCharacterWidth("W", fontFamily, fontSize);
	}

	// Use a minimal buffer for the initial calculation
	const SAFETY_BUFFER = 2;
	availableWidth = availableWidth - SAFETY_BUFFER;

	// First, check if the original text actually fits in the DOM
	targetElement.textContent = originalText;
	if (targetElement.scrollWidth <= targetElement.clientWidth) {
		return originalText;
	}

	const maxTextWidth = getStringWidth(originalText, fontSize, fontFamily);
	const middleEllipsisWidth = getStringWidth(
		ellipsisSymbol,
		fontSize,
		fontFamily,
	);
	const originalTextLength = originalText.length;

	let remainingWidth = availableWidth - middleEllipsisWidth;
	let firstHalf = "";
	let secondHalf = "";
	let firstIndex = 0;
	let lastIndex = originalTextLength - 1;

	// Greedily add characters from both ends
	while (firstIndex <= lastIndex) {
		const firstCharWidth = getCharacterWidth(
			originalText[firstIndex],
			fontFamily,
			fontSize,
		);
		const lastCharWidth = getCharacterWidth(
			originalText[lastIndex],
			fontFamily,
			fontSize,
		);

		// Try to add both characters if possible
		if (remainingWidth >= firstCharWidth + lastCharWidth) {
			remainingWidth -= firstCharWidth;
			firstHalf += originalText[firstIndex];
			firstIndex++;

			remainingWidth -= lastCharWidth;
			secondHalf = originalText[lastIndex] + secondHalf;
			lastIndex--;
		}
		// If we can't fit both, try just the first character
		else if (remainingWidth >= firstCharWidth) {
			remainingWidth -= firstCharWidth;
			firstHalf += originalText[firstIndex];
			firstIndex++;
		}
		// If we can't fit the first, try just the last character
		else if (remainingWidth >= lastCharWidth) {
			remainingWidth -= lastCharWidth;
			secondHalf = originalText[lastIndex] + secondHalf;
			lastIndex--;
		}
		// If we can't fit either, we're done
		else {
			break;
		}
	}

	let result = firstHalf + ellipsisSymbol + secondHalf;

	// Set the initial result and check if it actually overflows
	targetElement.textContent = result;

	// Fine-tune: if text overflows, remove characters until it fits
	while (
		targetElement.scrollWidth > targetElement.clientWidth &&
		(firstHalf.length > 0 || secondHalf.length > 0)
	) {
		// Remove from the longer half to maintain balance
		if (firstHalf.length >= secondHalf.length && firstHalf.length > 0) {
			firstHalf = firstHalf.slice(0, -1);
		} else if (secondHalf.length > 0) {
			secondHalf = secondHalf.slice(1);
		}
		result = firstHalf + ellipsisSymbol + secondHalf;
		targetElement.textContent = result;
	}

	// Optimize: try adding characters back if there's space
	let canAddMore = true;
	while (canAddMore && firstIndex <= lastIndex) {
		const testFirstChar =
			firstIndex < originalTextLength ? originalText[firstIndex] : null;
		const testLastChar = lastIndex >= 0 ? originalText[lastIndex] : null;

		let added = false;

		// Try adding from the end first (to complete the sentence)
		if (testLastChar) {
			const testResult = firstHalf + ellipsisSymbol + testLastChar + secondHalf;
			targetElement.textContent = testResult;
			if (targetElement.scrollWidth <= targetElement.clientWidth) {
				secondHalf = testLastChar + secondHalf;
				lastIndex--;
				result = testResult;
				added = true;
			}
		}

		// If we couldn't add from end, try from start
		if (!added && testFirstChar) {
			const testResult =
				firstHalf + testFirstChar + ellipsisSymbol + secondHalf;
			targetElement.textContent = testResult;
			if (targetElement.scrollWidth <= targetElement.clientWidth) {
				firstHalf = firstHalf + testFirstChar;
				firstIndex++;
				result = testResult;
				added = true;
			}
		}

		canAddMore = added;
	}

	return result;
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

	// Helper that performs a single truncation pass.
	const runTruncate = () => {
		const truncatedText = truncateText({
			boundingElement,
			targetElement,
			/* Below checks provide run-time guarantees */
			originalText: String(originalText),
			ellipsisSymbol:
				typeof ellipsisSymbol === "string" ? ellipsisSymbol : "...",
			lineLimit: typeof lineLimit === "number" ? lineLimit : 1,
		});

		// Directly update the originalText in the DOM
		targetElement.textContent = truncatedText;
	};

	// Run once immediately so the element is correct on initial render/layout.
	runTruncate();

	// Observe resizes to recompute truncation. Prefer observing the offsetParent
	// (so changes to the container width trigger recalculation). If offsetParent
	// is not available, observe the element itself.
	const observer = new ResizeObserver(() => {
		runTruncate();
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

	return () => observer.disconnect();
};
