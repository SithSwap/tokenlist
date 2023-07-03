import type { UserConfig } from 'vite';
import type { InlineConfig } from 'vitest';

import { fileURLToPath } from 'url';

export default {
	resolve: {
		alias: {
			$tests: fileURLToPath(new URL('tests', import.meta.url)),
			$src: fileURLToPath(new URL('src', import.meta.url))
		}
	},

	build: {
		emptyOutDir: false,
		outDir: 'dist',
		sourcemap: true,
		lib: {
			entry: {},
			formats: ['es']
		}
	},

	test: {
		globals: true,
		testTimeout: 60000,
		setupFiles: [fileURLToPath(new URL('tests/setup.ts', import.meta.url))]
	}
} satisfies UserConfig & { test: InlineConfig };
