const base = require("@playwright/test");

const { getConfig } = require("../../utils/configReader");

const { LoginPage } = require("../../pages/LoginPage");
const { InventoryPage } = require("../../pages/InventoryPage");
const { CartPage } = require("../../pages/CartPage");
const { CheckoutPage } = require("../../pages/CheckoutPage");

const config = getConfig();

/**
 * Page-object fixtures.
 *
 * Injects ready-to-use Page Objects into every test, so specs stay focused on behaviour
 * instead of wiring (`new LoginPage(page)` etc.). Per-test setup/teardown lives in the
 * explicit hooks module (`tests/hooks/testHooks.js`), which each spec wires via
 * `applySuiteHooks(test)`.
 */
const test = base.test.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  }
});

module.exports = { test, expect: base.expect, config };
