import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import NodeCGPlugin from "vite-plugin-nodecg";

export default defineConfig(() => {
	return {
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
		],
	};
});
