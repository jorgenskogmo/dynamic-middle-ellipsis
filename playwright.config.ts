import { defineConfig, devices } from "@playwright/test";
import os from "node:os";

const cpuCount = os.cpus().length;
const workers = Math.max(1, Math.floor(cpuCount * 0.8));

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : workers,
	reporter: "html",
	use: {
		baseURL: "http://localhost:6006",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],
	// Run Storybook dev server before running tests
	webServer: {
		command: "npm run storybook -- --ci",
		url: "http://localhost:6006",
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
});
