const { test, expect } = require('@playwright/test');
const { unlockAdvancedFeatures } = require('./helpers');

const fastProfile = '/?timingProfile=fast-test';

async function openYogaExperience(page) {
  await unlockAdvancedFeatures(page);
  await page.locator('#save-config').click();
  await page.locator('#yoga-experience-toggle').check();
  await expect(page.locator('#yoga-experience-setup')).toBeVisible();
}

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
  await expect(page.locator('#time-massage')).toHaveCount(0);
  await expect(page.locator('#time-per-chakra')).toHaveAttribute('min', '0.1');
  await expect(page.locator('#time-high-energy')).toHaveAttribute('min', '0.1');
  await expect(page.locator('#time-high-energy')).toHaveAttribute('max', '1');
  await expect(page.locator('#time-interval')).toHaveAttribute('min', '2');
  await expect(page.locator('#time-interval')).toHaveValue('2');
});

test('shows the direct illustrated newcomer orientation for a normal journey with Returning Journey off', async ({ page }) => {
  await page.locator('#save-config').click();
  await expect(page.locator('#returning-journey-toggle')).not.toBeChecked();
  await page.locator('#chakra-selection input[value="crown"]').check();

  await page.locator('#start-meditation').click();
  await expect(page.locator('#newcomer-body-map')).toBeVisible({ timeout: 20000 });
  await expect(page.locator('#newcomer-aura-scene')).toBeVisible();
  await expect(page.locator('#newcomer-chakra-name')).toHaveText('Root');
  await expect(page.locator('#newcomer-chakra-location')).toContainText('spine');
  await expect(page.locator('#newcomer-tutorial-screen')).not.toContainText('A gentle introduction');
});

test('organizes Settings controls and keeps Corpse Pose off by default', async ({ page }) => {
  await expect(page.locator('#corpse-pose-toggle')).not.toBeChecked();
  await expect(page.locator('#reverse-journey-control')).toBeHidden();
  await expect(page.locator('#reverse-journey-toggle')).toBeDisabled();
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
  await unlockAdvancedFeatures(page);
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
  await expect(page.locator('#journey-roadmap')).toHaveText('Box Breathing » Ho\'oponopono');
  await page.locator('#box-breathing-experience-toggle').uncheck();
  await expect(page.locator('#journey-roadmap')).toHaveText('Ho\'oponopono');
  await expect(page.locator('#start-meditation')).toHaveText('Begin Ho\'oponopono');
  await page.locator('#hooponopono-experience-toggle').uncheck();
  await page.locator('#yoga-experience-toggle').check();
  await page.locator('#bath-session-toggle').check();
  await expect(page.locator('#journey-roadmap')).toHaveText('Bath » 15 min Rest » Yoga');
  await expect(page.locator('#start-meditation')).toHaveText('Begin Yoga Experience');
  await page.locator('#yoga-experience-toggle').uncheck();
  await page.locator('#massage-toggle').check();
  await page.locator('#perineal-care-toggle').check();
  await page.locator('#assisted-bathing-toggle').check();
  await expect(page.locator('#journey-roadmap')).toHaveText('Perineal Care » Massage · Crown to Root » Assisted Bathing');
  await expect(page.locator('#start-meditation')).toHaveText('Begin Intimate Service');
});

test('starts Box Breathing as a standalone session without requiring a chakra', async ({ page }) => {
  test.setTimeout(45000);
  await page.locator('#save-config').click();
  await page.locator('#box-breathing-experience-toggle').check();
  await expect(page.locator('#journey-roadmap')).toHaveText('Box Breathing');
  await expect(page.locator('#start-meditation')).toHaveText('Begin Box Breathing');
  await page.locator('#start-meditation').click();
  await expect(page.locator('#breathing-screen')).toBeVisible({ timeout: 30000 });
});

