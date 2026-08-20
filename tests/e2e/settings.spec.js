const { test, expect } = require('@playwright/test');

const fastProfile = '/?timingProfile=fast-test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("e2e-initialized")) {
      localStorage.clear();
      sessionStorage.setItem("e2e-initialized", "true");
    }
  });
  await page.goto(fastProfile);
  await expect(page.locator('#config-screen')).toBeVisible();
  await expect(page.locator('#splash-screen')).toBeHidden();
});

test('keeps meditation language and display language independent', async ({ page }) => {
  await expect(page.locator('#app-title')).toHaveText('Chakra Meditation');

  await page.selectOption('#language-select', 'ml');
  await expect(page.locator('#app-title')).toHaveText('Chakra Meditation');
  await expect(page.locator('label[for="display-language-select"]')).toHaveText('Display Language');

  await page.selectOption('#display-language-select', 'ml');
  await expect(page.locator('#app-title')).toHaveText('ചക്ര ധ്യാനം');

  await page.selectOption('#language-select', 'en');
  await expect(page.locator('#app-title')).toHaveText('ചക്ര ധ്യാനം');

  await page.selectOption('#display-language-select', 'en');
  await expect(page.locator('#app-title')).toHaveText('Chakra Meditation');
});

test('loads fast-test timing profile into controls', async ({ page }) => {
  await expect(page.locator('#time-icebreaker')).toHaveAttribute('min', '1');
  await expect(page.locator('#time-yoga-pose')).toHaveAttribute('max', '5');
  await expect(page.locator('#time-bath')).toHaveAttribute('max', '5');
  await expect(page.locator('#time-massage')).toHaveAttribute('min', '1');
  await expect(page.locator('#time-per-chakra')).toHaveAttribute('min', '0.1');
  await expect(page.locator('#time-high-energy')).toHaveAttribute('min', '0.1');
  await expect(page.locator('#time-high-energy')).toHaveAttribute('max', '1');
  await expect(page.locator('#time-interval')).toHaveAttribute('min', '2');
  await expect(page.locator('#time-interval')).toHaveValue('2');
});

test('organizes Settings controls and keeps Corpse Pose off by default', async ({ page }) => {
  await expect(page.locator('#corpse-pose-toggle')).not.toBeChecked();
  await expect(page.locator('#reverse-journey-toggle').locator('..')).toContainText('Reverse Journey');
  await expect(page.locator('#box-meditation-toggle')).toHaveCount(0);
  await expect(page.locator('#hooponopono-toggle')).toHaveCount(0);
  await expect(page.locator('#volume-mixer')).toContainText('Comfort & Visuals');
  await expect(page.locator('#audio-filters-toggle')).toHaveCount(1);
  await expect(page.locator('#settings-help-button')).toBeVisible();
  await page.locator('#settings-help-button').click();
  await expect(page.locator('#settings-help-modal')).toBeVisible();
  await page.locator('#settings-help-close').click();
  await expect(page.locator('#settings-help-modal')).toBeHidden();
});

test('builds a compact Lobby roadmap from the selected journey stages', async ({ page }) => {
  await page.locator('#bath-session-toggle').check();
  await page.locator('#massage-toggle').check();
  await page.locator('#perineal-care-toggle').check();
  await page.locator('#assisted-bathing-toggle').check();
  await page.locator('#save-config').click();
  await expect(page.locator('#lobby-screen')).toBeVisible();
  await expect(page.locator('#journey-roadmap')).toHaveText(
    'Arrival » Intention » Chakras » Closing'
  );

  await page.locator('#high-energy-toggle').check();
  await expect(page.locator('#journey-roadmap')).toHaveText('Intention » HRIM » Closing');
  await page.locator('#music-only-toggle').check();
  await expect(page.locator('#journey-roadmap')).toHaveText('Music Only');

  await page.locator('#box-breathing-experience-toggle').check();
  await expect(page.locator('#journey-roadmap')).toHaveText('Box Breathing');
  await expect(page.locator('#start-meditation')).toHaveText('Begin Box Breathing');
  await page.locator('#hooponopono-experience-toggle').check();
  await expect(page.locator('#journey-roadmap')).toHaveText('Ho\'oponopono');
  await expect(page.locator('#start-meditation')).toHaveText('Begin Ho\'oponopono');
  await page.locator('#yoga-experience-toggle').check();
  await expect(page.locator('#journey-roadmap')).toHaveText('Massage » Perineal Care » Assisted Bathing » Yoga Experience');
  await expect(page.locator('#start-meditation')).toHaveText('Begin Yoga Experience');
  await expect(page.locator('#journey-roadmap')).toHaveText('Ho\'oponopono');
  await expect(page.locator('#start-meditation')).toHaveText('Begin Ho\'oponopono');
});

