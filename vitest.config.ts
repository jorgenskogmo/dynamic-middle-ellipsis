import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		storybookTest({
			configDir: ".storybook",
			storybookScript: "npm run storybook -- --ci",
			storybookUrl: "http://localhost:6006",
		}),
	],
	test: {
		name: "storybook",
		browser: {
			enabled: true,
			headless: true,
			provider: playwright(),
			instances: [{ browser: "chromium" }],
		},
		setupFiles: ["./.storybook/vitest.setup.ts"],
	},
});
