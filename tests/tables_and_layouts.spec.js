import { test, expect } from '@playwright/test';

test.describe('Streamlit Tables & Layouts (Demo 003 & Demo 005)', () => {
  test('renders business tables and expander in Demo 003', async ({ page }) => {
    await page.goto('/?app=zcl_abaplit_demo_003');
    await page.waitForSelector('.st-table');

    const tables = page.locator('.st-table');
    await expect(tables.first()).toBeVisible();

    const expanderHeader = page.locator('.st-expander-header');
    await expect(expanderHeader).toBeVisible();
    await expanderHeader.click();

    const jsonBox = page.locator('.st-json-box');
    await expect(jsonBox).toBeVisible();
  });

  test('switches tabs and interacts with dialog modal in Demo 005', async ({ page }) => {
    await page.goto('/?app=zcl_abaplit_demo_005');
    await page.waitForSelector('.st-tabs-container');

    const tabButtons = page.locator('.st-tab-btn');
    await expect(tabButtons).toHaveCount(3);

    await tabButtons.nth(1).click();
    await expect(tabButtons.nth(1)).toHaveClass(/active/);

    const dialogOverlay = page.locator('.st-dialog-overlay');
    if (await dialogOverlay.isVisible()) {
      const closeBtn = page.locator('.st-dialog-close');
      await closeBtn.click();
      await expect(dialogOverlay).not.toBeVisible();
    }
  });
});
