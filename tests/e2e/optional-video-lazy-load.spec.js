const { test, expect } = require('@playwright/test');

async function waitForReady(page) {
  await page.waitForFunction(() => document.getElementById('splash-screen')?.classList.contains('hidden'), null, { timeout: 20_000 });
}

test('does not request optional introduction video until the user selects it', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  const page = await context.newPage();
  const videoRequests = [];
  const moduleRequests = [];
  const errors = [];
  const consoleErrors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (request.url().includes('/modules/journey-video-prelude.js?v=1.0')) moduleRequests.push(request.url());
  });
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  await page.route('https://**/*', route => route.abort());
  await page.route('**/video/generate.mp4', async route => {
    videoRequests.push(route.request().url());
    await route.abort();
  });
  await page.addInitScript(() => {
    localStorage.setItem('chakra_configured', 'true');
    localStorage.setItem('chakra_display_language', 'en');
  });

  await page.goto(`${baseURL}/`, { waitUntil: 'load' });
  await waitForReady(page);
  expect(videoRequests).toHaveLength(0);
  expect(moduleRequests).toHaveLength(0);
  expect(await page.locator('#journey-video-prelude-media').getAttribute('src')).toBeNull();
  expect(await page.evaluate(() => typeof window.ChakraJourneyVideoPrelude)).toBe('undefined');

  await page.locator('#chakra-selection input[value="root"]').check();
  await page.locator('#journey-video-prelude-toggle').check();
  await page.locator('#start-meditation').click();
  await expect.poll(() => moduleRequests.length).toBe(1);
  await expect.poll(() => videoRequests.length).toBeGreaterThan(0);
  expect(errors).toEqual([]);
  const unexpectedConsoleErrors = consoleErrors.filter(message => !message.includes('net::ERR_FAILED'));
  expect(unexpectedConsoleErrors).toEqual([]);
  console.log(`OPTIONAL_VIDEO_REQUESTS ${JSON.stringify({ initialModuleRequests: 0, moduleAfterOptIn: moduleRequests.length, initialVideoRequests: 0, videoAfterOptIn: videoRequests.length, errors, consoleErrors })}`);
  await context.close();
});

test('loads the video controller only after the explicit Settings audio preview', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  const page = await context.newPage();
  const moduleRequests = [];
  const videoRequests = [];
  page.on('request', request => {
    if (request.url().includes('/modules/journey-video-prelude.js?v=1.0')) moduleRequests.push(request.url());
  });
  await page.route('**/video/generate.mp4', async route => {
    videoRequests.push(route.request().url());
    await route.abort();
  });
  await page.addInitScript(() => {
    localStorage.setItem('chakra_configured', 'true');
    localStorage.setItem('chakra_display_language', 'en');
  });

  await page.goto(`${baseURL}/`, { waitUntil: 'load' });
  await waitForReady(page);
  expect(moduleRequests).toHaveLength(0);
  await page.locator('#preview-video-audio').evaluate(button => button.click());
  await expect.poll(() => moduleRequests.length).toBe(1);
  await expect.poll(() => videoRequests.length).toBe(1);
  await context.close();
});