test('opens the full-screen mixer and safely restarts the active journey', async ({ page }) => {
  page.on('dialog', async dialog => {
    if (dialog.type() === 'confirm') await dialog.accept();
    else await dialog.dismiss();
  });

  await page.locator('#save-config').click();
  await page.locator('#chakra-selection input[value="root"]').check();
  await page.locator('#returning-journey-toggle').check();
  await page.locator('#start-meditation').click();
  await expect(page.locator('#controls')).toBeVisible({ timeout: 10000 });
  const viewport = page.viewportSize();
  await page.mouse.move(Math.floor(viewport.width / 2), viewport.height - 5);
  await expect(page.locator('body')).toHaveClass(/fullscreen-controls-visible/);
  await expect(page.locator('#fullscreen-controls-reveal-zone')).toHaveCSS('pointer-events', 'none');
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
       await expect(page.locator('#mixer-no-frequency-mode-toggle')).toBeChecked();
       await expect(page.locator('#no-frequency-mode-toggle')).toBeChecked();
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
  await expect(page.locator('#icebreaker-screen')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('#controls')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#lobby-screen')).toBeHidden();
});

test('keeps the Corpse Pose timing slider synchronized', async ({ page }) => {
  await openYogaExperience(page);
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
    const english = key === 'closing' ? content[key].en : content[key].meditation_en;
    const malayalam = key === 'closing' ? content[key].ml : content[key].meditation_ml;
    expect(english).toBeTruthy();
    expect(malayalam).toBeTruthy();
  }
  const anatomyClaims = /adrenal|immune|organ|gland|kidney|bladder|thyroid|pituitary|pineal|digest|liver|pancreas|lymph|blood|spinal cord|hypothalamus|thalamus|അവയവ|ഗ്രന്ഥി|വൃക്ക|തൈറോയ്ഡ്|പിറ്റ്യൂട്ടറി|പൈനൽ|ദഹന|രക്തം|നാഡീവ്യൂഹ/i;
  for (const key of ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown', 'high_energy', 'closing']) {
    const english = key === 'closing' ? content[key].en : content[key].meditation_en;
    const malayalam = key === 'closing' ? content[key].ml : content[key].meditation_ml;
    expect(english).not.toMatch(anatomyClaims);
    expect(malayalam).not.toMatch(anatomyClaims);
  }
});

test('uses explicit spoken mantra wording and canonical Hreem pronunciation', async ({ page }) => {
  const content = await page.evaluate(async () => (await fetch('/scripts.json')).json());
  for (const [key, name] of Object.entries({ root: 'Lam', sacral: 'Vam', solar: 'Ram', heart: 'Yam', throat: 'Ham', thirdeye: 'Om', crown: 'Aum' })) {
    expect(content[key].meditation_en).toContain(`The ${name} mantra`);
  }
  expect(content.high_energy.mantra).toBe('HRIM');
  expect(content.high_energy.meditation_en).toContain('Hreem mantra');
  expect(content.high_energy.meditation_ml).toContain('ഹ്രീം');
});

test('clamps voice volume to its supported audible minimum', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('chakra_vol_voice', '0'));
  await page.reload();
  await expect(page.locator('#vol-voice')).toHaveValue('0.2');
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
  await expect(page.locator('#high-energy-toggle')).not.toBeChecked();
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

test('keeps Sleep Mode behind the shared Advanced Features unlock', async ({ page }) => {
  await page.locator('#save-config').click();
  await expect(page.locator('#sleep-mode-control')).toBeHidden();
  await page.locator('#open-settings').click();
  await unlockAdvancedFeatures(page);
  await page.locator('#save-config').click();
  await expect(page.locator('#sleep-mode-control')).toBeVisible();
  await page.locator('#sleep-mode-toggle').check();
  await expect(page.locator('#sleep-mode-toggle')).toBeChecked();
  await expect(page.locator('#journey-roadmap')).toContainText('Sleep Mode');
  await expect(page.locator('#journey-roadmap')).toContainText('Drowsiness');
});

test('Sleep Mode winds down to dark and ends on a quiet goodnight screen', async ({ page }) => {
  test.setTimeout(120_000);
  // Very short stages so the whole Sleep journey runs in seconds.
  await page.evaluate(() => localStorage.setItem('chakra_time_sleep_stage', '0.05'));
  await page.goto(fastProfile);
  await expect(page.locator('#config-screen')).toBeVisible();
  await unlockAdvancedFeatures(page);
  await page.locator('#save-config').click();
  await page.locator('#sleep-mode-toggle').check();
  await page.locator('#start-meditation').click();
  await page.locator('#dnd-ok, #dnd-reminder-ok, [data-dnd-ack]').first().click({ timeout: 1500 }).catch(() => {});
  // The wind-down starts in the final stage: dark fade plus "Drifting into sleep".
  await expect(page.locator('body')).toHaveClass(/sleep-wind-down/, { timeout: 60_000 });
  await expect(page.locator('#mantra-display')).toHaveText(/Drifting into sleep|ഉറക്കത്തിലേക്ക്/);
  // A tap only peeks: the controls come back for a moment.
  await page.mouse.click(200, 300);
  await expect(page.locator('body')).toHaveClass(/sleep-peek/);
  // Quiet finish: dark goodnight screen, no bright completion modal.
  const goodnight = page.locator('#sleep-goodnight');
  await expect(goodnight).toBeVisible({ timeout: 60_000 });
  await expect(page.locator('#completion-modal')).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/sleep-wind-down/);
  await goodnight.click();
  await expect(goodnight).toHaveClass(/is-awake/);
  await page.locator('#sleep-goodnight-close').click();
  await expect(goodnight).toBeHidden();
  await expect(page.locator('#lobby-screen')).toBeVisible();
});

