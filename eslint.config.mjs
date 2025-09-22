import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default defineConfig([
	globalIgnores(["shared/dist/*", "extension/*", "graphics/*", "dashboard/*"]),
	{
		extends: compat.extends(
			"eslint:recommended",
			"plugin:react/recommended",
			"plugin:@typescript-eslint/eslint-recommended",
			"plugin:react-you-might-not-need-an-effect/legacy-recommended",
		),

		plugins: {
			react,
			"react-hooks": fixupPluginRules(reactHooks),
			"@typescript-eslint": typescriptEslint,
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				Atomics: "readonly",
				SharedArrayBuffer: "readonly",
			},

			parser: tsParser,
			ecmaVersion: 2018,
			sourceType: "module",

			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},

		settings: {
			react: {
				pragma: "React",
				version: "detect",
			},
		},

		rules: {
			indent: [
				"error",
				"tab",
				{
					SwitchCase: 1,
				},
			],

			"linebreak-style": ["off", "windows"],
			quotes: ["error", "double"],
			semi: ["error", "always"],
			"capitalized-comments": "off",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
			"react/react-in-jsx-scope": "off", // Not needed with React 17+
			"no-fallthrough": [
				"error",
				{
					allowEmptyCase: true,
				},
			],
		},
	},
	{
		files: ["**/*.ts", "**/*.tsx"],

		languageOptions: {
			parser: tsParser,
		},

		rules: {
			"no-unused-vars": "off",
		},
	},
]);
