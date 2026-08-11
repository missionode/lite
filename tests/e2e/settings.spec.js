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
  await expect(page.locator('.config-group').filter({ hasText: 'Guided Practices' })).toContainText('Box Meditation');
  await expect(page.locator('#volume-mixer')).toContainText('Comfort & Visuals');
  await expect(page.locator('#audio-filters-toggle')).toHaveCount(1);
  await expect(page.locator('#settings-help-button')).toBeVisible();
  await page.locator('#settings-help-button').click();
  await expect(page.locator('#settings-help-modal')).toBeVisible();
  await page.locator('#settings-help-close').click();
  await expect(page.locator('#settings-help-modal')).toBeHidden();
});

test('keeps Settings free of nested horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    settingsWidth: document.querySelector('#config-screen')?.scrollWidth || 0,
    consultationEntryWidth: document.querySelector('.consultation-entry-actions')?.scrollWidth || 0,
    consultationEntryClientWidth: document.querySelector('.consultation-entry-actions')?.clientWidth || 0
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
  expect(dimensions.settingsWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
  expect(dimensions.consultationEntryWidth).toBeLessThanOrEqual(dimensions.consultationEntryClientWidth + 1);
});

test('builds a compact Lobby roadmap from the selected journey stages', async ({ page }) => {
  await page.locator('#box-meditation-toggle').check();
  await page.locator('#yoga-bridge-toggle').check();
  await page.locator('#bath-session-toggle').check();
  await page.locator('#massage-toggle').check();
  await page.locator('#perineal-care-toggle').check();
  await page.locator('#assisted-bathing-toggle').check();
  await page.locator('#hooponopono-toggle').check();
  await page.locator('#corpse-pose-toggle').check();
  await page.locator('#save-config').click();
  await expect(page.locator('#lobby-screen')).toBeVisible();
  await expect(page.locator('#journey-roadmap')).toHaveText(
    'Arrival » Intention » Breathing » Chakras » Yoga » Massage » Perineal Care » Assisted Bathing » Closing » Ho\'oponopono » Savasana'
  );

  await page.locator('#high-energy-toggle').check();
  await expect(page.locator('#journey-roadmap')).toHaveText('Intention » HRIM » Closing');
  await page.locator('#music-only-toggle').check();
  await expect(page.locator('#journey-roadmap')).toHaveText('Music Only');
});

