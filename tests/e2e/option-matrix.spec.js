const { test, expect } = require('@playwright/test');

const fastProfile = '/?timingProfile=fast-test';

async function openSettings(page) {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('e2e-initialized')) {
      localStorage.clear();
      sessionStorage.setItem('e2e-initialized', 'true');
    }
  });
  await page.goto(fastProfile);
  await expect(page.locator('#config-screen')).toBeVisible();
  await expect(page.locator('#splash-screen')).toBeHidden();
}

async function setChecked(page, id, enabled) {
  const toggle = page.locator(`#${id}`);
  if (enabled) await toggle.check();
  else if (await toggle.isChecked()) await toggle.uncheck();
}

const bathCombinations = [
  { name: 'standard bath', massage: false, perineal: false, assisted: false },
  { name: 'massage only', massage: true, perineal: false, assisted: false },
  { name: 'perineal only', massage: false, perineal: true, assisted: false },
  { name: 'assisted only', massage: false, perineal: false, assisted: true },
  { name: 'massage and perineal', massage: true, perineal: true, assisted: false },
  { name: 'massage and assisted', massage: true, perineal: false, assisted: true },
  { name: 'all bath add-ons', massage: true, perineal: true, assisted: true }
];

for (const combination of bathCombinations) {
  test(`bath flow: ${combination.name}`, async ({ page }) => {
    await openSettings(page);
    await setChecked(page, 'yoga-bridge-toggle', true);
    await setChecked(page, 'bath-session-toggle', true);
    await setChecked(page, 'massage-toggle', combination.massage);
    await setChecked(page, 'perineal-care-toggle', combination.perineal);
    await setChecked(page, 'assisted-bathing-toggle', combination.assisted);

    await expect(page.locator('#bath-session-toggle')).toBeChecked();
    for (const [id, visible] of [
      ['#row-massage', combination.massage],
      ['#row-perineal-care', combination.perineal],
      ['#row-assisted-bathing', combination.assisted],
      ['#row-bath', !combination.assisted]
    ]) {
      if (visible) await expect(page.locator(id)).toBeVisible();
      else await expect(page.locator(id)).toBeHidden();
    }
  });
}

const modeCombinations = [
  { name: 'standard', high: false, reverse: false, box: false, filters: false, hooponopono: false, noFrequency: false, musicOnly: false },
  { name: 'high energy', high: true, reverse: false, box: false, filters: false, hooponopono: false, noFrequency: false, musicOnly: false },
  { name: 'reverse journey', high: false, reverse: true, box: false, filters: false, hooponopono: false, noFrequency: false, musicOnly: false },
  { name: 'box breathing', high: false, reverse: false, box: true, filters: false, hooponopono: false, noFrequency: false, musicOnly: false },
  { name: 'audio filters', high: false, reverse: false, box: false, filters: true, hooponopono: false, noFrequency: false, musicOnly: false },
  { name: 'hooponopono without frequencies', high: false, reverse: false, box: false, filters: false, hooponopono: true, noFrequency: true, musicOnly: false },
  { name: 'music only', high: false, reverse: false, box: false, filters: false, hooponopono: false, noFrequency: false, musicOnly: true }
];

for (const combination of modeCombinations) {
  test(`journey mode: ${combination.name}`, async ({ page }) => {
    await openSettings(page);
    await setChecked(page, 'reverse-journey-toggle', combination.reverse);
    await setChecked(page, 'box-meditation-toggle', combination.box);
    // Audio Filters now live in the active full-screen mixer. Their live
    // behavior is covered by the dedicated mixer journey test.
    await setChecked(page, 'hooponopono-toggle', combination.hooponopono);
    await setChecked(page, 'no-frequency-mode-toggle', combination.noFrequency);
    await page.locator('#save-config').click();
    await expect(page.locator('#lobby-screen')).toBeVisible();
    await setChecked(page, 'high-energy-toggle', combination.high);
    await setChecked(page, 'music-only-toggle', combination.musicOnly);

    if (combination.musicOnly) {
      await expect(page.locator('#session-estimate')).toContainText('Music only');
      await expect(page.locator('#high-energy-toggle')).not.toBeChecked();
      await expect(page.locator('#box-meditation-toggle')).not.toBeChecked();
      await expect(page.locator('#hooponopono-toggle')).not.toBeChecked();
    } else if (combination.high) {
      await expect(page.locator('#high-energy-duration-control')).toBeVisible();
      await expect(page.locator('#time-per-chakra').locator('..')).toBeHidden();
      await expect(page.locator('#music-only-toggle')).not.toBeChecked();
    } else {
      await expect(page.locator('#session-estimate')).toContainText('session');
      await expect(page.locator('#music-only-toggle')).not.toBeChecked();
    }
  });
}
