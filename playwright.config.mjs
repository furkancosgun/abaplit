import { defineConfig } from "@playwright/test";

const UI5_PORT = process.env.UI5_PORT || 8134;

export default defineConfig({
  testDir: "test",
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${UI5_PORT}`,
    headless: true
  },
  webServer: [
    {
      command: "node scripts/server.mjs",
      url: "http://localhost:3000/sap/bc/z2fiori",
      reuseExistingServer: false,
      timeout: 30000
    },
    {
      command: `npx ui5 serve --config app/ui5.yaml --port ${UI5_PORT}`,
      url: `http://localhost:${UI5_PORT}/index.html`,
      reuseExistingServer: false,
      timeout: 60000
    }
  ]
});
