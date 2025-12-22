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

	const originalAvailableWidth = availableWidth;

	// Add a small safety buffer to account for sub-pixel rendering and rounding errors
	// This prevents the last character from being clipped
	const SAFETY_BUFFER = 2; // pixels - minimal buffer for sub-pixel rounding
	availableWidth = availableWidth - SAFETY_BUFFER;

	const maxTextWidth = getStringWidth(originalText, fontSize, fontFamily);

	// Debug logging (can be enabled via console)
	if ((window as any).__DEBUG_TRUNCATE__) {
		console.log("🔍 Truncate Debug:", {
			originalText,
			availableWidth: originalAvailableWidth,
			adjustedWidth: availableWidth,
			maxTextWidth,
			needsTruncation: maxTextWidth > availableWidth,
			fontFamily,
			fontSize,
		});
	}

	/*
		If maximum possible originalText width is less than or equal to available width,
		then there is no need to truncate originalText.
		Return original originalText.
	*/
	if (maxTextWidth <= availableWidth) return originalText;

	const middleEllipsisWidth = getStringWidth(
		ellipsisSymbol,
		fontSize,
		fontFamily,
	);
	const originalTextLength = originalText.length;

	let remainingWidth = availableWidth - middleEllipsisWidth;
	let firstHalf = "";
	let secondHalf = "";

	for (let i = 0; i < Math.floor(originalTextLength / 2); i++) {
		const firstCharWidth = getCharacterWidth(
			originalText[i],
			fontFamily,
			fontSize,
		);
		const lastCharWidth = getCharacterWidth(
			originalText[originalTextLength - i - 1],
			fontFamily,
			fontSize,
		);

		// Check if adding both characters would exceed the remaining width
		// Use <= instead of < to be more conservative
		if (remainingWidth - firstCharWidth - lastCharWidth <= 0) break;

		remainingWidth -= firstCharWidth;
		firstHalf += originalText[i];

		remainingWidth -= lastCharWidth;
		secondHalf = originalText[originalTextLength - i - 1] + secondHalf;
	}

	const result = firstHalf + ellipsisSymbol + secondHalf;

	// Debug logging for the result
	if ((window as any).__DEBUG_TRUNCATE__) {
		const resultWidth = getStringWidth(result, fontSize, fontFamily);
		console.log("📏 Truncate Result:", {
			result,
			resultLength: result.length,
			resultWidth,
			availableWidth,
			difference: availableWidth - resultWidth,
			firstHalfLength: firstHalf.length,
			secondHalfLength: secondHalf.length,
		});
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
