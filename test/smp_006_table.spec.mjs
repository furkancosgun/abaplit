import { test, expect } from "@playwright/test";

const URL = "/index.html?app=Z2FIORI_CL_SMP_006_TABLE";

test.describe("Sample 006 - Table & Row Action Event Suite", () => {
  test("renders table, clicks row action passing dynamic parameters, edits via popup and updates table", async ({ page }) => {
    await page.goto(URL);

    // Initial page verification
    const statusText = page.locator("#txtTableStatus, [id$='--txtTableStatus']");
    await expect(statusText).toBeVisible({ timeout: 15000 });
    await expect(statusText).toContainText("Flight list loaded");

    // Table rows check
    const table = page.locator("#tblFlights, [id$='--tblFlights']");
    await expect(table).toBeVisible({ timeout: 10000 });

    const rows = table.locator("tbody tr.sapMListTblRow, tbody tr.sapMLIB");
    await expect(rows).toHaveCount(3);

    // First row checks
    const firstRow = rows.first();
    await expect(firstRow).toContainText("LH");
    await expect(firstRow).toContainText("0400");
    await expect(firstRow).toContainText("Frankfurt");
    await expect(firstRow).toContainText("New York");
    await expect(firstRow).toContainText("750 EUR");

    // Click Details button on the first row (LH 0400)
    const firstRowBtn = firstRow.locator("button");
    await firstRowBtn.click();

    // Verify popup opens
    const dialog = page.locator("#dlgFlightEdit, [id$='--dlgFlightEdit']");
    await expect(dialog).toBeVisible({ timeout: 10000 });

    // Verify inputs in popup
    const priceInput = page.locator("#inpPrice input, #inpPrice-inner, [id$='--inpPrice-inner']");
    const cityToInput = page.locator("#inpCityTo input, #inpCityTo-inner, [id$='--inpCityTo-inner']");

    await expect(priceInput).toHaveValue("750");
    await expect(cityToInput).toHaveValue("New York");

    // Edit flight price and destination
    await priceInput.fill("890");
    await cityToInput.fill("Boston");

    // Click Save in popup
    const saveBtn = page.locator("#btnSaveFlight, [id$='--btnSaveFlight']");
    await saveBtn.click();

    // Dialog should close
    await expect(dialog).not.toBeVisible({ timeout: 10000 });

    // Status message updated
    await expect(statusText).toContainText("Flight updated: LH 0400 -> 890 EUR");

    // Table first row should reflect changes
    await expect(firstRow).toContainText("Boston");
    await expect(firstRow).toContainText("890 EUR");
  });
});