test('opens the single-participant consultation entry point and returns a saved plan to Lobby', async ({ page }, testInfo) => {
  await page.locator('#save-config').click();
  await expect(page.locator('#lobby-screen')).toBeVisible();
  await page.locator('#open-settings').click();
  await expect(page.locator('#config-screen')).toBeVisible();
  await page.locator('#begin-consultation').click();
  await expect(page.locator('#consultation-screen')).toBeVisible();

  await page.locator('#consultation-name').fill('Test Client');
  await page.locator('#consultation-citizenship').selectOption('IN');
  await expect(page.locator('#consultation-contact')).toHaveValue('+91 ');
  await expect(page.locator('#consultation-emergency-phone')).toHaveValue('+91 ');
  await page.locator('#consultation-contact').fill('+919876543210');
  await page.locator('#consultation-email').fill('test@example.com');
  await page.locator('#consultation-goal').fill('Feel grounded and clear.');
  await page.locator('#consultation-reverse-journey').selectOption('reconnect');
  await page.locator('#consultation-language').selectOption('en');
  await page.locator('#consultation-sensitivities').fill('None');
  await page.locator('#consultation-medication').selectOption('private');
  await page.locator('#consultation-medication-details').fill('Discussed privately with the guide.');
  await page.locator('#time-per-chakra').evaluate((input) => {
    input.value = '1';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.locator('input[name="chakraFocus"][value="heart"]').check();
  await expect(page.locator('[data-chakra-question="heart"]')).toBeVisible();
  await page.locator('select[name="chakraAnswer_heart_1"]').selectOption('sometimes');
  await page.locator('select[name="chakraAnswer_heart_2"]').selectOption('often');
  await page.locator('select[name="chakraAnswer_heart_3"]').selectOption('rarely');
  await page.locator('#chakra-need-heart').selectOption('more');
  await page.locator('textarea[name="chakraNote_heart"]').fill('Support compassion and connection.');
  await page.locator('#consultation-tone').selectOption('soft');
  await page.locator('#consultation-voice-gender').selectOption('female');
  await page.locator('#consultation-sleep').selectOption('guide');
  await page.locator('#consultation-sleep').selectOption('needed');
  await expect(page.locator('#consultation-corpse')).toBeChecked();
  await expect(page.locator('#consultation-corpse-time')).toHaveValue('3600');
  await expect(page.locator('#consultation-savasana-sleep-note')).toBeVisible();
  await page.locator('#consultation-sleep').selectOption('guide');
  await expect(page.locator('#consultation-corpse')).not.toBeChecked();
  await page.locator('#consultation-touch').selectOption('yes');
  await page.locator('#consultation-yoga-enabled').selectOption('yes');
  await expect(page.locator('#consultation-yoga-options')).toBeVisible();
  await page.locator('input[name="yogaPose"][value="balasana"]').check();
  await page.locator('#consultation-bath-enabled').selectOption('yes');
  await expect(page.locator('#consultation-bath-options')).toBeVisible();
  await expect(page.locator('#consultation-touch-care-options')).toBeVisible();
  await page.locator('input[name="massage"]').check();
  await page.locator('input[name="perinealCare"]').check();
  await page.locator('#consultation-touch').selectOption('no');
  await expect(page.locator('#consultation-touch-care-options')).toBeHidden();
  await expect(page.locator('input[name="massage"]')).toBeDisabled();
  await page.locator('#consultation-touch').selectOption('yes');
  await expect(page.locator('#consultation-touch-care-options')).toBeVisible();
  await page.locator('input[name="massage"]').check();
  await page.locator('input[name="perinealCare"]').check();
  await page.locator('#save-consultation').click();

  await expect(page.locator('#consultation-review-screen')).toBeVisible();
  await expect(page.locator('#review-print')).toBeVisible();
  await page.locator('#review-print').click();
  const standardPrintFrame = page.locator('iframe.manual-plan-print-frame');
  await expect(standardPrintFrame.contentFrame().locator('.manual-plan-logo')).toBeVisible();
  await expect(standardPrintFrame.contentFrame().locator('title')).toHaveText('');
  await expect(standardPrintFrame.contentFrame().locator('body')).not.toContainText('Session Plan');
  await expect(standardPrintFrame.contentFrame().locator('body')).not.toContainText('Generated');
  await expect(standardPrintFrame.contentFrame().locator('body')).not.toContainText('http');
  await expect(page.locator('#consultation-review-summary')).toContainText('Test Client');
  await expect(page.locator('#consultation-review-summary')).toContainText('+919876543210');
  await expect(page.locator('#consultation-review-summary')).toContainText('Complete plan details');
  await expect(page.locator('#consultation-review-summary')).toContainText('Support compassion and connection.');
  await expect(page.locator('#review-audio-filters')).toBeChecked();
  await expect(page.locator('#review-safety-row')).toBeVisible();
  await expect(page.locator('#review-reverse-journey-row')).toBeVisible();
  await expect(page.locator('#consultation-review-advice')).toContainText('grounding-focused Reverse Journey');
  await page.locator('#review-safety-confirm').check();
  await page.locator('#review-reverse-journey').check();
  await page.evaluate(() => {
    const cameraCanvas = document.createElement('canvas');
    cameraCanvas.width = 640;
    cameraCanvas.height = 480;
    const cameraContext = cameraCanvas.getContext('2d');
    cameraContext.fillStyle = '#454545';
    cameraContext.fillRect(0, 0, cameraCanvas.width, cameraCanvas.height);
    const cameraStream = cameraCanvas.captureStream(5);
    setInterval(() => {
      cameraContext.fillStyle = '#454545';
      cameraContext.fillRect(0, 0, cameraCanvas.width, cameraCanvas.height);
    }, 100);
    const testAudioContext = new AudioContext();
    const audioDestination = testAudioContext.createMediaStreamDestination();
    const oscillator = testAudioContext.createOscillator();
    oscillator.connect(audioDestination);
    oscillator.start();
    navigator.mediaDevices.getUserMedia = async constraints => constraints?.audio
      ? audioDestination.stream
      : cameraStream;
    class TestMediaRecorder {
      static isTypeSupported() { return true; }
      constructor(stream, options = {}) {
        this.stream = stream;
        this.mimeType = options.mimeType || 'video/webm';
        this.state = 'inactive';
      }
      start() { this.state = 'recording'; }
      pause() { this.state = 'paused'; }
      resume() { this.state = 'recording'; }
      stop() {
        this.state = 'inactive';
        this.ondataavailable?.({ data: new Blob(['test-recording'], { type: this.mimeType }) });
        this.onstop?.();
      }
    }
    window.MediaRecorder = TestMediaRecorder;
    window.__chakraConsentTestTimings = {
      planPageMs: 35,
      planTransitionMs: 25,
      readingLeadMs: 1000
    };
  });
  await page.locator('#approve-consultation').click();

  await expect(page.locator('#consultation-consent-screen')).toBeVisible();
  await expect(page.locator('#consent-prompt-text')).toContainText('Test Client');
  await expect(page.locator('#consent-prompt-text')).toContainText('prescribed medication');
  await expect(page.locator('#consent-prompt-text')).toContainText('will not stop, start, or change');
  await expect(page.locator('#consent-prompt-text')).toContainText('Yoga Bridge');
  await expect(page.locator('#consent-prompt-text')).toContainText('Massage');
  await expect(page.locator('#consent-prompt-text')).toContainText('Perineal Care');
  await expect(page.locator('#consent-prompt-text')).toContainText('touch or assistance');
  const plan = await page.evaluate(() => JSON.parse(localStorage.getItem('chakra_consultation_plan')));
  expect(plan.schemaVersion).toBe(1);
  expect(plan.participantCount).toBe(1);
  expect(plan.profile.name).toBe('Test Client');
  expect(plan.goal).toBe('Feel grounded and clear.');
  expect(plan.language).toBe('en');
  expect(plan.chakraFocus).toEqual(['heart']);
  expect(plan.chakraResponses.heart.attention).toBe('more');
  expect(plan.chakraResponses.heart.answers).toEqual(['sometimes', 'often', 'rarely']);
  expect(plan.chakraResponses.heart.note).toBe('Support compassion and connection.');
  expect(plan.chakraDurations.heart).toBeGreaterThan(plan.chakraDurations.root);
  expect(plan.preferences.yogaBridgeEnabled).toBe(true);
  expect(plan.preferences.voiceGender).toBe('female');
  expect(plan.preferences.selectedYogaPoses).toEqual(['balasana']);
  expect(plan.preferences.massageEnabled).toBe(true);
  expect(plan.preferences.perinealCareEnabled).toBe(true);
  expect(plan.status).toBe('guide-approved');
  expect(plan.approvedSettings.audioFilters).toBe(true);
  expect(plan.approvedSettings.reverseJourney).toBe(true);

  const confirmationOrder = await page.locator('#consent-review-stage').evaluate(stage => {
    const camera = stage.querySelector('.consent-live-stage');
    const script = stage.querySelector('.consent-prompter');
    return Boolean(camera && script && camera.compareDocumentPosition(script) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(confirmationOrder).toBe(true);
  await expect(page.locator('#consent-review-stage .consent-prompter')).toHaveCSS('overflow-y', 'visible');
  const confirmationScriptFit = await page.locator('#consent-review-stage .consent-prompter').evaluate(element => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight
  }));
  expect(confirmationScriptFit.scrollHeight).toBeLessThanOrEqual(confirmationScriptFit.clientHeight + 1);
  const actionAlignment = await page.locator('.consent-review-actions').evaluate(actions => {
    const [continueButton, cancelButton] = Array.from(actions.querySelectorAll('button')).map(button => button.getBoundingClientRect());
    return Math.abs(continueButton.top - cancelButton.top);
  });
  expect(actionAlignment).toBeLessThan(2);

  const videoPlanText = await page.evaluate(() => getConsentPlanPages(JSON.parse(localStorage.getItem('chakra_consultation_plan'))).flat().join(' '));
  expect(videoPlanText).toContain('Feel grounded and clear.');
  expect(videoPlanText).toContain('Yoga Bridge');
  expect(videoPlanText).not.toContain('test@example.com');
  expect(videoPlanText).not.toContain('+919876543210');
  expect(videoPlanText).not.toContain('Discussed privately with the guide.');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#consent-continue-to-recording').click();
  await expect(page.locator('#consent-record-stage')).toBeVisible();
  await expect(page.locator('#consent-preview-stage')).toBeHidden();
  await expect(page.locator('#consent-scroll-speed-value')).toHaveText('Comfortable');
  const cameraBounds = await page.locator('.teleprompter-shell').boundingBox();
  expect(cameraBounds.width).toBeGreaterThanOrEqual(389);
  expect(cameraBounds.height).toBeGreaterThanOrEqual(843);

  await page.locator('#consent-record').click();
  await expect(page.locator('#consent-composite-canvas')).toHaveAttribute('data-composition-phase', 'plan');
  if (process.env.CONSENT_VISUAL_CAPTURE) {
    const planFrame = await page.locator('#consent-composite-canvas').evaluate(canvas => canvas.toDataURL('image/png').split(',')[1]);
    await testInfo.attach('consent-plan-frame', { body: Buffer.from(planFrame, 'base64'), contentType: 'image/png' });
  }
  const planPageCount = Number(await page.locator('#consent-composite-canvas').getAttribute('data-plan-pages'));
  expect(planPageCount).toBeGreaterThan(0);
  await expect(page.locator('#consent-record')).toBeVisible({ timeout: 3_000 });
  await expect(page.locator('#consent-record')).toHaveAttribute('aria-label', 'Start Consent Recording');
  await expect(page.locator('#consent-countdown')).toBeHidden();
  await expect(page.locator('#consent-pause')).toBeHidden();
  await expect(page.locator('#consent-composite-canvas')).toHaveAttribute('data-composition-phase', 'transition');
  await page.locator('#consent-record').click();
  await expect(page.locator('#consent-pause')).toBeVisible({ timeout: 6_000 });
  await expect(page.locator('#consent-composite-canvas')).toHaveAttribute('width', '1280');
  await expect(page.locator('#consent-composite-canvas')).toHaveAttribute('height', '720');
  await expect(page.locator('#consent-composite-canvas')).toHaveAttribute('data-video-format', 'landscape-16:9');
  await expect(page.locator('#consent-composite-canvas')).toHaveAttribute('data-plan-design', 'luxury-document');
  await expect(page.locator('#consent-composite-canvas')).toHaveAttribute('data-consent-design', 'luxury-document-evidence');
  await expect(page.locator('#consent-composite-canvas')).toHaveAttribute('data-composition-phase', 'consent');
  if (process.env.CONSENT_VISUAL_CAPTURE) {
    const consentFrame = await page.locator('#consent-composite-canvas').evaluate(canvas => canvas.toDataURL('image/png').split(',')[1]);
    await testInfo.attach('consent-evidence-frame', { body: Buffer.from(consentFrame, 'base64'), contentType: 'image/png' });
  }

  const initialScroll = await page.locator('.teleprompter-copy-slot .consent-prompter').evaluate(element => element.scrollTop);
  await page.waitForTimeout(150);
  const heldScroll = await page.locator('.teleprompter-copy-slot .consent-prompter').evaluate(element => element.scrollTop);
  expect(heldScroll).toBe(initialScroll);
  await page.waitForTimeout(950);
  const movedScroll = await page.locator('.teleprompter-copy-slot .consent-prompter').evaluate(element => element.scrollTop);
  expect(movedScroll).toBeGreaterThan(heldScroll);

  await page.locator('#consent-pause').click();
  await expect(page.locator('#consent-pause')).toBeVisible();
  await expect(page.locator('#consent-pause')).toHaveAttribute('aria-label', 'Resume Recording');
  const pausedScroll = await page.locator('.teleprompter-copy-slot .consent-prompter').evaluate(element => element.scrollTop);
  await page.waitForTimeout(350);
  await expect.poll(() => page.locator('.teleprompter-copy-slot .consent-prompter').evaluate(element => element.scrollTop)).toBe(pausedScroll);
  await page.locator('#consent-pause').click();
  await expect(page.locator('#consent-pause')).toHaveAttribute('aria-label', 'Pause / Resume');

  await page.locator('#consent-stop').click();
  await expect(page.locator('#consent-preview-stage')).toBeVisible();
  await expect(page.locator('#consent-record-stage')).toBeHidden();
  await expect(page.locator('#consent-video-preview')).toBeVisible();
  await expect(page.locator('#consent-video-preview')).toHaveCSS('aspect-ratio', '16 / 9');
  await expect(page.locator('.consent-preview-sequence')).toContainText('Approved Session Plan');
  await expect(page.locator('#consent-preview-plan-count')).toContainText(`${planPageCount} silent plan pages`);
  await expect(page.locator('.consent-preview-sequence')).toContainText('Spoken Consent');
  await expect(page.locator('#consent-retry')).toBeVisible();
  await expect(page.locator('#consent-retry')).toContainText('Retry Recording');
  const retryViewportPosition = await page.locator('#consent-retry').evaluate(button => ({
    top: button.getBoundingClientRect().top,
    bottom: button.getBoundingClientRect().bottom,
    viewport: window.innerHeight
  }));
  expect(retryViewportPosition.top).toBeGreaterThanOrEqual(0);
  expect(retryViewportPosition.bottom).toBeLessThanOrEqual(retryViewportPosition.viewport);
  if (process.env.CONSENT_VISUAL_CAPTURE) {
    await testInfo.attach('consent-review-screen', { body: await page.screenshot(), contentType: 'image/png' });
  }
  await page.locator('#consent-retry').click();
  await expect(page.locator('#consent-record-stage')).toBeVisible();
  await expect(page.locator('#consent-recording-clock')).toHaveText('00:00');
});

test('Guide Review routes sensitive plans to manual delivery and removes movement stages', async ({ page }) => {
  await page.locator('#save-config').click();
  await page.locator('#open-settings').click();
  await page.locator('#begin-consultation').click();
  await page.locator('#consultation-name').fill('Sensitive Client');
  await page.locator('#consultation-citizenship').selectOption('IN');
  await page.locator('#consultation-contact').fill('+919876543211');
  await page.locator('#consultation-email').fill('sensitive@example.com');
  await page.locator('#consultation-goal').fill('Feel safe and supported.');
  await page.locator('#consultation-yoga-enabled').selectOption('yes');
  await page.locator('input[name="yogaPose"][value="balasana"]').check();
  await page.locator('input[name="sensitivityType"][value="audio"]').check();
  await page.locator('input[name="sensitivityType"][value="movement"]').check();
  await page.locator('#save-consultation').click();

  await expect(page.locator('#consultation-review-screen')).toBeVisible();
  await expect(page.locator('#consultation-review-advice')).toContainText('manual session');
  await expect(page.locator('#review-safety-row')).toBeVisible();
  await expect(page.locator('#review-manual-only-row')).toBeVisible();
  await expect(page.locator('.consultation-safety-flagged')).toHaveCount(1);
  await expect(page.locator('#review-print')).toBeVisible();
  const mobileOverflow = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    appWidth: document.getElementById('app')?.scrollWidth || 0
  }));
  expect(mobileOverflow.documentWidth).toBeLessThanOrEqual(mobileOverflow.viewportWidth + 1);
  expect(mobileOverflow.appWidth).toBeLessThanOrEqual(mobileOverflow.viewportWidth + 1);
  await expect(page.locator('#save-manual-plan')).toBeVisible();
  await expect(page.locator('#return-manual-lobby')).toBeVisible();
  await expect(page.locator('#approve-consultation')).toBeHidden();
  await page.locator('#review-guide-notes').fill('Discuss private comfort preferences before approving movement.');
  await expect(page.locator('#review-print')).toBeVisible();
  await page.locator('#review-print').click();
  const printFrame = page.locator('iframe.manual-plan-print-frame');
  await expect(printFrame).toHaveCount(1);
  await expect(printFrame.contentFrame().locator('.manual-plan-logo')).toHaveAttribute('src', /logo_453x453\.png/);
  await expect(printFrame.contentFrame().locator('title')).toHaveText('');
  await expect(printFrame.contentFrame().locator('body')).not.toContainText('Generated');
  await expect(printFrame.contentFrame().locator('body')).not.toContainText('Manual Session Plan');
  await expect(printFrame.contentFrame().locator('body')).not.toContainText('http');

  let firstDialogMessage = '';
  page.once('dialog', async dialog => {
    firstDialogMessage = dialog.message();
    await dialog.dismiss();
  });
  await page.locator('#save-manual-plan').click();
  expect(firstDialogMessage).toContain('flagged safety information');
  await page.locator('#review-safety-confirm').check();
  await page.locator('#review-manual-only').check();

  let savedDialogMessage = '';
  page.once('dialog', async dialog => {
    savedDialogMessage = dialog.message();
    await dialog.accept();
  });
  await page.locator('#save-manual-plan').click();
  expect(savedDialogMessage).toContain('Manual Guide Only');
  await page.locator('#return-manual-lobby').click();
  await expect(page.locator('#lobby-screen')).toBeVisible();

  const plan = await page.evaluate(() => JSON.parse(localStorage.getItem('chakra_consultation_plan')));
  expect(plan.status).toBe('manual-guide-required');
  expect(plan.sessionRoute).toBe('manual-guide');
  expect(plan.preferences.yogaBridgeEnabled).toBe(false);
  expect(plan.preferences.corpsePoseEnabled).toBe(false);
  expect(plan.preferences.selectedYogaPoses).toEqual([]);
  expect(plan.approvedSettings.movementStages).toBe('removed-by-guide-review');
  expect(plan.guideReview.notes).toContain('private comfort preferences');

  let blockedDialogMessage = '';
  page.once('dialog', async dialog => {
    blockedDialogMessage = dialog.message();
    await dialog.accept();
  });
  await page.locator('#start-meditation').click();
  expect(blockedDialogMessage).toContain('manual guide-led');
});

