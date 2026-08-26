import { test, expect } from "@playwright/test";

const URL = "/index.html?app=Z2FIORI_CL_SMP_002_POPUPS";

test.describe("Sample 002 - LIFO Popups", () => {
  test("handles recursive LIFO popups and closeAll", async ({ page }) => {
    page.on("console", (msg) => console.log("BROWSER LOG:", msg.text()));
    await page.goto(URL);

    // Initial state
    const statusText = page.locator("#txtStatus, [id$='--txtStatus']");
    await expect(statusText).toBeVisible({ timeout: 15000 });
    await expect(statusText).toContainText("No popup opened");

    // Open Dialog 1
    const openBtn1 = page.locator("#btnOpenPopup1, [id$='--btnOpenPopup1']");
    await openBtn1.click();

    const dlg1 = page.locator("#dlgFirst, [id$='--dlgFirst']");
    await expect(dlg1).toBeVisible({ timeout: 10000 });
    await expect(statusText).toContainText("Dialog 1 is open");

    // Open Dialog 2 from Dialog 1
    const openBtn2 = page.locator("#btnOpenPopup2, [id$='--btnOpenPopup2']");
    await openBtn2.click();

    const dlg2 = page.locator("#dlgSecond, [id$='--dlgSecond']");
    await expect(dlg2).toBeVisible({ timeout: 10000 });
    await expect(dlg1).toBeVisible({ timeout: 10000 });
    await expect(statusText).toContainText("Dialog 2 is open on top of Dialog 1");

    // Close top dialog (Dialog 2)
    const closeTopBtn = page.locator("#btnCloseTop, [id$='--btnCloseTop']");
    await closeTopBtn.click();

    await expect(dlg2).not.toBeVisible({ timeout: 10000 });
    await expect(dlg1).toBeVisible({ timeout: 10000 });
    await expect(statusText).toContainText("Closed top dialog");

    // Open Dialog 2 again
    await openBtn2.click();
    await expect(dlg2).toBeVisible({ timeout: 10000 });

    // Close all dialogs
    const closeAllBtn = page.locator("#btnCloseAll, [id$='--btnCloseAll']");
    await closeAllBtn.click();

    await expect(dlg2).not.toBeVisible({ timeout: 10000 });
    await expect(dlg1).not.toBeVisible({ timeout: 10000 });
    await expect(statusText).toContainText("Closed all dialogs");
  });
});
