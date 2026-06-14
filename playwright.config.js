const { defineConfig, devices } = require("@playwright/test");
const { getConfig } = require("./utils/configReader");

const config = getConfig();

module.exports = defineConfig({
  testDir: "./tests/e2e",
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["allure-playwright", { outputFolder: "allure-results", detail: true, suiteTitle: false }]
  ],
  globalSetup: require.resolve("./tests/hooks/globalSetup.js"),
  globalTeardown: require.resolve("./tests/hooks/globalTeardown.js"),
  use: {
    baseURL: config.baseUrl,
    headless: config.headless,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
