const { test, expect } = require('@playwright/test');

async function waitForReady(page) {
  await page.waitForFunction(() => document.getElementById('splash-screen')?.classList.contains('hidden'), null, { timeout: 20_000 });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function capture(page, cdp, phase) {
  const pageMetrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const scripts = performance.getEntriesByType('resource')
      .filter(entry => /\.m?js(?:\?|$)/.test(new URL(entry.name).pathname))
      .map(entry => ({ name: new URL(entry.name).pathname, encodedBodySize: entry.encodedBodySize, transferSize: entry.transferSize }));
    const practice = scripts.filter(entry => /\/(?:box-breathing|dharana|visualization|hooponopono|undo-unlearn|body-scan|guided-noting)-practice\.js$/.test(entry.name));
    const sky = scripts.filter(entry => /\/(?:astronomy\.browser\.min|sky-stars|sky-astronomy|night-sky|celestial-presence|ambient-particle-field|visual-engine)\.js$/.test(entry.name));
    const app = scripts.find(entry => entry.name === '/app.js');
    return {
      navigation: {
        domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
        loadMs: Math.round(navigation.loadEventEnd)
      },
      scriptCount: scripts.length,
      scriptEncodedBytes: scripts.reduce((sum, item) => sum + item.encodedBodySize, 0),
      scriptTransferBytes: scripts.reduce((sum, item) => sum + item.transferSize, 0),
      appBytes: app?.encodedBodySize || 0,
      skyBytes: sky.reduce((sum, item) => sum + item.encodedBodySize, 0),
      practiceModuleCount: practice.length,
      practiceBytes: practice.reduce((sum, item) => sum + item.encodedBodySize, 0),
      serviceWorkerControlled: Boolean(navigator.serviceWorker?.controller)
    };
  });
  const cdpMetrics = await cdp.send('Performance.getMetrics');
  const selected = Object.fromEntries(cdpMetrics.metrics
    .filter(metric => ['ScriptDuration', 'TaskDuration', 'JSHeapUsedSize', 'Nodes'].includes(metric.name))
    .map(metric => [metric.name, metric.value]));
  return { phase, ...pageMetrics, cdp: selected };
}

test('records cold, warm and offline startup baseline without starting playback', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://**/*', route => route.abort());
  await page.addInitScript(() => {
    localStorage.setItem('chakra_configured', 'true');
    localStorage.setItem('chakra_display_language', 'en');
  });
  const cdp = await context.newCDPSession(page);
  await cdp.send('Performance.enable');

  await page.goto(`${baseURL}/`, { waitUntil: 'load' });
  await waitForReady(page);
  const cold = await capture(page, cdp, 'cold');
  await page.evaluate(() => navigator.serviceWorker.register('./sw.js'));
  await page.evaluate(() => navigator.serviceWorker.ready);
  const shellCache = await page.evaluate(async () => {
    const cache = await caches.open('chakra-v5.296');
    const urls = (await cache.keys()).map(request => new URL(request.url).pathname + new URL(request.url).search);
    return {
      appEntryPresent: urls.includes('/app.js?v=4.00'),
      sessionCountdownModulePresent: urls.includes('/modules/session-countdown.js?v=1.0'),
      journeyChromeModulePresent: urls.includes('/modules/journey-chrome.js?v=1.0'),
      videoPreludeModulePresent: urls.includes('/modules/journey-video-prelude.js?v=1.0'),
      ambientParticleFieldModulePresent: urls.includes('/modules/ambient-particle-field.js?v=1.0'),
      visualEngineModulePresent: urls.includes('/modules/visual-engine.js?v=1.0'),
      stylesheetEntryPresent: urls.includes('/style.css?v=2.03')
    };
  });
  expect(shellCache.appEntryPresent).toBe(true);
  expect(shellCache.sessionCountdownModulePresent).toBe(true);
  expect(shellCache.journeyChromeModulePresent).toBe(true);
  expect(shellCache.videoPreludeModulePresent).toBe(true);
  expect(shellCache.ambientParticleFieldModulePresent).toBe(true);
  expect(shellCache.visualEngineModulePresent).toBe(true);
  expect(shellCache.stylesheetEntryPresent).toBe(true);

  await page.reload({ waitUntil: 'load' });
  await waitForReady(page);
  const warm = await capture(page, cdp, 'warm');
  expect(warm.serviceWorkerControlled).toBe(true);
  expect(cold.practiceModuleCount).toBe(0);

  await context.setOffline(true);
  await page.reload({ waitUntil: 'load' });
  await waitForReady(page);
  const offline = await capture(page, cdp, 'offline');
  expect(offline.serviceWorkerControlled).toBe(true);
  expect(errors).toEqual([]);
  expect(offline.scriptCount).toBeGreaterThan(0);
  expect(offline.practiceModuleCount).toBe(0);

  console.log(`MODULARIZATION_BASELINE ${JSON.stringify({ cold, warm, offline, errors })}`);
  await context.close();
});