test('opens the full-screen mixer and safely restarts the active journey', async ({ page }) => {
  page.on('dialog', async dialog => {
    if (dialog.type() === 'confirm') await dialog.accept();
    else await dialog.dismiss();
  });

  await page.locator('#save-config').click();
  await page.locator('#start-meditation').click();
  await expect(page.locator('#controls')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#voice-clarity')).toHaveValue('35');
  await expect(page.locator('#voice-warmth')).toHaveValue('65');
  await expect(page.locator('#voice-pace')).toHaveValue('0.9');
  await expect(page.locator('#voice-echo')).toHaveValue('spacious');

  await page.locator('#btn-mixer').click();
  const mixer = page.locator('#volume-mixer');
  await expect(mixer).toBeVisible();
  await expect(mixer).toHaveCSS('position', 'fixed');
       await expect(page.locator('#audio-filters-toggle')).toBeVisible();
       await expect(page.locator('#eyes-close-mode-toggle')).toBeVisible();
       await expect(page.locator('#mixer-no-frequency-mode-toggle')).toBeVisible();
       await expect(page.locator('#mixer-no-frequency-mode-toggle')).not.toBeChecked();
       await expect(page.locator('#no-frequency-mode-toggle')).not.toBeChecked();
       const voiceTuning = page.locator('#voice-tuning-panel');
       await expect(voiceTuning).not.toHaveAttribute('open', '');
       await voiceTuning.locator('summary').click();
       await expect(page.locator('#voice-clarity')).toBeVisible();
       await expect(page.locator('#voice-warmth')).toBeVisible();
       await expect(page.locator('#voice-pace')).toBeVisible();
       await expect(page.locator('label[for="voice-echo"]')).toHaveCSS('white-space', 'nowrap');
       await expect(page.locator('#voice-echo')).toHaveValue('spacious');
       await page.selectOption('#voice-echo', 'light');
       await expect(page.locator('#voice-echo')).toHaveValue('light');
       await page.locator('[data-voice-preset="soft"]').click();
       await expect(page.locator('#voice-warmth')).toHaveValue('65');
       await expect(page.locator('#voice-pace')).toHaveValue('0.9');
       await page.locator('#mixer-voice-preview').click();

       await page.locator('#audio-filters-toggle').check();
  await page.locator('#eyes-close-mode-toggle').check();
  await page.locator('#mixer-no-frequency-mode-toggle').check();
  await expect(page.locator('#no-frequency-mode-toggle')).toBeChecked();
  await page.locator('#vol-voice').fill('0.6');
  await page.locator('#vol-voice').dispatchEvent('input');
  await expect(page.locator('#vol-voice')).toHaveValue('0.6');

  await page.locator('#close-mixer-bottom').click();
  await expect(mixer).toBeHidden();
  await page.locator('#btn-mixer').click();
  await page.locator('#restart-meditation').click();
  await expect(page.locator('#lobby-screen')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#controls')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#lobby-screen')).toBeHidden();
});

test('keeps the Corpse Pose timing slider synchronized', async ({ page }) => {
  const corpse = page.locator('#time-corpse');
  await expect(corpse).toHaveAttribute('min', '1');
  await expect(corpse).toHaveAttribute('max', '5');
  await expect(page.locator('.yoga-timing-controls #row-corpse')).toHaveCount(1);
  await page.locator('#corpse-pose-toggle').check();
  await expect(page.locator('#row-corpse')).toHaveCSS('display', 'grid');
  await corpse.fill('4');
  await corpse.dispatchEvent('input');
  await expect(corpse).toHaveValue('4');
  await expect(page.locator('#display-corpse')).toHaveText('4s');
  await expect(page.locator('#row-corpse .range-current')).toHaveText('4s');

  await page.reload();
  await expect(page.locator('#time-corpse')).toHaveValue('4');
  await expect(page.locator('#display-corpse')).toHaveText('4s');
});

test('loads the production Corpse Pose timing range', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#config-screen')).toBeVisible();
  const corpse = page.locator('#time-corpse');
  await expect(corpse).toHaveAttribute('min', '60');
  await expect(corpse).toHaveAttribute('max', '600');
  await expect(corpse).toHaveAttribute('step', '30');
});

test('uses experiential benefit language for chakra narration', async ({ page }) => {
  const content = await page.evaluate(async () => (await fetch('/scripts.json')).json());
  for (const key of ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown', 'high_energy', 'closing']) {
    expect(content[key].meditation_en).toBeTruthy();
    expect(content[key].meditation_ml).toBeTruthy();
  }
  const anatomyClaims = /adrenal|immune|organ|gland|kidney|bladder|thyroid|pituitary|pineal|digest|liver|pancreas|lymph|blood|spinal cord|hypothalamus|thalamus|അവയവ|ഗ്രന്ഥി|വൃക്ക|തൈറോയ്ഡ്|പിറ്റ്യൂട്ടറി|പൈനൽ|ദഹന|രക്തം|നാഡീവ്യൂഹ/i;
  for (const key of ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown', 'high_energy', 'closing']) {
    expect(content[key].en).not.toMatch(anatomyClaims);
    expect(content[key].ml).not.toMatch(anatomyClaims);
  }
});

test('uses explicit spoken mantra wording and canonical Hreem pronunciation', async ({ page }) => {
  const content = await page.evaluate(async () => (await fetch('/scripts.json')).json());
  for (const [key, name] of Object.entries({ root: 'Lam', sacral: 'Vam', solar: 'Ram', heart: 'Yam', throat: 'Ham', thirdeye: 'Om', crown: 'Aum' })) {
    expect(content[key].meditation_en).toContain(`The ${name} mantra`);
    expect(content[key].en).toContain(`The ${name} mantra`);
  }
  expect(content.high_energy.mantra).toBe('HRIM');
  expect(content.high_energy.meditation_en).toContain('Hreem mantra');
  expect(content.high_energy.en).toContain('Hreem mantra');
  expect(content.high_energy.meditation_ml).toContain('ഹ്രീം');
  expect(content.high_energy.ml).toContain('ഹ്രീം');
});

test('persists zero voice volume as an intentional mute setting', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('chakra_vol_voice', '0'));
  await page.reload();
  await expect(page.locator('#vol-voice')).toHaveValue('0');
});

