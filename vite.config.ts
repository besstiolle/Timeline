import { sveltekit } from '@sveltejs/kit/vite';
import {defineConfig} from 'vitest/config'

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
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
