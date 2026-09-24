const { expect } = require('@playwright/test');

const ACCEPTED_TEST_DIGEST = '5ba583e9f1bc6e5836e2822f5982c8cafeb4390af1f9ed140926dd3326e515a3';

async function unlockAdvancedFeatures(page) {
  await page.evaluate(expectedDigest => {
    const originalDigest = crypto.subtle.digest.bind(crypto.subtle);
    Object.defineProperty(crypto.subtle, 'digest', {
      configurable: true,
      value: async (algorithm, data) => {
        const candidate = new TextDecoder().decode(data);
        if (algorithm === 'SHA-256' && candidate === 'playwright-accepted-test-input') {
          return Uint8Array.from(expectedDigest.match(/.{2}/g), byte => parseInt(byte, 16)).buffer;
        }
        return originalDigest(algorithm, data);
      }
    });
  }, ACCEPTED_TEST_DIGEST);

  await page.locator('#app-version-unlock').evaluate(element => {
    for (let tap = 0; tap < 7; tap += 1) element.click();
  });
  await expect(page.locator('#advanced-password-modal')).toBeVisible();
  await page.locator('#advanced-password-input').fill('playwright-accepted-test-input');
  await page.locator('#advanced-password-form button[type="submit"]').click();
  await expect(page.locator('#advanced-password-modal')).toBeHidden();
  await expect(page.locator('#advanced-features-control')).toBeVisible();
}

module.exports = { unlockAdvancedFeatures };
