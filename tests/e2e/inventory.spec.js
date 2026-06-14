const { test, expect } = require("@playwright/test");
const { getConfig } = require("../../utils/configReader");
const { applyCommonHooks } = require("../hooks/testHooks");
const { LoginPage } = require("../../pages/LoginPage");
const { InventoryPage } = require("../../pages/InventoryPage");

const config = getConfig();

const products = [
  {
    slug: "sauce-labs-backpack",
    name: "Sauce Labs Backpack"
  },
  {
    slug: "sauce-labs-bike-light",
    name: "Sauce Labs Bike Light"
  },
  {
    slug: "sauce-labs-bolt-t-shirt",
    name: "Sauce Labs Bolt T-Shirt"
  },
  {
    slug: "sauce-labs-fleece-jacket",
    name: "Sauce Labs Fleece Jacket"
  },
  {
    slug: "sauce-labs-onesie",
    name: "Sauce Labs Onesie"
  },
  {
    slug: "test.allthethings()-t-shirt-(red)",
    name: "Test.allTheThings() T-Shirt (Red)"
  }
];

const sortScenarios = [
  {
    option: "az",
    expectedFirstItem: "Sauce Labs Backpack"
  },
  {
    option: "za",
    expectedFirstItem: "Test.allTheThings() T-Shirt (Red)"
  },
  {
    option: "lohi",
    expectedFirstItem: "Sauce Labs Onesie"
  },
  {
    option: "hilo",
    expectedFirstItem: "Sauce Labs Fleece Jacket"
  }
];

applyCommonHooks(test);

test.describe("Inventory Expansion Suite", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open(config.baseUrl);
    await loginPage.login("standard_user", "secret_sauce");
    await expect(page).toHaveURL(/inventory/);
  });

  for (const product of products) {
    test(`User can add ${product.name} to cart`, async ({ page }) => {
      const inventoryPage = new InventoryPage(page);

      await inventoryPage.addProductToCart(product.slug);

      await expect(inventoryPage.cartBadge).toHaveText("1");
      await expect(inventoryPage.removeFromCartButton(product.slug)).toBeVisible();
    });
  }

  for (const product of products) {
    test(`User can remove ${product.name} from cart`, async ({ page }) => {
      const inventoryPage = new InventoryPage(page);

      await inventoryPage.addProductToCart(product.slug);
      await expect(inventoryPage.cartBadge).toHaveText("1");

      await inventoryPage.removeProductFromCart(product.slug);

      await expect(inventoryPage.cartBadge).toBeHidden();
      await expect(inventoryPage.addToCartButton(product.slug)).toBeVisible();
    });
  }

  for (const scenario of sortScenarios) {
    test(`User can sort inventory by ${scenario.option}`, async ({ page }) => {
      const inventoryPage = new InventoryPage(page);

      await inventoryPage.sortBy(scenario.option);

      await expect(inventoryPage.sortDropdown).toHaveValue(scenario.option);
      await expect(await inventoryPage.getFirstInventoryItemName()).toBe(scenario.expectedFirstItem);
    });
  }
});