test('keeps HRIM selectable without a time restriction', async ({ page }) => {
  await page.locator('#save-config').click();
  await page.locator('#high-energy-toggle').check();
  await expect(page.locator('#high-energy-toggle')).toBeChecked();
  await expect(page.locator('#hrim-time-block-modal')).toHaveCount(0);
});

test('keeps Intimate Service independent from Yoga and shows only selected care timings', async ({ page }) => {
  await openYogaExperience(page);
  const bath = page.locator('#bath-session-toggle');
  const massage = page.locator('#massage-toggle');
  const perineal = page.locator('#perineal-care-toggle');
  const assisted = page.locator('#assisted-bathing-toggle');

  await expect(bath).toBeEnabled();
  await expect(massage).toBeEnabled();
  await expect(perineal).toBeEnabled();
  await expect(assisted).toBeEnabled();

  await massage.check();
  await perineal.check();
  await assisted.check();
  await expect(page.locator('#yoga-experience-toggle')).not.toBeChecked();
  await expect(page.locator('#yoga-experience-setup')).toBeHidden();
  await expect(page.locator('#row-perineal-care')).toBeVisible();
  await expect(page.locator('#row-assisted-bathing')).toBeVisible();
  await expect(page.locator('#time-massage')).toHaveCount(0);
  await expect(page.locator('#massage-reverse-journey-note')).toBeVisible();
});

test('persists timing changes through settings reload', async ({ page }) => {
  await openYogaExperience(page);
  await page.locator("#bath-session-toggle").check();
  const bath = page.locator('#time-bath');
  await bath.fill('3');
  await bath.dispatchEvent('input');
  await expect(bath).toHaveValue('3');

  await page.reload();
  await expect(page.locator('#time-bath')).toHaveValue('3');
});

test('dev mode reveals Reverse Journey and Self-Exploration, and the roadmap follows runtime order', async ({ page }) => {
  await page.locator('#save-config').click();
  await expect(page.locator('#reverse-journey-control')).toBeHidden();
  await expect(page.locator('#self-exploration-section')).toBeHidden();
  await page.locator('#open-settings').click();
  await unlockAdvancedFeatures(page);
  await page.locator('#save-config').click();
  await expect(page.locator('#reverse-journey-control')).toBeVisible();
  await expect(page.locator('#self-exploration-section')).toBeVisible();
  await page.locator('#chakra-selection input[value="root"]').check();
  await page.locator('#reverse-journey-toggle').check();
  await page.locator('#quiet-courage-addon-toggle').check();
  const roadmap = page.locator('#journey-roadmap');
  await expect(roadmap).toContainText('Reverse Journey (Crown ➔ Root)');
  const text = await roadmap.textContent();
  expect(text.indexOf('Intention')).toBeLessThan(text.indexOf('Quiet Courage'));
  expect(text.indexOf('Quiet Courage')).toBeLessThan(text.indexOf('Reverse Journey'));
});

