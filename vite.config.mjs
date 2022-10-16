import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import NodeCGPlugin from 'vite-plugin-nodecg';
import globby from 'globby';

export default defineConfig({
	plugins: [
		react({
			exclude: /\.stories\.(t|j)sx?$/,
			include: '**/*.tsx',
		}),
		NodeCGPlugin(),
	],
	build: {
		rollupOptions: {
			input: globby.sync(['./src/dashboard/*.tsx', './src/graphics/*.tsx']),
		},
	},
	server: {
		port: 3000,
	},
});
