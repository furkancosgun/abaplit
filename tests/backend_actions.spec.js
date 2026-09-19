import { test, expect } from '@playwright/test';

test.describe('Backend Actions (Toast, Title, Clipboard)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?app=zcl_abaplit_demo_006');
    await page.waitForSelector('.st-main');
  });

  test('consumes TOAST action triggered from ABAP backend', async ({ page }) => {
    const toastBtn = page.locator('button.st-btn:has-text("Trigger Toast")');
    await expect(toastBtn).toBeVisible();
    await toastBtn.click();

    const toastItem = page.locator('.st-toast-item');
    await expect(toastItem).toBeVisible();
    await expect(toastItem).toContainText('Action executed successfully from ABAP!');

    const closeBtn = toastItem.locator('.st-toast-close');
    await closeBtn.click();
    await expect(toastItem).not.toBeVisible();
  });

  test('consumes TITLE action triggered from ABAP backend', async ({ page }) => {
    const titleBtn = page.locator('button.st-btn:has-text("Change Window Title")');
    await expect(titleBtn).toBeVisible();
    await titleBtn.click();

    await expect(page).toHaveTitle('abaplit: Action Triggered Title');

    const toastItem = page.locator('.st-toast-item');
    await expect(toastItem).toBeVisible();
    await expect(toastItem).toContainText('Window title changed!');
  });

  test('consumes CLIPBOARD_WRITE action triggered from ABAP backend', async ({ page }) => {
    const copyBtn = page.locator('button.st-btn:has-text("Copy to Clipboard")');
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();

    const toastItem = page.locator('.st-toast-item');
    await expect(toastItem).toBeVisible();
    await expect(toastItem).toContainText('Token copied to clipboard!');

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe('abaplit-token-xyz-123');
  });
});
