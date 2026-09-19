import { test, expect } from '@playwright/test';

test.describe('Modern Streamlit Widgets (Demo 006)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?app=zcl_abaplit_demo_006');
    await page.waitForSelector('.st-main');
  });

  test('renders badge and modern pill selection', async ({ page }) => {
    const badge = page.locator('.st-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('v2.0 Modern');

    const pills = page.locator('.st-pill-btn');
    await expect(pills.first()).toBeVisible();

    // Click 'Vue' pill
    const vuePill = page.locator('.st-pill-btn:has-text("Vue")');
    await vuePill.click();
    await expect(vuePill).toHaveClass(/active/);
  });

  test('interacts with segmented control switcher', async ({ page }) => {
    const segments = page.locator('.st-segment-btn');
    await expect(segments.first()).toBeVisible();

    const backendSegment = page.locator('.st-segment-btn:has-text("Backend")');
    await backendSegment.click();
    await expect(backendSegment).toHaveClass(/active/);
  });

  test('manages multiselect tags adding and removing', async ({ page }) => {
    const multiselect = page.locator('.st-multiselect-container');
    await expect(multiselect).toBeVisible();

    // Check existing tags
    const tags = page.locator('.st-multiselect-tag');
    await expect(tags.first()).toBeVisible();

    // Click to open dropdown and select an option
    await multiselect.click();
    const option = page.locator('.st-multiselect-option:has-text("Cloud")');
    if (await option.isVisible()) {
      await option.click();
      await expect(page.locator('.st-multiselect-tag:has-text("Cloud")')).toBeVisible();
    }
  });

  test('interacts with feedback star ratings', async ({ page }) => {
    const stars = page.locator('.st-star-btn');
    await expect(stars).toHaveCount(5);

    await stars.nth(3).click();
  });

  test('toggles popover overlay and status container', async ({ page }) => {
    // Popover test
    const popoverBtn = page.locator('.st-popover-btn');
    await expect(popoverBtn).toBeVisible();
    await popoverBtn.click();

    const popoverCard = page.locator('.st-popover-card');
    await expect(popoverCard).toBeVisible();

    // Status container test
    const statusContainer = page.locator('.st-status-container');
    await expect(statusContainer).toBeVisible();
    const statusHeader = page.locator('.st-status-header');
    await statusHeader.click();
    const statusBody = page.locator('.st-status-body');
    await expect(statusBody).toBeVisible();
  });

  test('filters and sorts interactive dataframe', async ({ page }) => {
    const dataframe = page.locator('.st-dataframe-container');
    await expect(dataframe).toBeVisible();

    const searchInput = page.locator('.st-search-input');
    await searchInput.fill('HANA');

    const rowCount = page.locator('.st-dataframe-count');
    await expect(rowCount).toContainText('1 of 4 rows');

    await searchInput.fill('');
    await expect(rowCount).toContainText('4 of 4 rows');

    // Sort by name column
    const sortTh = page.locator('.st-sortable-th:has-text("name")');
    await sortTh.click();
  });

  test('copies code from code widget', async ({ page }) => {
    const codeWrapper = page.locator('.st-code-wrapper');
    await expect(codeWrapper).toBeVisible();

    const copyBtn = page.locator('.st-code-copy-btn');
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();
    await expect(copyBtn).toContainText('Copied');
  });
});
