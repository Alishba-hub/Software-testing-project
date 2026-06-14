const { test, expect } = require("@playwright/test");
const { getConfig } = require("../../utils/configReader");
const { DataParser } = require("../../utils/dataParser");
const { applyCommonHooks } = require("../hooks/testHooks");
const { LoginPage } = require("../../pages/LoginPage");
const { InventoryPage } = require("../../pages/InventoryPage");
const { CartPage } = require("../../pages/CartPage");
const { CheckoutPage } = require("../../pages/CheckoutPage");

const config = getConfig();
const checkoutData = DataParser.readJson("data/checkoutData.json");

applyCommonHooks(test);

test.describe("Checkout Suite", () => {
  for (const [index, row] of checkoutData.checkoutUsers.entries()) {
    const scenarioName = row.products.join("+");
    test(`Complete checkout for user ${row.username} [${index + 1}] (${scenarioName})`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);
      const checkoutPage = new CheckoutPage(page);

      await loginPage.open(config.baseUrl);
      await loginPage.login(row.username, row.password);
      await expect(page).toHaveURL(/inventory/);

      for (const productSlug of row.products) {
        await inventoryPage.addProductToCart(productSlug);
      }

      await expect(inventoryPage.cartBadge).toHaveText(String(row.products.length));
      await inventoryPage.openCart();
      await cartPage.checkout();

      await checkoutPage.enterCustomerInformation(row.firstName, row.lastName, row.postalCode);
      await checkoutPage.finishCheckout();

      await expect(page).toHaveURL(/checkout-complete/);
      const completionText = await checkoutPage.getCompletionMessage();
      expect(completionText).toContain("Thank you for your order");
    });
  }

  test("Checkout information fields are mandatory", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.open(config.baseUrl);
    await loginPage.login("standard_user", "secret_sauce");

    await inventoryPage.addProductToCart("sauce-labs-backpack");
    await inventoryPage.openCart();
    await cartPage.checkout();

    await page.click("#continue");
    await expect(page.locator("[data-test='error']")).toBeVisible();
  });
});