test('dev mode Hush Hush game plays to the Grand Reveal with hand-off locks and relock hides it', async ({ page }) => {
  test.setTimeout(150_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#save-config').click();
  await expect(page.locator('#secret-body-game-panel')).toBeHidden();
  await page.locator('#open-settings').click();
  await unlockAdvancedFeatures(page);
  await page.locator('#save-config').click();
  await expect(page.locator('#secret-body-game-panel')).toBeVisible();
  await expect(page.locator('#open-secret-body-game')).toBeEnabled();
  await page.locator('#open-secret-body-game').click();
  const game = page.locator('#secret-body-game-screen');
  await expect(game).toBeVisible();
  await expect(game.locator('[data-sbp="players-value"]')).toHaveText('4');
  for (let i = 0; i < 2; i++) await game.locator('[data-sbp="players-down"]').click();
  await expect(game.locator('[data-sbp="players-value"]')).toHaveText('2');
  for (let i = 0; i < 2; i++) await game.locator('[data-sbp="rounds-down"]').click();
  await game.locator('[data-sbp="start"]').click();

  // Hand-off lock: a quick tap does not open the card; a 1-second hold does.
  const hold = game.locator('[data-sbp="gate-hold"]');
  await expect(hold).toBeVisible();
  await hold.click();
  await page.waitForTimeout(300);
  await expect(game.locator('[data-sbp="card"]')).toHaveCount(0);
  const holdOpen = async () => {
    await hold.dispatchEvent('pointerdown');
    await page.waitForTimeout(1100);
    await hold.dispatchEvent('pointerup', {}, { timeout: 300 }).catch(() => {});
  };
  await holdOpen();
  await expect(game.locator('[data-sbp="card"]')).toBeVisible();
  await expect(game.locator('[data-sbp="banner"]')).toBeVisible();
  await expect(game.locator('.sbp-chakra-img').first()).toHaveAttribute('src', /symbols\/(root|sacral)\.webp/);

  let sawGuessScreen = false;
  for (let step = 0; step < 300; step++) {
    if (await game.locator('[data-sbp="reveal"]').count()) break;
    if (await hold.count()) {
      await holdOpen();
    } else if (await game.locator('[data-sbp="memorised"]').count()) {
      await game.locator('[data-sbp="memorised"]').click();
    } else if (await game.locator('[data-sbp="spin"]:not([disabled])').count()) {
      await game.locator('[data-sbp="spin"]').click();
      await page.waitForTimeout(150);
    } else if (await game.locator('[data-sbp="continue"]').count()) {
      await game.locator('[data-sbp="continue"]').click();
    } else if (await game.locator('[data-sbp="flash-next"]').count()) {
      await game.locator('[data-sbp="flash-next"]').click().catch(() => {});
    } else if (await game.locator('[data-sbp="word"]').count()) {
      sawGuessScreen = true;
      await expect(game.locator('[data-sbp="banner"]')).toBeVisible();
      await expect(game.locator('[data-sbp="verdict"]')).toBeHidden();
      if (await game.locator('[data-sbp="guesser"]').count()) await game.locator('[data-sbp="guesser"]').first().click();
      await game.locator('[data-sbp="word"]').first().click();
      await expect(game.locator('[data-sbp="verdict"]')).toBeVisible();
      await game.locator('[data-sbp="wrong"]').click();
      await expect(game.locator('[data-sbp="flash"]')).toBeVisible();
    } else if (await game.locator('[data-sbp="next"]').count()) {
      await game.locator('[data-sbp="next"]').click();
    } else {
      await page.waitForTimeout(100);
    }
  }
  expect(sawGuessScreen).toBe(true);
  await expect(game.locator('[data-sbp="reveal"]')).toHaveCount(2);
  await game.locator('[data-sbp="back"]').click();
  await expect(page.locator('#lobby-screen')).toBeVisible();
  await page.locator('#open-settings').click();
  await page.locator('#advanced-features-toggle').uncheck();
  await page.locator('#save-config').click();
  await expect(page.locator('#secret-body-game-panel')).toBeHidden();
});

test('dev mode Contactless Eye Shooter explains the game from the Play Zone', async ({ page }) => {
  await page.locator('#save-config').click();
  await expect(page.locator('#open-eye-shooter')).toBeHidden();
  await page.locator('#open-settings').click();
  await unlockAdvancedFeatures(page);
  await page.locator('#save-config').click();
  await expect(page.locator('#open-eye-shooter')).toBeEnabled();
  await page.locator('#open-eye-shooter').click();
  const screen = page.locator('#eye-shooter-screen');
  await expect(screen).toBeVisible();
  await expect(screen.locator('[data-es="tier"]')).toHaveCount(5);
  await expect(screen.locator('[data-es="spot"]')).toHaveCount(12);
  await expect(screen.locator('[data-es="goal"][aria-pressed="true"]')).toHaveAttribute('data-goal', 'medium');
  await screen.locator('[data-es="goal"][data-goal="long"]').click();
  await expect(screen.locator('[data-es="goal-note"]')).toContainText('50');
  await screen.locator('[data-es="done"]').click();
  await expect(page.locator('#lobby-screen')).toBeVisible();
});

test('dev mode Chakra Touch runs a fixed giver and receiver, the receiver map, Pause and the private summary', async ({ page }) => {
  test.setTimeout(150_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#save-config').click();
  await expect(page.locator('#open-chakra-touch')).toBeHidden();
  await page.locator('#open-settings').click();
  await unlockAdvancedFeatures(page);
  await page.locator('#save-config').click();
  await expect(page.locator('#open-chakra-touch')).toBeEnabled();
  await page.locator('#open-chakra-touch').click();
  const game = page.locator('#chakra-touch-screen');
  await expect(game).toBeVisible();
  await game.locator('[data-ct="name-0"]').fill('Ravi');
  await game.locator('[data-ct="name-1"]').fill('Asha');
  // Switch puts Asha as giver and Ravi as receiver.
  await game.locator('[data-ct="switch-roles"]').click();
  await expect(game.locator('[data-ct="name-0"]')).toHaveValue('Asha');
  await expect(game.locator('[data-ct="name-1"]')).toHaveValue('Ravi');
  await expect(game.locator('[data-ct="swap-roles"]')).toHaveCount(0);
  await game.locator('[data-ct="rounds"][data-value="6"]').click();
  await game.locator('[data-ct="start"]').click();
  const hold = game.locator('[data-ct="gate-hold"]');
  const holdOpen = async () => {
    await hold.dispatchEvent('pointerdown');
    await page.waitForTimeout(1050);
    await hold.dispatchEvent('pointerup', {}, { timeout: 300 }).catch(() => {});
  };
  // Only the receiver sets a private map, then the phone goes to the giver.
  await expect(game.locator('.ct-gate-name')).toHaveText('Ravi');
  await holdOpen();
  await expect(game.locator('[data-ct="consent"]').first()).toBeVisible();
  await game.locator('[data-ct="consent"][data-zone="hair"][data-value="no"]').click();
  await game.locator('[data-ct="consent-done"]').click();
  await expect(game.locator('.ct-gate-name')).toHaveText('Asha');
  await holdOpen();
  let handOffs = 0;
  let sawPause = false;
  for (let step = 0; step < 200; step += 1) {
    if (await game.locator('[data-ct="favourites"]').count()) break;
    if (await hold.count()) { handOffs += 1; await holdOpen(); continue; }
    if (await game.locator('[data-ct="spin"]:not([disabled])').count()) {
      await expect(game.locator('[data-ct="roles"]')).toHaveText(/Asha[\s\S]*Ravi/); await game.locator('[data-ct="spin"]').click(); await page.waitForTimeout(150); continue; }
    if (await game.locator('[data-ct="zone"]').count()) {
      await expect(game.locator('[data-ct="zone"]')).not.toHaveText(/Hair/, { timeout: 1000 });
      if (!sawPause) {
        sawPause = true;
        await game.locator('[data-ct="pause"]').click();
        await expect(game.locator('[data-ct="paused"]')).toBeVisible();
        await game.locator('[data-ct="resume"]').click();
        continue;
      }
      await game.locator('[data-ct="start-timer"]').click();
      await game.locator('[data-ct="finish-early"]').click();
      continue;
    }
    for (const id of ['maybe-yes', 'choose-zone', 'rate-more', 'checkin-good', 'next']) {
      const target = game.locator(`[data-ct="${id}"]`).first();
      if (await target.count()) { await target.click(); break; }
    }
    await page.waitForTimeout(50);
  }
  expect(sawPause).toBe(true);
  expect(handOffs).toBe(0);
  await expect(game.locator('[data-ct="favourites"]')).toHaveCount(1);
  await expect(game.locator('[data-ct="favourites"]')).toContainText('Ravi');
  await expect(game.locator('[data-ct="again-switched"]')).toContainText('Ravi');
  await game.locator('[data-ct="end-back"]').click();
  await expect(page.locator('#lobby-screen')).toBeVisible();
});

test('Pitch Mode starts a public two-minute demo and keeps Pitch-only voices out of Settings', async ({ page }) => {
  const voiceOptions = await page.locator('#voice-select option').evaluateAll(options => options.map(option => option.value));
  expect(voiceOptions.some(value => /ryan|pratham|dmitri/.test(value))).toBe(false);
  await page.locator('#save-config').click();
  const panel = page.locator('#pitch-mode-panel');
  await expect(panel).toBeVisible();
  await expect(panel.locator('[data-pitch-mood]')).toHaveCount(4);
  const order = await page.evaluate(() => {
    const index = id => Array.from(document.querySelectorAll('[id]')).findIndex(element => element.id === id);
    return [index('shots-control'), index('pitch-mode-panel'), index('lobby-title')];
  });
  expect(order[0]).toBeLessThan(order[1]);
  expect(order[1]).toBeLessThan(order[2]);
  await panel.locator('[data-pitch-mood="focus"]').click();
  await expect(page.locator('#meditation-screen')).toBeVisible({ timeout: 15000 });
  // The title follows the content language (Malayalam by default).
  await expect(page.locator('#mantra-display')).toHaveText(/^(Focus|ശ്രദ്ധ)$/);
  await page.locator('#stop-meditation').click({ force: true });
  await expect(page.locator('#lobby-screen')).toBeVisible();
  await expect(page.locator('#pitch-invite')).toBeHidden();
});
