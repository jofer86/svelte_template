import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'src/tests/e2e',
	testMatch: /(.+\.)?(spec|test)\.[jt]s/,
	use: {
		baseURL: 'http://localhost:4173'
	}
};

export default config;
