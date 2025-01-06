import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['src/tests/e2e/**/*', '**/node_modules/**'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/tests/setup.ts'],
    alias: [
      { find: '$lib', replacement: path.resolve(__dirname, './src/lib') },
      { find: '$app', replacement: path.resolve(__dirname, './src/tests/__mocks__/$app') }
    ]
  }
});