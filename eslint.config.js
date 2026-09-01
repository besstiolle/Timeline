import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';
import { globalIgnores } from 'eslint/config';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	globalIgnores(['./static/analytics/*', './drizzle/*', './src/paraglide']),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		}
	},
	// 1. Configuration pour les fichiers TypeScript (.ts, .svelte.ts)
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.svelte.ts'],
		languageOptions: {
			parser: ts.parser,
			parserOptions: {
				projectService: {
					allowDefaultProject: ['drizzle.config.ts', 'svelte.config.js']
				},
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	// 2. Configuration pour les fichiers Svelte (.svelte)
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelte.parser,
			parserOptions: {
				parser: ts.parser,
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.svelte'],
				svelteConfig
			}
		}
	},
	// 3. Règles globales
	{
		rules: {
			'no-undef': 'off'
		}
	}
);
