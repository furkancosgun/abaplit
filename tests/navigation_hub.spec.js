import { test, expect } from '@playwright/test';

test.describe('Streamlit Hub & Global Navigation (Demo 000)', () => {
  test('renders top header, app badge, rerun button and theme toggle', async ({ page }) => {
    await page.goto('/?app=zcl_abaplit_demo_000');
    await page.waitForSelector('.st-header');

    const badge = page.locator('.st-status-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('zcl_abaplit_demo_000');

    const rerunBtn = page.locator('button[title*="Rerun"]');
    await expect(rerunBtn).toBeVisible();

    const themeBtn = page.locator('button[title*="Mode"]');
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await themeBtn.click();
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
  });

  test('renders titles, metrics, columns and navigation cards', async ({ page }) => {
    await page.goto('/?app=zcl_abaplit_demo_000');
    await page.waitForSelector('.st-title');

    const title = page.locator('.st-main .st-title');
    await expect(title).toContainText('abaplit');

    const columns = page.locator('.st-columns');
    await expect(columns.first()).toBeVisible();

    const metrics = page.locator('.st-metric');
    await expect(metrics.first()).toBeVisible();

    const linkButtons = page.locator('.st-link-btn');
    await expect(linkButtons.first()).toBeVisible();
  });
});