test('persists the independent HRIM duration from the Lobby', async ({ page }) => {
  await page.locator('#save-config').click();
  await expect(page.locator('#lobby-screen')).toBeVisible();

  await page.locator('#high-energy-toggle').check();
  await expect(page.locator('#high-energy-duration-control')).toBeVisible();
  await expect(page.locator('#time-per-chakra').locator('..')).toBeHidden();

  const duration = page.locator('#time-high-energy');
  await duration.fill('0.8');
  await duration.dispatchEvent('input');
  await expect(duration).toHaveValue('0.8');

  await page.reload();
  await expect(page.locator('#lobby-screen')).toBeVisible();
  await expect(page.locator('#high-energy-toggle')).toBeChecked();
  await expect(page.locator('#time-high-energy')).toHaveValue('0.8');
});

test('switches the generated intention for HRIM and preserves custom text', async ({ page }) => {
  const intention = page.locator('#intention-input');
  await page.selectOption('#language-select', 'en');
  await expect(intention).toHaveValue('Peace, clarity, and gentle strength');

  await page.locator('#save-config').click();
  await page.locator('#high-energy-toggle').check();
  await expect(intention).toHaveValue('Focused energy, courage, and clear action');

  await page.locator('#high-energy-toggle').uncheck();
  await expect(intention).toHaveValue('Peace, clarity, and gentle strength');

  await intention.fill('A short custom intention.');
  await page.locator('#high-energy-toggle').check();
  await expect(intention).toHaveValue('A short custom intention.');
  await page.locator('#high-energy-toggle').uncheck();
  await expect(intention).toHaveValue('A short custom intention.');
});

test('offers Sleep Mode as a Lobby experience with a shared ten-minute stage maximum', async ({ page }) => {
  await page.locator('#save-config').click();
  await page.locator('#sleep-mode-toggle').check();
  await expect(page.locator('#sleep-mode-toggle')).toBeChecked();
  await expect(page.locator('#time-per-chakra')).toHaveAttribute('max', '10');
  await expect(page.locator('#journey-roadmap')).toContainText('Sleep Mode');
  await expect(page.locator('#journey-roadmap')).toContainText('Drowsiness');
});

test('keeps HRIM selectable without a time restriction', async ({ page }) => {
  await page.locator('#save-config').click();
  await page.locator('#high-energy-toggle').check();
  await expect(page.locator('#high-energy-toggle')).toBeChecked();
  await expect(page.locator('#hrim-time-block-modal')).toHaveCount(0);
});

test('enforces Yoga Experience Bath Session add-on dependencies', async ({ page }) => {
  const bath = page.locator('#bath-session-toggle');
  const massage = page.locator('#massage-toggle');
  const perineal = page.locator('#perineal-care-toggle');
  const assisted = page.locator('#assisted-bathing-toggle');

  await expect(bath).toBeEnabled();
  await expect(massage).toBeDisabled();

  await bath.check();
  await expect(massage).toBeEnabled();
  await expect(perineal).toBeEnabled();
  await expect(assisted).toBeEnabled();

  await massage.check();
  await perineal.check();
  await assisted.check();
  await expect(page.locator('#row-massage')).toBeVisible();
  await expect(page.locator('#row-perineal-care')).toBeVisible();
  await expect(page.locator('#row-assisted-bathing')).toBeVisible();
  await expect(page.locator('#row-bath')).toBeHidden();

  await bath.uncheck();
  await expect(bath).not.toBeChecked();
  await expect(massage).not.toBeChecked();
  await expect(perineal).not.toBeChecked();
  await expect(assisted).not.toBeChecked();
  await expect(massage).toBeDisabled();
});

test('persists timing changes through settings reload', async ({ page }) => {
  await page.locator("#bath-session-toggle").check();
  const bath = page.locator('#time-bath');
  await bath.fill('3');
  await bath.dispatchEvent('input');
  await expect(bath).toHaveValue('3');

  await page.reload();
  await expect(page.locator('#time-bath')).toHaveValue('3');
});
