const { defineConfig, devices } = require('@playwright/test');
const testPort = Number(process.env.PLAYWRIGHT_PORT || 4173);
const testBaseURL = `http://127.0.0.1:${testPort}`;

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: testBaseURL,
    browserName: 'chromium',
    ...devices['Desktop Chrome'],
    headless: true,
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: process.env.PLAYWRIGHT_SCREENSHOTS === '1' ? 'only-on-failure' : 'off',
    video: 'retain-on-failure'
  },
  webServer: {
    command: `python3 -m http.server ${testPort}`,
    url: testBaseURL,
    reuseExistingServer: true,
    timeout: 10_000
  }
});
