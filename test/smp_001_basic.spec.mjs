import { test, expect } from "@playwright/test";

const URL = "/index.html?app=Z2FIORI_CL_SMP_001_BASIC";

test.describe("Sample 001 - Basic Binding & Events", () => {
  test("loads app and executes binding, events and toast", async ({ page }) => {
    await page.goto(URL);

    // Verify initial rendering
    const greetingText = page.locator("#txtGreeting, [id$='--txtGreeting']");
    await expect(greetingText).toBeVisible({ timeout: 15000 });
    await expect(greetingText).toContainText("Hello Fiori Developer!");

    const countText = page.locator("#txtCount, [id$='--txtCount']");
    await expect(countText).toBeVisible({ timeout: 15000 });
    await expect(countText).toContainText("0");

    // Change input value
    const nameInput = page.locator("#inpName-inner, [id$='--inpName-inner'], [id$='--inpName'] input");
    await nameInput.fill("Antigravity Master");

    // Click increment button
    const countBtn = page.locator("#btnCount, [id$='--btnCount']");
    await countBtn.click();

    // Verify model updated with new input and incremented count
    await expect(greetingText).toContainText("Hello Antigravity Master!", { timeout: 10000 });
    await expect(countText).toContainText("1", { timeout: 10000 });
    await expect(page.locator(".sapMMessageToast")).toContainText("Counter is now 1", { timeout: 10000 });

    // Click show toast button
    const toastBtn = page.locator("#btnToast, [id$='--btnToast']");
    await toastBtn.click();
    await expect(page.locator(".sapMMessageToast").last()).toContainText("Welcome Antigravity Master!", { timeout: 10000 });
  });
});
