/**
 * Utility to generate accurate font width mappings using Canvas measureText API.
 * Use this to create or update font width maps for better truncation accuracy.
 */

export const getCharacterWidth = (
	character: string,
	fontFamily: string,
	fontSize = 16,
): number => {
	if (typeof document === "undefined") {
		throw new Error("getCharacterWidth requires a browser environment");
	}

	const context = document.createElement("canvas").getContext("2d");
	if (!context)
		throw new Error("Browser failed to create a 2D rendering context");

	context.font = `${fontSize}px ${fontFamily}`;
	// Getting average of 2 character width, to include font-family's built-in whitespace
	const metrics = context.measureText(character + character);

	// Use Math.ceil to round up and avoid sub-pixel rendering issues
	return Math.ceil(metrics.width / 2);
};

export const generateCharacterWidthMapping = (
	fontFamily: string,
): Record<string, number> => {
	const fontWidthMapping: Record<string, number> = {};

	/*
	 * The first 32 characters in the ASCII-table are unprintable control codes and are not used in web typography.
	 * ASCII characters from 32 to 127 are printable characters. We will generate width mapping for only these characters.
	 */
	for (let i = 32; i < 128; i++) {
		const character = String.fromCharCode(i);
		fontWidthMapping[character] = getCharacterWidth(character, fontFamily, 16);
	}

	return fontWidthMapping;
};

export const generateFontWidthMapping = (): Record<
	string,
	Record<string, number>
> => {
	if (typeof document === "undefined") {
		throw new Error("generateFontWidthMapping requires a browser environment");
	}

	const fontFamilies = new Set<string>();

	for (const element of document.querySelectorAll("*")) {
		window
			.getComputedStyle(element)
			.getPropertyValue("font-family")
			.split(", ")
			.forEach((fontFamily) => fontFamilies.add(fontFamily));
	}

	const fontsMap: Record<string, Record<string, number>> = {};

	for (const fontFamily of fontFamilies) {
		fontsMap[fontFamily] = generateCharacterWidthMapping(fontFamily);
	}

	return fontsMap;
};