test('applies the correct Yoga dependency for injury, medication, and pregnancy answers', async ({ page }) => {
  await page.locator('#save-config').click();
  await page.locator('#open-settings').click();
  await page.locator('#begin-consultation').click();
  await page.locator('#consultation-touch').selectOption('yes');
  const restrictedAnswers = [
    ['#consultation-physical', 'yes'],
    ['#consultation-medication', 'private'],
    ['#consultation-pregnancy', 'yes']
  ];

  for (const [index, [selector, value]] of restrictedAnswers.entries()) {
    await page.locator('#consultation-yoga-enabled').selectOption('yes');
    await expect(page.locator('#consultation-yoga-options')).toBeVisible();
    await page.locator(selector).selectOption(value);
    if (index === 0) {
      await expect(page.locator('#consultation-yoga-enabled')).toHaveValue('no');
      await expect(page.locator('#consultation-yoga-enabled')).toBeDisabled();
      await expect(page.locator('#consultation-yoga-options')).toBeHidden();
      await expect(page.locator('#consultation-yoga-restriction-note')).toBeVisible();
    } else if (index === 1) {
      await expect(page.locator('#consultation-yoga-enabled')).toHaveValue('yes');
      await expect(page.locator('#consultation-yoga-enabled')).toBeEnabled();
      await expect(page.locator('#consultation-yoga-options')).toBeVisible();
    } else {
      await expect(page.locator('#consultation-yoga-enabled')).toHaveValue('yes');
      await expect(page.locator('.consultation-yoga-pose-option').first()).toBeHidden();
      await expect(page.locator('#consultation-yoga-options')).toBeVisible();
      await expect(page.locator('#consultation-yoga-pose-restriction-note')).toBeVisible();
      await page.locator('#consultation-bath-enabled').selectOption('yes');
      await expect(page.locator('#consultation-bath-options')).toBeVisible();
      await expect(page.locator('#consultation-touch-care-options')).toBeVisible();
    }
    await page.locator(selector).selectOption('no');
    await expect(page.locator('#consultation-yoga-enabled')).toBeEnabled();
  }

  await page.locator('#consultation-yoga-enabled').selectOption('yes');
  await page.locator('#consultation-pregnancy').selectOption('postpartum');
  await expect(page.locator('.consultation-yoga-pose-option').first()).toBeVisible();
  await expect(page.locator('.consultation-yoga-pose-timing').first()).toBeVisible();
  await expect(page.locator('#consultation-yoga-pose-restriction-note')).toBeHidden();
});

