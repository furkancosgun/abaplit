import { test, expect } from "@playwright/test";

const URL = "/index.html?app=Z2FIORI_CL_SMP_005_DIALOG";

test.describe("Sample 005 - Form & Dialog Popup Suite", () => {
  test("opens dialog popup, edits inputs with two-way binding, saves and updates parent view", async ({ page }) => {
    await page.goto(URL);

    // Initial page verification
    const userText = page.locator("#txtDisplayUser, [id$='--txtDisplayUser']");
    const emailText = page.locator("#txtDisplayEmail, [id$='--txtDisplayEmail']");
    const deptText = page.locator("#txtDisplayDept, [id$='--txtDisplayDept']");
    const statusText = page.locator("#txtStatus, [id$='--txtStatus']");

    await expect(userText).toBeVisible({ timeout: 15000 });
    await expect(userText).toContainText("John Doe");
    await expect(emailText).toContainText("john.doe@example.com");
    await expect(deptText).toContainText("SAP Fiori Core");
    await expect(statusText).toContainText("No action performed yet");

    // Open popup
    const openBtn = page.locator("#btnOpenDialog, [id$='--btnOpenDialog']");
    await openBtn.click();

    // Verify dialog is visible
    const dialog = page.locator("#dlgProfile, [id$='--dlgProfile']");
    await expect(dialog).toBeVisible({ timeout: 10000 });

    // Verify inputs in popup
    const nameInput = page.locator("#inpName input, #inpName-inner, [id$='--inpName-inner']");
    const emailInput = page.locator("#inpEmail input, #inpEmail-inner, [id$='--inpEmail-inner']");
    const deptInput = page.locator("#inpDept input, #inpDept-inner, [id$='--inpDept-inner']");

    await expect(nameInput).toHaveValue("John Doe");
    await expect(emailInput).toHaveValue("john.doe@example.com");

    // Edit fields in popup
    await nameInput.fill("Alexander Hamilton");
    await emailInput.fill("alexander@treasury.gov");
    await deptInput.fill("Finance & Tech");

    // Click Save in popup
    const saveBtn = page.locator("#btnSaveInPopup, [id$='--btnSaveInPopup']");
    await saveBtn.click();

    // Dialog should close
    await expect(dialog).not.toBeVisible({ timeout: 10000 });

    // Verify updated values on the main page
    await expect(userText).toContainText("Alexander Hamilton");
    await expect(emailText).toContainText("alexander@treasury.gov");
    await expect(deptText).toContainText("Finance & Tech");
    await expect(statusText).toContainText("Profile updated: Alexander Hamilton - Finance & Tech");

    // Open popup again and test Cancel
    await openBtn.click();
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await nameInput.fill("Temp Cancelled Name");
    const cancelBtn = page.locator("#btnCancelInPopup, [id$='--btnCancelInPopup']");
    await cancelBtn.click();

    await expect(dialog).not.toBeVisible({ timeout: 10000 });
    await expect(statusText).toContainText("Edit cancelled");

    // Test Reset
    const resetBtn = page.locator("#btnReset, [id$='--btnReset']");
    await resetBtn.click();
    await expect(userText).toContainText("John Doe");
    await expect(statusText).toContainText("Data reset to default");
  });
});
