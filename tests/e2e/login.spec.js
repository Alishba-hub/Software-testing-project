const { test, expect } = require("@playwright/test");
const { getConfig } = require("../../utils/configReader");
const { DataParser } = require("../../utils/dataParser");
const { applyCommonHooks } = require("../hooks/testHooks");
const { LoginPage } = require("../../pages/LoginPage");
const { InventoryPage } = require("../../pages/InventoryPage");

const config = getConfig();
const loginData = DataParser.readJson("data/loginData.json");

applyCommonHooks(test);

test.describe("Login Suite", () => {
  for (const user of loginData.validUsers) {
    test(`Login succeeds for valid user: ${user.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.open(config.baseUrl);
      await loginPage.login(user.username, user.password);

      await expect(page).toHaveURL(/inventory/);
      await expect(inventoryPage.inventoryList).toBeVisible();
    });
  }

  for (const user of loginData.invalidUsers) {
    test(`Login fails for invalid user: ${user.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.open(config.baseUrl);
      await loginPage.login(user.username, user.password);

      await expect(loginPage.errorMessage).toBeVisible();
      const actual = await loginPage.getErrorMessage();
      expect(actual).toContain(user.expectedError);
    });
  }

  test("Login validation for blank credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open(config.baseUrl);
    await loginPage.login(loginData.blankCredentialCase.username, loginData.blankCredentialCase.password);

    await expect(loginPage.errorMessage).toBeVisible();
    const actual = await loginPage.getErrorMessage();
    expect(actual).toContain(loginData.blankCredentialCase.expectedError);
  });
});
