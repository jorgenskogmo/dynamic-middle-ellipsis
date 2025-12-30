import {
	defaultFontWidthMap,
	type FontWidthMap,
} from "./default-font-width-map";

let fontWidthMap: FontWidthMap = defaultFontWidthMap;
const canvasContext =
	typeof document !== "undefined"
		? document.createElement("canvas").getContext("2d")
		: null;

export const setFontWidthMap = (customMap: FontWidthMap) => {
	fontWidthMap = customMap;
};

// Measure character width using Canvas API for accuracy
const measureCharacterWidth = (
	character: string,
	fontFamily: string,
	fontSize: number,
): number => {
	if (!canvasContext) {
		// Fallback for non-browser environments
		return fontSize * 0.6; // rough approximation
	}

	canvasContext.font = `${fontSize}px ${fontFamily}`;
	// Measure the character twice to account for font kerning and spacing
	const metrics = canvasContext.measureText(character + character);
	// Use the precise width without rounding to maximize space usage
	return metrics.width / 2;
};

export const getCharacterWidth = (
	character: string,
	fontFamily: string,
	fontSize = 16,
) => {
	const characterWidthMap = fontWidthMap[fontFamily];

	// If we have the font in our map and the character, use it (scaled)
	if (characterWidthMap && characterWidthMap[character] !== undefined) {
		return characterWidthMap[character] * (fontSize / 16);
	}

	// Otherwise, measure it dynamically with Canvas
	return measureCharacterWidth(character, fontFamily, fontSize);
};

export const getStringWidth = (
	originalText: string,
	fontSize: number,
	fontFamily: string,
) => {
	let width = 0;

	for (const c of originalText) {
		width += getCharacterWidth(c, fontFamily, fontSize);
	}

	return width;
};
