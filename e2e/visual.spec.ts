import { test, expect } from "@playwright/test";

// Visual regression tests for TextTruncate stories
// Dynamically fetches stories from Storybook's index.json

const STORYBOOK_URL = "http://localhost:6006";

const viewports = [
	{ width: 320, height: 568, name: "mobile" },
	{ width: 768, height: 1024, name: "tablet" },
	{ width: 1280, height: 800, name: "desktop" },
];

// Helper to get the story iframe URL
const getStoryUrl = (storyId: string) =>
	`${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`;

// Fetch stories from Storybook's index.json
async function getStories(): Promise<{ id: string; name: string }[]> {
	const response = await fetch(`${STORYBOOK_URL}/index.json`);
	const data = await response.json();

	// Filter to only include stories (not docs)
	return Object.values(
		data.entries as Record<string, { id: string; name: string; type: string }>,
	)
		.filter((entry) => entry.type === "story")
		.map((entry) => ({ id: entry.id, name: entry.name }));
}

// Get stories before tests run
let stories: { id: string; name: string }[] = [];

test.beforeAll(async () => {
	stories = await getStories();
});

test.describe("TextTruncate Visual Tests", () => {
	for (const viewport of viewports) {
		test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
			test.beforeEach(async ({ page }) => {
				await page.setViewportSize({
					width: viewport.width,
					height: viewport.height,
				});
			});

			test("all stories", async ({ page }) => {
				// Re-fetch stories if not loaded (in case beforeAll didn't run)
				if (stories.length === 0) {
					stories = await getStories();
				}

				for (const story of stories) {
					await page.goto(getStoryUrl(story.id));
					await page.waitForSelector("text-truncate");
					await page.waitForLoadState("networkidle");
					await expect(page).toHaveScreenshot(
						`${story.id}-${viewport.name}.png`,
					);
				}
			});
		});
	}
});
