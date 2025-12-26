import path from "node:path";
import { defineConfig } from "tsdown";

export default defineConfig({
	entry: "src/extensions/index.ts",
	outDir: "extension",
	clean: true,
	platform: "node",
	target: "node24.12",
	tsconfig: "tsconfig.extension.json",
	minify: true,
	outExtensions: () => ({
		js: ".js",
	}),
	inputOptions: {
		resolve: {
			alias: {
				"@asm-graphics/shared": path.resolve(import.meta.dirname, "./src/shared"),
			},
		},
	},
});
