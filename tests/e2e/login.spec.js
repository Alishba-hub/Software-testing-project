const { test, expect, config } = require("../fixtures/testFixtures");
const { DataParser } = require("../../utils/dataParser");
const { annotate } = require("../../utils/allureHelper");
const { ScreenshotUtil } = require("../../utils/screenshotUtil");
const { applySuiteHooks } = require("../hooks/testHooks");

const loginData = DataParser.readJson("data/loginData.json");

applySuiteHooks(test);

test.describe("Login Suite", () => {
  for (const user of loginData.validUsers) {
    test(
      `Login succeeds for valid user: ${user.username}`,
      { tag: ["@smoke", "@regression"] },
      async ({ page, loginPage, inventoryPage }) => {
        await annotate({
          epic: "Authentication",
          feature: "Login",
          story: "Valid users can sign in",
          severity: "critical",
          owner: "Automation Team"
        });

        await test.step("Open the login page", async () => {
          await loginPage.open(config.baseUrl);
          await ScreenshotUtil.attachStep(page, "01 - Login page opened");
        });

        await test.step(`Sign in as ${user.username}`, async () => {
          await loginPage.login(user.username, user.password);
          await ScreenshotUtil.attachStep(page, "02 - Credentials submitted");
        });

        await test.step("User lands on the inventory page", async () => {
          await expect(page).toHaveURL(/inventory/);
          await expect(inventoryPage.inventoryList).toBeVisible();
          await ScreenshotUtil.attachStep(page, "03 - Inventory page displayed");
        });
      }
    );
  }

  for (const user of loginData.invalidUsers) {
    test(
      `Login fails for invalid user: ${user.username}`,
      { tag: ["@regression", "@negative"] },
      async ({ page, loginPage }) => {
        await annotate({
          epic: "Authentication",
          feature: "Login",
          story: "Invalid credentials are rejected",
          severity: "normal",
          owner: "Automation Team"
        });

        await test.step("Open the login page", async () => {
          await loginPage.open(config.baseUrl);
        });

        await test.step(`Attempt sign in as ${user.username}`, async () => {
          await loginPage.login(user.username, user.password);
        });

        await test.step("A descriptive error is shown", async () => {
          await expect(loginPage.errorMessage).toBeVisible();
          expect(await loginPage.getErrorMessage()).toContain(user.expectedError);
          await ScreenshotUtil.attachStep(page, "Login rejected with error message");
        });
      }
    );
  }

  for (const field of loginData.fieldValidationCases) {
    test(
      `Login validation: ${field.case}`,
      { tag: ["@regression", "@negative"] },
      async ({ page, loginPage }) => {
        await annotate({
          epic: "Authentication",
          feature: "Login",
          story: "Required-field validation",
          severity: "normal",
          owner: "Automation Team"
        });

        await test.step("Submit credentials", async () => {
          await loginPage.open(config.baseUrl);
          await loginPage.login(field.username, field.password);
        });

        await test.step("Validation error is shown", async () => {
          await expect(loginPage.errorMessage).toBeVisible();
          expect(await loginPage.getErrorMessage()).toContain(field.expectedError);
          await ScreenshotUtil.attachStep(page, "Validation error displayed");
        });
      }
    );
  }
});
