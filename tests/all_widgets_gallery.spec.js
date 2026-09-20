import { test, expect } from '@playwright/test';

test.describe('Full Widget Gallery & Builder Coverage (Demo 007)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?app=zcl_abaplit_demo_007');
    await page.waitForSelector('.st-main');
  });

  test('verifies typography, markdown, divider and metrics in header', async ({ page }) => {
    await expect(page.locator('.st-main .st-title').first()).toContainText('Demo 007: Complete Widget Gallery');
    await expect(page.locator('.st-markdown').first()).toBeVisible();
    await expect(page.locator('.st-markdown strong').first()).toContainText('Amac:');
    await expect(page.locator('.st-main .st-caption').first()).toBeVisible();
    await expect(page.locator('.st-main .st-divider').first()).toBeVisible();

    const metrics = page.locator('.st-main .st-metric');
    await expect(metrics.first()).toBeVisible();
    await expect(metrics.nth(0)).toContainText('Employees');
    await expect(metrics.nth(1)).toContainText('Coverage');
    await expect(metrics.nth(2)).toContainText('Sync Mode');
  });

  test('verifies sidebar widgets presence and interaction', async ({ page }) => {
    const sidebar = page.locator('.st-sidebar');
    await expect(sidebar).toBeVisible();

    await expect(sidebar.locator('.st-title')).toContainText('Widget Gallery');
    await expect(sidebar.locator('.st-badge')).toContainText('v007 Complete');
    await expect(sidebar.locator('.st-text-input')).toBeVisible();
    await expect(sidebar.locator('.st-toggle-slider')).toBeVisible();
    await expect(sidebar.locator('.st-color-picker')).toBeVisible();
    await expect(sidebar.locator('button:has-text("Download Sample JSON")')).toBeVisible();
    await expect(sidebar.locator('.st-page-link')).toBeVisible();
  });

  test('verifies all inputs in Tab 1 (Text, Numbers, Selections, Sliders, Pickers)', async ({ page }) => {
    // Tab 1 is active by default
    await expect(page.locator('.st-header-title').first()).toContainText('Input Widgets - Full Set');

    // Text & numeric inputs
    await expect(page.locator('.st-text-input').first()).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('.st-number-input')).toBeVisible();
    await expect(page.locator('.st-text-area')).toBeVisible();
    await expect(page.locator('.st-color-picker').first()).toBeVisible();
    await expect(page.locator('.st-file-uploader')).toBeVisible();

    // Choices & selections
    await expect(page.locator('.st-checkbox').first()).toBeVisible();
    await expect(page.locator('.st-toggle-slider').first()).toBeVisible();
    await expect(page.locator('.st-radio-group')).toBeVisible();
    await expect(page.locator('.st-select').first()).toBeVisible();
    await expect(page.locator('.st-multiselect-container')).toBeVisible();
    await expect(page.locator('.st-pill-btn').first()).toBeVisible();
    await expect(page.locator('.st-segment-btn').first()).toBeVisible();

    // Sliders & pickers
    await expect(page.locator('.st-slider').first()).toBeVisible();
    await expect(page.locator('.st-select-slider-value')).toBeVisible();
    await expect(page.locator('.st-star-btn').first()).toBeVisible();
    await expect(page.locator('.st-feedback-thumbs')).toBeVisible();
    await expect(page.locator('input[type="date"]').first()).toBeVisible();
    await expect(page.locator('input[type="time"]').first()).toBeVisible();
    await expect(page.locator('.st-date-input').first()).toBeVisible();
    await expect(page.locator('.st-time-input').first()).toBeVisible();

    // Buttons
    await expect(page.locator('button:has-text("Trigger Toast (ABAP)")')).toBeVisible();
    await expect(page.locator('button:has-text("Copy Token")')).toBeVisible();
    await expect(page.locator('a.st-link-btn:has-text("External Docs")')).toBeVisible();
  });

  test('verifies data widgets and charts in Tab 2', async ({ page }) => {
    const tab2Btn = page.locator('.st-tab-btn:has-text("Data & Charts")');
    await tab2Btn.click();

    await expect(page.locator('.st-table').first()).toBeVisible();
    await expect(page.locator('.st-dataframe-container')).toBeVisible();

    // Charts: line, bar, area, scatter
    const chartSvgs = page.locator('.st-chart-svg');
    await expect(chartSvgs).toHaveCount(4);

    // Code, JSON, HTML, Badge
    await expect(page.locator('.st-code-wrapper')).toBeVisible();
    await expect(page.locator('.st-json-box')).toBeVisible();
    await expect(page.locator('.st-html')).toBeVisible();
    await expect(page.locator('.st-badge:has-text("Data Verified")')).toBeVisible();
  });

  test('verifies layout containers and feedback widgets in Tab 3', async ({ page }) => {
    const tab3Btn = page.locator('.st-tab-btn:has-text("Layout & Feedback")');
    await tab3Btn.click();

    await expect(page.locator('.st-container').first()).toBeVisible();
    await expect(page.locator('.st-expander')).toBeVisible();
    await expect(page.locator('.st-popover-btn')).toBeVisible();
    await expect(page.locator('.st-status-container')).toBeVisible();
    await expect(page.locator('.st-dialog-box')).toBeVisible();

    // Form and FormSubmitButton
    await expect(page.locator('.st-form')).toBeVisible();
    await expect(page.locator('button:has-text("Submit Form")')).toBeVisible();

    // Alerts
    await expect(page.locator('.st-alert.success')).toBeVisible();
    await expect(page.locator('.st-alert.info')).toBeVisible();
    await expect(page.locator('.st-alert.warning').first()).toBeVisible();
    await expect(page.locator('.st-alert.error')).toBeVisible();

    // Progress, Spinner, Exception
    await expect(page.locator('.st-progress-bar').first()).toBeVisible();
    await expect(page.locator('.st-spinner-icon').first()).toBeVisible();
    await expect(page.locator('.st-alert-error')).toBeVisible();
  });

  test('verifies media, chat and download in Tab 4', async ({ page }) => {
    const tab4Btn = page.locator('.st-tab-btn:has-text("Media & Chat")');
    await tab4Btn.click();

    // Media
    await expect(page.locator('img.st-image')).toBeVisible();
    await expect(page.locator('audio.st-audio')).toBeVisible();
    await expect(page.locator('video.st-video')).toBeVisible();

    // Chat
    await expect(page.locator('.st-chat-message').first()).toBeVisible();
    await expect(page.locator('.st-chat-input')).toBeVisible();
    await expect(page.locator('.st-chat-send-btn')).toBeVisible();

    // Download & Link
    await expect(page.locator('button:has-text("Download CSV")')).toBeVisible();
    await expect(page.locator('.st-page-link:has-text("Page Link")')).toBeVisible();
    await expect(page.locator('a.st-link-btn:has-text("Open abaplit Docs")')).toBeVisible();
  });
});
