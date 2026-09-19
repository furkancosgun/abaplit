import { test, expect } from '@playwright/test';

test.describe('Streamlit Charts & Analytics (Demo 001)', () => {
  test('renders SVG charts and responds to simulation trigger', async ({ page }) => {
    await page.goto('/?app=zcl_abaplit_demo_001');
    await page.waitForSelector('.st-chart-svg');

    const charts = page.locator('.st-chart-svg');
    await expect(charts).toHaveCount(3);

    const dataTable = page.locator('.st-table');
    await expect(dataTable).toBeVisible();

    const simulateBtn = page.locator('button:has-text("Simulate Growth")');
    if (await simulateBtn.isVisible()) {
      await simulateBtn.click();
      const successAlert = page.locator('.st-alert.success');
      await expect(successAlert).toBeVisible();
    }
  });

  test('displays hover tooltips on chart data points', async ({ page }) => {
    await page.goto('/?app=zcl_abaplit_demo_001');
    await page.waitForSelector('.st-chart-svg');

    const circles = page.locator('.st-chart-svg circle');
    if (await circles.count() > 0) {
      await circles.first().hover();
      const tooltip = page.locator('.st-chart-svg text[font-weight="600"]');
      await expect(tooltip).toBeVisible();
    }
  });
});
