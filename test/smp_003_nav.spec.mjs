import { test, expect } from "@playwright/test";

const URL = "/index.html?app=Z2FIORI_CL_SMP_003_NAV_MAIN";

test.describe("Sample 003 - Navigation (Call and Leave Apps)", () => {
  test("navigates to child app with data and returns result back to caller", async ({ page }) => {
    page.on("console", (msg) => console.log("BROWSER LOG:", msg.text()));
    page.on("request", (req) => {
      if (req.url().includes("z2fiori")) console.log("REQ POST:", req.postData());
    });
    page.on("response", async (res) => {
      if (res.url().includes("z2fiori")) console.log("RES BODY:", res.status(), await res.text());
    });
    await page.goto(URL);

    // Verify Main app loaded
    const resultText = page.locator("#txtNavResult, [id$='--txtNavResult']");
    await expect(resultText).toBeVisible({ timeout: 15000 });
    await expect(resultText).toContainText("No result yet");

    // Change input in Main app
    const mainInput = page.locator("#inpMain-inner, [id$='--inpMain-inner'], [id$='--inpMain'] input");
    await mainInput.fill("Passed from Main");

    // Call Child App
    const callBtn = page.locator("#btnCallChild, [id$='--btnCallChild']");
    await callBtn.click();

    await page.waitForTimeout(1000);
    console.log("DOM AFTER CALL CHILD:", await page.evaluate(() => document.body.innerHTML));

    // Verify Child app loaded and received the passed value
    const receivedText = page.locator("#txtReceived, [id$='--txtReceived']");
    await expect(receivedText).toBeVisible({ timeout: 15000 });
    await expect(receivedText).toContainText("Received: Passed from Main");

    // Edit Child result input
    const childInput = page.locator("#inpChild-inner, [id$='--inpChild-inner'], [id$='--inpChild'] input");
    await childInput.fill("Modified by Child");

    // Return to Main App
    const returnBtn = page.locator("#btnReturn, [id$='--btnReturn']");
    await returnBtn.click();

    // Verify Main app is restored with previous input and new returned result
    await expect(resultText).toBeVisible({ timeout: 15000 });
    await expect(resultText).toContainText("Result: Modified by Child");
    await expect(mainInput).toHaveValue("Passed from Main");
    await expect(page.locator(".sapMMessageToast").last()).toContainText("Returned from child with: Modified by Child");
  });
});
