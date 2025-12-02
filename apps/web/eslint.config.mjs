// apps/web/eslint.config.mjs
import path from "node:path";
import next from "eslint-config-next";
import tseslint from "typescript-eslint";

export default [
	...next,
	...tseslint.configs.recommended,
	{
		files: ["**/*.{ts,tsx,js,jsx}"],
		languageOptions: {
			parserOptions: {
				project: [path.resolve(import.meta.dirname, "./tsconfig.json")],
				tsconfigRootDir: path.resolve(import.meta.dirname),
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
			],
			"no-case-declarations": "off",
			"no-console": "warn",
			"no-mixed-spaces-and-tabs": "warn",
			"@next/next/no-img-element": "warn",
		},
		ignores: [".next/**", "dist/**", "build/**", "node_modules/**"],
	},
];
