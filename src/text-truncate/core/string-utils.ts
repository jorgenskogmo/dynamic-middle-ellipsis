import {
	defaultFontWidthMap,
	type FontWidthMap,
} from "./default-font-width-map";

let fontWidthMap: FontWidthMap = defaultFontWidthMap;
const canvasContext =
	typeof document !== "undefined"
		? document.createElement("canvas").getContext("2d")
		: null;

// Cache for measured widths to avoid repeated DOM access
const measureCache = new Map<string, number>();

export const setFontWidthMap = (customMap: FontWidthMap) => {
	fontWidthMap = customMap;
};

// Measure character width using Canvas API
const measureCharacterWidth = (
	character: string,
	fontFamily: string,
	fontSize: number,
): number => {
	const cacheKey = `${character}|${fontFamily}|${fontSize}`;
	const cached = measureCache.get(cacheKey);
	if (cached !== undefined) {
		return cached;
	}

	if (!canvasContext) {
		// Fallback for non-browser environments
		return fontSize * 0.6; // rough approximation
	}

	// Normalize font family for canvas
	const normalizedFont = fontFamily.replace(/['"]/g, "");
	canvasContext.font = `${fontSize}px ${normalizedFont}, sans-serif`;

	// Measure the character
	const metrics = canvasContext.measureText(character);
	const width = metrics.width;

	measureCache.set(cacheKey, width);
	return width;
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
