import { test, expect } from "@playwright/test";

const URL = "/index.html?app=Z2FIORI_CL_SMP_004_FEATURES&test_param=Alpha123";

test.describe("Sample 004 - Full Client Features Suite", () => {
  test("exercises title, favicon, focus, message box, followup, dirty state, nested view and shortcuts", async ({ page, context }) => {
    page.on("console", (msg) => console.log("BROWSER LOG:", msg.text()));
    page.on("response", async (res) => {
      if (res.url().includes("z2fiori")) console.log("RES BODY:", res.status(), await res.text());
    });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(URL);

    // Verify initial rendering
    const msgResultText = page.locator("#txtMsgResult, [id$='--txtMsgResult']");
    await expect(msgResultText).toBeVisible({ timeout: 15000 });

    // 1. Verify Device info bound
    const devInfo = page.locator("#txtDeviceInfo, [id$='--txtDeviceInfo']");
    await expect(devInfo).toContainText("System: Desktop");

    // 2. Set Title and Favicon
    const titleBtn = page.locator("#btnSetTitle, [id$='--btnSetTitle']");
    await titleBtn.click();
    await expect(page).toHaveTitle("New Custom Title");

    // 3. Focus Target Input
    const focusBtn = page.locator("#btnFocus, [id$='--btnFocus']");
    await focusBtn.click();
    const focusInput = page.locator("#inpFocusTarget-inner, [id$='--inpFocusTarget-inner'], [id$='--inpFocusTarget'] input");
    await expect(focusInput).toBeFocused();

    // 4. Message Box with Confirm/Cancel events
    const msgBoxBtn = page.locator("#btnMsgBox, [id$='--btnMsgBox']");
    await msgBoxBtn.click();

    const msgBoxDialog = page.locator(".sapMMessageBox");
    await expect(msgBoxDialog).toBeVisible();
    await expect(msgBoxDialog).toContainText("Are you sure you want to proceed?");

    // Click OK (Confirm)
    const okBtn = msgBoxDialog.getByRole("button", { name: "OK" });
    await okBtn.click();

    await expect(msgResultText).toContainText("Confirmed by user", { timeout: 10000 });

    // 5. Follow-up Action
    const followupBtn = page.locator("#btnFollowup, [id$='--btnFollowup']");
    await followupBtn.click();
    const followupStatus = page.locator("#txtFollowupStatus, [id$='--txtFollowupStatus']");
    await expect(followupStatus).toContainText("Followup executed successfully", { timeout: 10000 });

    // 6. Keyboard Shortcut (Ctrl+K)
    await page.keyboard.press("Control+k");
    const shortcutStatus = page.locator("#txtShortcutStatus, [id$='--txtShortcutStatus']");
    await expect(shortcutStatus).toContainText("Ctrl+K was pressed", { timeout: 10000 });

    // 7. Nested View Display & Destroy
    const nestDisplayBtn = page.locator("#btnNestDisplay, [id$='--btnNestDisplay']");
    await nestDisplayBtn.click();
    const nestedChild = page.locator("#txtNestedChild, [id$='--txtNestedChild']");
    await expect(nestedChild).toBeVisible({ timeout: 10000 });
    await expect(nestedChild).toContainText("I am a nested view content");

    const nestDestroyBtn = page.locator("#btnNestDestroy, [id$='--btnNestDestroy']");
    await nestDestroyBtn.click();
    await expect(nestedChild).toHaveCount(0);

    // 8. Dirty State
    const dirtyBtn = page.locator("#btnDirty, [id$='--btnDirty']");
    await dirtyBtn.click();
    const dirtyStatus = page.locator("#txtDirtyStatus, [id$='--txtDirtyStatus']");
    await expect(dirtyStatus).toContainText("Dirty");
  });
});
