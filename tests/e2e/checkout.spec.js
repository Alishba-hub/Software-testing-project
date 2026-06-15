const { test, expect, config } = require("../fixtures/testFixtures");
const { DataParser } = require("../../utils/dataParser");
const { annotate } = require("../../utils/allureHelper");
const { ScreenshotUtil } = require("../../utils/screenshotUtil");
const { applySuiteHooks } = require("../hooks/testHooks");

const checkoutData = DataParser.readJson("data/checkoutData.json");

applySuiteHooks(test);

test.describe("Checkout Suite", () => {
  for (const [index, row] of checkoutData.checkoutUsers.entries()) {
    const scenarioName = row.products.join(" + ");
    test(
      `Complete checkout for ${row.firstName} ${row.lastName} [${index + 1}] (${scenarioName})`,
      { tag: ["@regression", "@e2e"] },
      async ({ page, loginPage, inventoryPage, cartPage, checkoutPage }) => {
        await annotate({
          epic: "Purchasing",
          feature: "Checkout",
          story: "User completes an end-to-end purchase",
          severity: "critical",
          owner: "Automation Team"
        });

        await test.step("Sign in", async () => {
          await loginPage.open(config.baseUrl);
          await loginPage.login(row.username, row.password);
          await expect(page).toHaveURL(/inventory/);
          await ScreenshotUtil.attachStep(page, "01 - Signed in to inventory");
        });

        await test.step(`Add ${row.products.length} product(s) to the cart`, async () => {
          for (const productSlug of row.products) {
            await inventoryPage.addProductToCart(productSlug);
          }
          await expect(inventoryPage.cartBadge).toHaveText(String(row.products.length));
          await ScreenshotUtil.attachStep(page, "02 - Products added to cart");
        });

        await test.step("Proceed to checkout", async () => {
          await inventoryPage.openCart();
          await cartPage.checkout();
          await ScreenshotUtil.attachStep(page, "03 - Checkout information form");
        });

        await test.step("Enter customer information and finish", async () => {
          await checkoutPage.enterCustomerInformation(row.firstName, row.lastName, row.postalCode);
          await ScreenshotUtil.attachStep(page, "04 - Order overview");
          await checkoutPage.finishCheckout();
        });

        await test.step("Order confirmation is displayed", async () => {
          await expect(page).toHaveURL(/checkout-complete/);
          expect(await checkoutPage.getCompletionMessage()).toContain("Thank you for your order");
          await ScreenshotUtil.attachStep(page, "05 - Order confirmation");
        });
      }
    );
  }

  for (const field of checkoutData.mandatoryFieldCases) {
    test(
      `Checkout information validation: ${field.case}`,
      { tag: ["@regression", "@negative"] },
      async ({ page, loginPage, inventoryPage, cartPage, checkoutPage }) => {
        await annotate({
          epic: "Purchasing",
          feature: "Checkout",
          story: "Customer information fields are mandatory",
          severity: "normal",
          owner: "Automation Team"
        });

        await test.step("Open the checkout information form", async () => {
          await loginPage.open(config.baseUrl);
          await loginPage.login("standard_user", "secret_sauce");
          await inventoryPage.addProductToCart("sauce-labs-backpack");
          await inventoryPage.openCart();
          await cartPage.checkout();
        });

        await test.step("Submit incomplete information and verify error", async () => {
          await checkoutPage.enterCustomerInformation(
            field.firstName,
            field.lastName,
            field.postalCode
          );
          await expect(checkoutPage.errorMessage).toBeVisible();
          expect(await checkoutPage.getErrorMessage()).toContain(field.expectedError);
          await ScreenshotUtil.attachStep(page, "Validation error displayed");
        });
      }
    );
  }
});
