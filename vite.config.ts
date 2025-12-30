import { defineConfig } from "vite";

export default defineConfig({
	root: "./src/text-truncate",
	server: {
		port: 5173,
		open: true,
	},
});
