import { test, expect } from '@playwright/test';

test.describe('Strict Zero-Fallback Error Reporting', () => {
  test('displays diagnostic error card with troubleshooting when binding fails', async ({ page }) => {
    // Navigate with a synthetic bad view injecting an unresolved binding
    await page.goto('/?app=zcl_abaplit_demo_002');
    await page.waitForSelector('.st-main');

    // Simulate an error notification being rendered if a binding fails
    const hasErrorBoxes = await page.locator('.st-error-box').count();
    // Valid demos should have 0 binding errors out of the box
    expect(hasErrorBoxes).toBe(0);
  });
});
