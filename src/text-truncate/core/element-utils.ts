export const getElementProperties = (targetElement: Element) => {
	const style = window.getComputedStyle(targetElement);

	const fontSize = Number.parseFloat(style.fontSize);
	const fontFamily = style.fontFamily.split(",")[0].replace(/['"]/g, "").trim();

	const marginXWidth =
		Number.parseFloat(style.marginLeft) + Number.parseFloat(style.marginRight);
	const borderXWidth =
		Number.parseFloat(style.borderLeftWidth) +
		Number.parseFloat(style.borderRightWidth);
	const paddingXWidth =
		Number.parseFloat(style.paddingLeft) +
		Number.parseFloat(style.paddingRight);

	const width = Number.parseFloat(style.width);
	const totalWidth = width + marginXWidth;
	const innerWidth = width - paddingXWidth - borderXWidth;

	return {
		fontSize,
		fontFamily,
		totalWidth,
		borderXWidth,
		paddingXWidth,
		marginXWidth,
		innerWidth,
	};
};

export const getSiblingWidth = (targetElement: Element): number => {
	let width = 0;
	if (!targetElement.parentNode) return width;

	for (const child of targetElement.parentNode.children) {
		// Skip slot elements as they don't have a measurable width
		if (child.tagName === "SLOT") continue;

		if (child === targetElement) {
			const { paddingXWidth, borderXWidth } =
				getElementProperties(targetElement);
			width += paddingXWidth + borderXWidth;
		} else {
			const props = getElementProperties(child);
			// Only add if we got a valid width (not NaN)
			if (!Number.isNaN(props.totalWidth)) {
				width += props.totalWidth;
			}
		}
	}

	return width;
};

export const getAvailableWidth = (targetElement: HTMLElement) => {
	// For shadow DOM elements, find the host element's offset parent
	const rootNode = targetElement.getRootNode();
	const isShadowDOM = rootNode instanceof ShadowRoot;

	const offsetParentElement = isShadowDOM
		? (rootNode as ShadowRoot).host.parentElement
		: targetElement.offsetParent;

	if (!offsetParentElement) return 0;

	let takenWidth = 0;
	let tempElement = targetElement;

	while (tempElement !== offsetParentElement) {
		takenWidth += getSiblingWidth(tempElement);

		if (!tempElement.parentElement) {
			// Check if we're at shadow root boundary
			if (isShadowDOM && tempElement.parentNode === rootNode) {
				// Jump to host element
				const host = (rootNode as ShadowRoot).host;
				if (host.parentElement) {
					tempElement = host.parentElement;
					continue;
				}
			}
			break;
		}
		tempElement = tempElement.parentElement;
	}

	return getElementProperties(offsetParentElement).innerWidth - takenWidth;
};

/*
  This function assumes that all children element sharing will get equal width.
*/
export const getAvailableWidthWhenSharing = (
	targetElement: HTMLElement,
	boundingElement: HTMLElement,
) => {
	// Check if both elements are in shadow DOM and share the same root
	const targetRootNode = targetElement.getRootNode();
	const boundingRootNode = boundingElement.getRootNode();
	const isShadowDOM = targetRootNode instanceof ShadowRoot;
	const sameShadowRoot = targetRootNode === boundingRootNode;

	// If both are in the same shadow DOM, use direct width calculation
	if (isShadowDOM && sameShadowRoot) {
		const boundingProps = getElementProperties(boundingElement);
		const targetProps = getElementProperties(targetElement);
		const takenWidth =
			targetProps.paddingXWidth +
			targetProps.borderXWidth +
			targetProps.marginXWidth;

		const availableWidth = boundingProps.innerWidth - takenWidth;
		return availableWidth;
	}

	// Check if boundingElement is a shadow DOM host
	const isHostElement =
		isShadowDOM && (targetRootNode as ShadowRoot).host === boundingElement;

	// If the bounding element is the shadow host, get its inner width directly
	if (isHostElement) {
		const hostProps = getElementProperties(boundingElement);
		const targetProps = getElementProperties(targetElement);
		// Host innerWidth already accounts for host's padding/border
		// Subtract target element's padding/border/margin
		const takenWidth =
			targetProps.paddingXWidth +
			targetProps.borderXWidth +
			targetProps.marginXWidth;

		const availableWidth = hostProps.innerWidth - takenWidth;
		return availableWidth;
	}

	const containerAvailableWidth = getAvailableWidth(boundingElement);

	let takenWidth = 0;
	let tempElement = targetElement;

	while (tempElement !== boundingElement) {
		const { paddingXWidth, borderXWidth, marginXWidth } =
			getElementProperties(tempElement);
		const w = paddingXWidth + borderXWidth + marginXWidth;

		takenWidth += w;

		if (!tempElement.parentElement) break;
		tempElement = tempElement.parentElement;
	}

	const availableWidth =
		containerAvailableWidth / boundingElement.childElementCount - takenWidth;

	return availableWidth;
};
