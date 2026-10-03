import { defineConfig } from "vite";
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import NodeCGPlugin from "vite-plugin-nodecg";
import svgr from "vite-plugin-svgr";
import path from "node:path";

export default defineConfig({
	resolve: {
		alias: {
			"@asm-graphics/shared": path.resolve(import.meta.dirname, "./src/shared"),
			"@asm-graphics/shared-browser": path.resolve(import.meta.dirname, "./src/shared-browser"),
		},
	},
	plugins: [
		react({
			exclude: /\.stories\.(t|j)sx?$/,
			include: "**/*.tsx",
		}),
		babel({
			presets: [reactCompilerPreset()],
		}),
		NodeCGPlugin({
			inputs: {
				"graphics/*.tsx": "./src/graphics/template.html",
				"dashboard/*.tsx": "./src/dashboard/template.html",
			},
		}),
		svgr(),
	],
});
