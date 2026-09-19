import { test, expect } from '@playwright/test';

test.describe('Streamlit Forms & Reactive Two-Way Bindings (Demo 002)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?app=zcl_abaplit_demo_002');
    await page.waitForSelector('.st-main');
  });

  test('renders form controls with two-way state binding', async ({ page }) => {
    const textInputs = page.locator('.st-text-input');
    await expect(textInputs.first()).toBeVisible();

    const select = page.locator('.st-select');
    await expect(select).toBeVisible();

    const toggle = page.locator('.st-toggle-slider');
    await expect(toggle).toBeVisible();

    const slider = page.locator('.st-slider');
    await expect(slider).toBeVisible();

    const colorPicker = page.locator('.st-color-picker');
    await expect(colorPicker).toBeVisible();

    const textarea = page.locator('.st-text-area');
    await expect(textarea).toBeVisible();
  });

  test('updates text input and persists across roundtrip submission', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Ada Lovelace');

    const submitBtn = page.locator('button.st-btn-primary');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    const successAlert = page.locator('.st-alert.success');
    await expect(successAlert).toBeVisible();
    await expect(successAlert).toContainText('Ada Lovelace');

    const submissionsTable = page.locator('.st-table');
    await expect(submissionsTable).toBeVisible();
    await expect(submissionsTable).toContainText('Ada Lovelace');
  });
});
