const { test, expect } = require('@playwright/test');

async function waitForReady(page) {
  await page.waitForFunction(() => document.getElementById('splash-screen')?.classList.contains('hidden'), null, { timeout: 20_000 });
}

test('loads only the selected preparation practice and serves it from cache offline', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://**/*', route => route.abort());
  await page.addInitScript(() => {
    localStorage.setItem('chakra_configured', 'true');
    localStorage.setItem('chakra_display_language', 'en');
  });

  await page.goto(`${baseURL}/`, { waitUntil: 'load' });
  await waitForReady(page);
  const beforeStart = await page.evaluate(() => ({
    loadedPracticeGlobals: [
      'ChakraBodyScanPractice', 'ChakraGuidedNotingPractice', 'ChakraDharanaPractice',
      'ChakraBoxBreathingPractice', 'ChakraVisualizationPractice',
      'ChakraHooponoponoPractice', 'ChakraUndoUnlearnPractice'
    ].filter(name => Boolean(window[name]))
  }));
  expect(beforeStart.loadedPracticeGlobals).toEqual([]);
  await page.evaluate(() => navigator.serviceWorker.register('./sw.js'));
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'load' });
  await waitForReady(page);
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);

  await page.locator('#box-breathing-experience-toggle').check();
  await page.locator('#start-meditation').click();
  await page.waitForFunction(() => Boolean(window.ChakraBoxBreathingPractice), null, { timeout: 20_000 });
  const loaded = await page.evaluate(() => performance.getEntriesByType('resource')
    .map(entry => new URL(entry.name).pathname)
    .filter(path => /\/(?:box-breathing|body-scan|guided-noting|dharana|visualization|hooponopono|undo-unlearn)-practice\.js$/.test(path)));
  expect(loaded).toEqual(['/modules/box-breathing-practice.js']);
  expect(errors).toEqual([]);
  await context.close();
});
