import {
	defaultFontWidthMap,
	type FontWidthMap,
} from "./default-font-width-map";

let fontWidthMap: FontWidthMap = defaultFontWidthMap;
const canvasContext =
	typeof document !== "undefined"
		? document.createElement("canvas").getContext("2d")
		: null;

let debugMode = false;
let forceCanvasMode = false;
let debugStats = {
	fontFamily: "",
	usedMap: false,
	usedCanvas: false,
	totalCharacters: 0,
};

export const setFontWidthMap = (customMap: FontWidthMap) => {
	fontWidthMap = customMap;
};

export const setForceCanvasMode = (enabled: boolean) => {
	forceCanvasMode = enabled;
	if (enabled) {
		console.log(
			"🎨 Canvas measurement mode ENABLED - bypassing font width maps",
		);
	} else {
		console.log("📊 Font width map mode ENABLED");
	}
};

export const enableDebugMode = (fontFamily: string) => {
	debugMode = true;
	debugStats = {
		fontFamily,
		usedMap: false,
		usedCanvas: false,
		totalCharacters: 0,
	};
};

export const getDebugStats = () => ({ ...debugStats });

export const disableDebugMode = () => {
	if (debugMode) {
		console.log(`🔍 Font Width Debug Stats for "${debugStats.fontFamily}":`, {
			totalCharacters: debugStats.totalCharacters,
			usedPrecomputedMap: debugStats.usedMap,
			usedCanvasMeasurement: debugStats.usedCanvas,
			hasMapEntry: !!fontWidthMap[debugStats.fontFamily],
		});
	}
	debugMode = false;
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
	// Use Math.ceil to round up and avoid sub-pixel clipping issues
	return Math.ceil(metrics.width / 2);
};

export const getCharacterWidth = (
	character: string,
	fontFamily: string,
	fontSize = 16,
) => {
	if (debugMode) {
		debugStats.totalCharacters++;
	}

	// Force canvas mode bypasses the font map entirely
	if (forceCanvasMode) {
		if (debugMode) {
			debugStats.usedCanvas = true;
		}
		return measureCharacterWidth(character, fontFamily, fontSize);
	}

	const characterWidthMap = fontWidthMap[fontFamily];

	// If we have the font in our map and the character, use it (scaled)
	if (characterWidthMap && characterWidthMap[character] !== undefined) {
		if (debugMode) {
			debugStats.usedMap = true;
		}
		return characterWidthMap[character] * (fontSize / 16);
	}

	// Otherwise, measure it dynamically with Canvas
	if (debugMode) {
		debugStats.usedCanvas = true;
	}
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
