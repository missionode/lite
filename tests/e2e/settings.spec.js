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
