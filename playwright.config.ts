import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run dev',
		port: 5173,
		reuseExistingServer: !process.env.CI
	},
	testDir: 'src/tests/e2e',
	testMatch: '**/*.spec.ts',
	use: {
		baseURL: 'http://localhost:5173',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure'
	},
	reporter: 'list'
};

export default config;
