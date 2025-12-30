import { test, expect } from "@playwright/test";

// Visual regression tests for TextTruncate stories
// These tests use Storybook's iframe view for isolated component testing

const STORYBOOK_URL = "http://localhost:6006";

// Helper to get the story iframe URL
const getStoryUrl = (storyId: string) =>
	`${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`;

test.describe("TextTruncate Visual Tests", () => {
	test.beforeEach(async ({ page }) => {
		// Wait for fonts to load to ensure consistent screenshots
		await page.waitForLoadState("networkidle");
	});

	// Basic stories
	test("Default story", async ({ page }) => {
		await page.goto(getStoryUrl("components-texttruncate--default"));
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("default.png");
	});

	test("Custom ellipsis symbol", async ({ page }) => {
		await page.goto(
			getStoryUrl("components-texttruncate--custom-ellipsis-symbol"),
		);
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("custom-ellipsis-symbol.png");
	});

	test("Triple dots", async ({ page }) => {
		await page.goto(getStoryUrl("components-texttruncate--triple-dots"));
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("triple-dots.png");
	});

	test("Arrow symbol", async ({ page }) => {
		await page.goto(getStoryUrl("components-texttruncate--arrow-symbol"));
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("arrow-symbol.png");
	});

	test("Emoji symbol", async ({ page }) => {
		await page.goto(getStoryUrl("components-texttruncate--emoji-symbol"));
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("emoji-symbol.png");
	});

	// Multi-line stories
	test("Multi-line two lines", async ({ page }) => {
		await page.goto(
			getStoryUrl("components-texttruncate--multi-line-two-lines"),
		);
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("multi-line-two-lines.png");
	});

	test("Multi-line three lines", async ({ page }) => {
		await page.goto(
			getStoryUrl("components-texttruncate--multi-line-three-lines"),
		);
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("multi-line-three-lines.png");
	});

	test("Narrow container", async ({ page }) => {
		await page.goto(getStoryUrl("components-texttruncate--narrow-container"));
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("narrow-container.png");
	});

	// End truncation stories
	test("End truncation single line", async ({ page }) => {
		await page.goto(
			getStoryUrl("components-texttruncate--end-truncation-single-line"),
		);
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("end-truncation-single-line.png");
	});

	test("End truncation custom symbol", async ({ page }) => {
		await page.goto(
			getStoryUrl("components-texttruncate--end-truncation-custom-symbol"),
		);
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("end-truncation-custom-symbol.png");
	});

	test("End truncation multi-line", async ({ page }) => {
		await page.goto(
			getStoryUrl("components-texttruncate--end-truncation-multi-line"),
		);
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("end-truncation-multi-line.png");
	});

	// Real-world use cases
	test("File path middle", async ({ page }) => {
		await page.goto(getStoryUrl("components-texttruncate--file-path-middle"));
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("file-path-middle.png");
	});

	test("File path end", async ({ page }) => {
		await page.goto(getStoryUrl("components-texttruncate--file-path-end"));
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("file-path-end.png");
	});

	test("Email address", async ({ page }) => {
		await page.goto(getStoryUrl("components-texttruncate--email-address"));
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("email-address.png");
	});

	test("URL", async ({ page }) => {
		await page.goto(getStoryUrl("components-texttruncate--url"));
		await page.waitForSelector("text-truncate");
		await expect(page).toHaveScreenshot("url.png");
	});

	// Responsive tests at different viewport widths
	test.describe("Responsive behavior", () => {
		const viewports = [
			{ width: 320, height: 568, name: "mobile" },
			{ width: 768, height: 1024, name: "tablet" },
			{ width: 1280, height: 800, name: "desktop" },
		];

		for (const viewport of viewports) {
			test(`Default at ${viewport.name} (${viewport.width}px)`, async ({
				page,
			}) => {
				await page.setViewportSize({
					width: viewport.width,
					height: viewport.height,
				});
				await page.goto(getStoryUrl("components-texttruncate--default"));
				await page.waitForSelector("text-truncate");
				await expect(page).toHaveScreenshot(`default-${viewport.name}.png`);
			});
		}
	});
});
