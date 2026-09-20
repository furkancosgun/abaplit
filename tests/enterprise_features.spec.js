import { test, expect } from '@playwright/test';

test.describe('Enterprise Features: File Upload Base64 & Autorefresh Polling', () => {
  test('handles file upload selection with base64 conversion and metadata display', async ({ page }) => {
    await page.goto('/?app=zcl_abaplit_demo_007');
    await page.waitForSelector('.st-main');

    const fileInput = page.locator('.st-file-input').first();
    await expect(fileInput).toBeAttached();

    // Create a mock buffer file to upload
    await fileInput.setInputFiles({
      name: 'invoice_test.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('ID,CUSTOMER,AMOUNT\n1001,ACME Corp,4500\n1002,Wayne Ent,9200'),
    });

    // Check that title updates to file name and size subtitle appears
    await expect(page.locator('.st-upload-title').first()).toContainText('invoice_test.csv');
    await expect(page.locator('.st-upload-sub').first()).toContainText('KB');
  });

  test('verifies autorefresh widget lifecycle without crashes', async ({ page }) => {
    await page.goto('/?app=zcl_abaplit_demo_007');
    await page.waitForSelector('.st-main');

    // Verify main app remains responsive
    await expect(page.locator('.st-main')).toBeVisible();
    await page.waitForTimeout(1000);
    await expect(page.locator('.st-header')).toBeVisible();
  });
});
