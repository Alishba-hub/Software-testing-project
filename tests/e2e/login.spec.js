const { test, expect } = require("@playwright/test");
const { getConfig } = require("../../utils/configReader");
const { DataParser } = require("../../utils/dataParser");
const { applyCommonHooks } = require("../hooks/testHooks");
const { LoginPage } = require("../../pages/LoginPage");
const { InventoryPage } = require("../../pages/InventoryPage");
const { NavigationUtil } = require("../../utils/navigationUtil");

const config = getConfig();
const loginData = DataParser.readXml("data/loginData.xml");
const validUsers = DataParser.normalizeXmlCollection(loginData.loginData.validUsers.user);
const invalidUsers = DataParser.normalizeXmlCollection(loginData.loginData.invalidUsers.user);
const blankCredentialCase = loginData.loginData.blankCredentialCase;

applyCommonHooks(test);

test.describe("Login Suite", () => {
  for (const user of validUsers) {
    test(`Login succeeds for valid user: ${user.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await NavigationUtil.openBaseUrl(page, config.baseUrl);
      await loginPage.login(user.username, user.password);

      await expect(page).toHaveURL(/inventory/);
      await expect(inventoryPage.inventoryList).toBeVisible();
    });
  }

  for (const user of invalidUsers) {
    test(`Login fails for invalid user: ${user.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await NavigationUtil.openBaseUrl(page, config.baseUrl);
      await loginPage.login(user.username, user.password);

      await expect(loginPage.errorMessage).toBeVisible();
      const actual = await loginPage.getErrorMessage();
      expect(actual).toContain(user.expectedError);
    });
  }

  test("Login validation for blank credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await NavigationUtil.openBaseUrl(page, config.baseUrl);
    await loginPage.login(blankCredentialCase.username, blankCredentialCase.password);

    await expect(loginPage.errorMessage).toBeVisible();
    const actual = await loginPage.getErrorMessage();
    expect(actual).toContain(blankCredentialCase.expectedError);
  });
});
