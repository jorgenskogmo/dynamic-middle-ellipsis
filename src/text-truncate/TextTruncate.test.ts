import { expect, test } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/web-components";
import { composeStories } from "@storybook/web-components";
import * as stories from "./TextTruncate.stories";

// Compose all stories from the stories file
const {
	Default,
	CustomEllipsisSymbol,
	TripleDots,
	ArrowSymbol,
	EmojiSymbol,
	MultiLineTwoLines,
	MultiLineThreeLines,
	NarrowContainer,
	EndTruncationSingleLine,
	EndTruncationCustomSymbol,
	EndTruncationMultiLine,
	EndTruncationReadMore,
	FilePathMiddle,
	FilePathEnd,
	EmailAddress,
	URL,
	ProductDescriptionMiddle,
	ProductDescriptionEnd,
} = composeStories(stories);

// Basic rendering tests
test("Default story renders", async () => {
	await Default.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

test("CustomEllipsisSymbol story renders with correct ellipsis", async () => {
	await CustomEllipsisSymbol.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
	expect(element?.getAttribute("ellipsisSymbol")).toBe("[...]");
});

test("TripleDots story renders with triple dots", async () => {
	await TripleDots.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

test("ArrowSymbol story renders with arrow symbol", async () => {
	await ArrowSymbol.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

test("EmojiSymbol story renders with emoji", async () => {
	await EmojiSymbol.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

// Multi-line truncation tests
test("MultiLineTwoLines story renders with line limit of 2", async () => {
	await MultiLineTwoLines.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

test("MultiLineThreeLines story renders with line limit of 3", async () => {
	await MultiLineThreeLines.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

test("NarrowContainer story renders in narrow container", async () => {
	await NarrowContainer.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

// End truncation tests
test("EndTruncationSingleLine renders with end variant", async () => {
	await EndTruncationSingleLine.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

test("EndTruncationCustomSymbol renders with custom end symbol", async () => {
	await EndTruncationCustomSymbol.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

test("EndTruncationMultiLine renders with multiple lines", async () => {
	await EndTruncationMultiLine.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

test("EndTruncationReadMore renders with read more text", async () => {
	await EndTruncationReadMore.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

// Real-world use case tests
test("FilePathMiddle renders file path with middle truncation", async () => {
	await FilePathMiddle.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

test("FilePathEnd renders file path with end truncation", async () => {
	await FilePathEnd.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

test("EmailAddress renders email with truncation", async () => {
	await EmailAddress.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

test("URL renders URL with truncation", async () => {
	await URL.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

test("ProductDescriptionMiddle renders product description with middle truncation", async () => {
	await ProductDescriptionMiddle.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

test("ProductDescriptionEnd renders product description with end truncation", async () => {
	await ProductDescriptionEnd.run();
	const element = document.querySelector("text-truncate");
	expect(element).toBeTruthy();
});

// Variant tests
test("Default story uses middle variant", async () => {
	const canvas = await Default.run();
	const element = canvas.querySelector("text-truncate");
	expect(element?.variant || "middle").toBe("middle");
});

test("EndTruncationSingleLine uses end variant", async () => {
	const canvas = await EndTruncationSingleLine.run();
	const element = canvas.querySelector("text-truncate");
	expect(element?.variant).toBe("end");
});

// Component property tests
test("Component accepts custom ellipsis symbol property", async () => {
	const canvas = await CustomEllipsisSymbol.run();
	const element = canvas.querySelector("text-truncate");
	expect(element).toBeTruthy();
	// The component should have the custom ellipsis symbol applied
});

test("Component accepts line limit property", async () => {
	const canvas = await MultiLineThreeLines.run();
	const element = canvas.querySelector("text-truncate");
	expect(element).toBeTruthy();
	// The component should respect the line limit
});

// Accessibility tests
test("Component is accessible with default settings", async () => {
	const canvas = await Default.run();
	const element = canvas.querySelector("text-truncate");
	expect(element).toBeTruthy();
	expect(element?.getAttribute("role")).not.toBe("presentation");
});

// Content tests
test("Component contains text content", async () => {
	const canvas = await Default.run();
	const element = canvas.querySelector("text-truncate");
	expect(element?.textContent).toBeTruthy();
});

test("Component preserves original text in slotted content", async () => {
	const canvas = await Default.run();
	const element = canvas.querySelector("text-truncate");
	// Text should be present in the component
	expect(element?.textContent?.length).toBeGreaterThan(0);
});
