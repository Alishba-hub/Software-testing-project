const { test, expect } = require("@playwright/test");
const { getConfig } = require("../../utils/configReader");
const { applyCommonHooks } = require("../hooks/testHooks");
const { LoginPage } = require("../../pages/LoginPage");
const { InventoryPage } = require("../../pages/InventoryPage");
const { CartPage } = require("../../pages/CartPage");

const config = getConfig();
const productSlug = "sauce-labs-backpack";
const productName = "Sauce Labs Backpack";

applyCommonHooks(test);

test.describe("Navigation And Cart Suite", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open(config.baseUrl);
    await loginPage.login("standard_user", "secret_sauce");
    await expect(page).toHaveURL(/inventory/);
  });

  test("User can add and remove product from cart", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart(productSlug);
    await expect(inventoryPage.cartBadge).toHaveText("1");

    await inventoryPage.removeProductFromCart(productSlug);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test("User can navigate to cart and verify item", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart(productSlug);
    await inventoryPage.openCart();

    await expect(page).toHaveURL(/cart/);
    await expect(cartPage.cartItemByName(productName)).toBeVisible();
  });

  test("User can sort products by price low to high", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy("lohi");

    await expect(inventoryPage.sortDropdown).toHaveValue("lohi");
  });

  test("User can logout successfully", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.logout();

    await expect(page).toHaveURL(/saucedemo.com/);
    await expect(page.locator("#login-button")).toBeVisible();
  });
});
