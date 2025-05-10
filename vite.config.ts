import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { sveltekit } from '@sveltejs/kit/vite';
import {defineConfig} from 'vitest/config'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => ({
	plugins: [
		paraglideVitePlugin({ 
			project: './project.inlang', 
			outdir: './src/paraglide' 
		}),
		tailwindcss(),
		sveltekit()],
	test: {
	  include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
	  globals: true,
	  environment: 'jsdom',
	  coverage: {
		reporter: ['text', 'json', 'html'],
	  },
	},
	resolve: {
		conditions: mode === 'test' ? ['browser'] : [],
	},
}));