test('opens the full-screen mixer and safely restarts the active journey', async ({ page }) => {
  page.on('dialog', async dialog => {
    if (dialog.type() === 'confirm') await dialog.accept();
    else await dialog.dismiss();
  });

  await page.locator('#save-config').click();
  await page.locator('#start-meditation').click();
  const sleepPrompt = page.locator('#sleep-mode-prompt');
  if (await sleepPrompt.isVisible({ timeout: 1000 }).catch(() => false)) {
    await page.locator('#sleep-mode-disable').click();
  }
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
       await expect(page.locator('#mixer-frequencies-toggle')).toBeVisible();
       await expect(page.locator('#mixer-frequencies-toggle')).toBeChecked();
       await expect(page.locator('#frequencies-toggle')).toBeChecked();
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
  await page.locator('#mixer-frequencies-toggle').check();
  await expect(page.locator('#frequencies-toggle')).toBeChecked();
  await page.locator('#vol-voice').fill('0.6');
  await page.locator('#vol-voice').dispatchEvent('input');
  await expect(page.locator('#vol-voice')).toHaveValue('0.6');

  await page.locator('#close-mixer-bottom').click();
  await expect(mixer).toBeHidden();
  await page.locator('#btn-mixer').click();
  await page.locator('#restart-meditation').click();
  await expect(page.locator('#lobby-screen')).toBeVisible({ timeout: 10000 });
  const restartSleepPrompt = page.locator('#sleep-mode-prompt');
  try {
    await expect(restartSleepPrompt).toBeVisible({ timeout: 3000 });
    await page.locator('#sleep-mode-disable').click();
  } catch {
    // Daytime journeys do not show the evening Sleep Mode choice.
  }
  await expect(page.locator('#controls')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#lobby-screen')).toBeHidden();
});

test('keeps the Corpse Pose timing slider synchronized', async ({ page }) => {
  const corpse = page.locator('#time-corpse');
  await expect(corpse).toHaveAttribute('min', '1');
  await expect(corpse).toHaveAttribute('max', '5');
  await expect(page.locator('.yoga-timing-controls #row-corpse')).toHaveCount(1);
  await page.locator('#yoga-bridge-toggle').check();
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
  await expect(corpse).toHaveAttribute('max', '3600');
  await expect(corpse).toHaveAttribute('step', '60');
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

test('offers the Sleep Mode decision before an evening journey', async ({ page }) => {
  await page.evaluate(() => {
    const NativeDate = Date;
    const evening = new NativeDate(2026, 7, 8, 19, 0, 0).getTime();
    window.Date = class extends NativeDate {
      constructor(...args) { if (args.length) super(...args); else super(evening); }
      static now() { return evening; }
    };
  });
  page.on('dialog', dialog => dialog.dismiss());

  await page.locator('#save-config').click();
  await page.locator('#start-meditation').click();
  await expect(page.locator('#sleep-mode-prompt')).toBeVisible();
  await expect(page.locator('#sleep-mode-enable')).toBeVisible();
  await expect(page.locator('#sleep-mode-disable')).toBeVisible();
  await expect(page.locator('#sleep-mode-prompt-close')).toBeVisible();
  await page.locator('#sleep-mode-prompt-close').click();
  await expect(page.locator('#sleep-mode-prompt')).toBeHidden();
  await expect(page.locator('#lobby-screen')).toBeVisible();
});

test('blocks HRIM outside the daytime window before starting audio', async ({ page }) => {
  await page.evaluate(() => {
    const NativeDate = Date;
    const blockedTime = new NativeDate(2026, 7, 8, 13, 0, 0).getTime();
    window.Date = class extends NativeDate {
      constructor(...args) { if (args.length) super(...args); else super(blockedTime); }
      static now() { return blockedTime; }
    };
  });
  await page.locator('#save-config').click();
  await page.locator('#high-energy-toggle').check();
  await page.locator('#start-meditation').click();
  await expect(page.locator('#hrim-time-block-modal')).toBeVisible();
  await expect(page.locator('#hrim-time-block-message')).toContainText('3:30 AM');
  await page.locator('#hrim-time-block-lobby').click();
  await expect(page.locator('#hrim-time-block-modal')).toBeHidden();
  await expect(page.locator('#lobby-screen')).toBeVisible();
});

test('enforces Yoga Bridge and Bath Session add-on dependencies', async ({ page }) => {
  const yoga = page.locator('#yoga-bridge-toggle');
  const bath = page.locator('#bath-session-toggle');
  const massage = page.locator('#massage-toggle');
  const perineal = page.locator('#perineal-care-toggle');
  const assisted = page.locator('#assisted-bathing-toggle');

  await expect(bath).toBeDisabled();
  await expect(massage).toBeDisabled();

  await yoga.check();
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

  await yoga.uncheck();
  await expect(bath).not.toBeChecked();
  await expect(massage).not.toBeChecked();
  await expect(perineal).not.toBeChecked();
  await expect(assisted).not.toBeChecked();
  await expect(massage).toBeDisabled();
});

test('persists timing changes through settings reload', async ({ page }) => {
  await page.locator("#yoga-bridge-toggle").check();
  await page.locator("#bath-session-toggle").check();
  const bath = page.locator('#time-bath');
  await bath.fill('3');
  await bath.dispatchEvent('input');
  await expect(bath).toHaveValue('3');

  await page.reload();
  await expect(page.locator('#time-bath')).toHaveValue('3');
});
