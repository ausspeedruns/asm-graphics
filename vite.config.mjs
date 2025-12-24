import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import NodeCGPlugin from "vite-plugin-nodecg";
import svgr from "vite-plugin-svgr";
import path from "node:path";

const ReactCompilerConfig = {};

export default defineConfig({
	resolve: {
		alias: {
			"@asm-graphics/shared": path.resolve(__dirname, "./src/shared"),
		}
	},
	plugins: [
		react({
			exclude: /\.stories\.(t|j)sx?$/,
			include: "**/*.tsx",
		}),
		NodeCGPlugin({
			inputs: {
				"graphics/*.tsx": "./src/graphics/template.html",
				"dashboard/*.tsx": "./src/dashboard/template.html",
			},
		}),
		// ["babel-plugin-react-compiler", ReactCompilerConfig],
		svgr(),
	],
});
