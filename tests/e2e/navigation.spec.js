const { test, expect, config } = require("../fixtures/testFixtures");
const { NavigationUtil } = require("../../utils/navigationUtil");
const { annotate } = require("../../utils/allureHelper");
const { ScreenshotUtil } = require("../../utils/screenshotUtil");
const { applySuiteHooks } = require("../hooks/testHooks");

const productSlug = "sauce-labs-backpack";
const productName = "Sauce Labs Backpack";

applySuiteHooks(test);

test.describe("Navigation And Cart Suite", () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.open(config.baseUrl);
    await loginPage.login("standard_user", "secret_sauce");
    await expect(page).toHaveURL(/inventory/);
  });

  test(
    "User can add and remove a product from the cart",
    { tag: ["@smoke", "@regression"] },
    async ({ page, inventoryPage }) => {
      await annotate({
        epic: "Shopping",
        feature: "Cart",
        story: "Add and remove items",
        severity: "critical",
        owner: "Automation Team"
      });

      await test.step("Add product and verify badge shows 1", async () => {
        await inventoryPage.addProductToCart(productSlug);
        await expect(inventoryPage.cartBadge).toHaveText("1");
        await ScreenshotUtil.attachStep(page, "Product added - badge shows 1");
      });

      await test.step("Remove product and verify badge disappears", async () => {
        await inventoryPage.removeProductFromCart(productSlug);
        await expect(inventoryPage.cartBadge).toBeHidden();
        await ScreenshotUtil.attachStep(page, "Product removed - badge hidden");
      });
    }
  );

  test(
    "User can navigate to the cart and verify the item",
    { tag: ["@regression"] },
    async ({ page, inventoryPage, cartPage }) => {
      await annotate({
        epic: "Shopping",
        feature: "Cart",
        story: "Navigate to cart",
        severity: "normal",
        owner: "Automation Team"
      });

      await inventoryPage.addProductToCart(productSlug);
      await inventoryPage.openCart();

      await expect(page).toHaveURL(/cart/);
      await expect(cartPage.cartItemByName(productName)).toBeVisible();
      await ScreenshotUtil.attachStep(page, "Cart page with item");
    }
  );

  test(
    "User can sort products by price low to high",
    { tag: ["@regression"] },
    async ({ page, inventoryPage }) => {
      await annotate({
        epic: "Shopping",
        feature: "Inventory",
        story: "Product sorting",
        severity: "minor",
        owner: "Automation Team"
      });

      await inventoryPage.sortBy("lohi");
      await expect(inventoryPage.sortDropdown).toHaveValue("lohi");
      await ScreenshotUtil.attachStep(page, "Products sorted low to high");
    }
  );

  test("User can log out successfully", { tag: ["@smoke"] }, async ({ page, inventoryPage }) => {
    await annotate({
      epic: "Authentication",
      feature: "Logout",
      story: "User can end their session",
      severity: "critical",
      owner: "Automation Team"
    });

    await inventoryPage.logout();

    await expect(page).toHaveURL(/saucedemo\.com/);
    await ScreenshotUtil.attachStep(page, "Logged out - login page");
    await expect(page.locator("#login-button")).toBeVisible();
  });

  test(
    "Direct access to inventory without a session redirects to login",
    { tag: ["@regression", "@security"] },
    async ({ page, inventoryPage }) => {
      await annotate({
        epic: "Authentication",
        feature: "Access Control",
        story: "Protected pages require an active session",
        severity: "critical",
        owner: "Automation Team"
      });

      await test.step("Log out to clear the session", async () => {
        await inventoryPage.logout();
        await expect(page.locator("#login-button")).toBeVisible();
      });

      await test.step("Attempt to deep-link straight into the inventory page", async () => {
        await NavigationUtil.goToInventory(page);
      });

      await test.step("Application redirects back to login with an error", async () => {
        await expect(page.locator("[data-test='error']")).toBeVisible();
        await expect(page.locator("[data-test='error']")).toContainText(
          "You can only access '/inventory.html' when you are logged in."
        );
        await ScreenshotUtil.attachStep(page, "Blocked - redirected to login");
      });
    }
  );
});
