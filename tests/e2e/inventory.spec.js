const { test, expect, config } = require("../fixtures/testFixtures");
const { DataParser } = require("../../utils/dataParser");
const { annotate } = require("../../utils/allureHelper");
const { ScreenshotUtil } = require("../../utils/screenshotUtil");
const { applySuiteHooks } = require("../hooks/testHooks");

const inventoryData = DataParser.readJson("data/inventoryData.json");

applySuiteHooks(test);

function isSorted(values, direction) {
  const sorted = [...values].sort((a, b) =>
    typeof a === "number" ? a - b : String(a).localeCompare(String(b))
  );
  if (direction === "desc") {
    sorted.reverse();
  }
  return JSON.stringify(values) === JSON.stringify(sorted);
}

test.describe("Inventory Suite", () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.open(config.baseUrl);
    await loginPage.login("standard_user", "secret_sauce");
    await expect(page).toHaveURL(/inventory/);
  });

  test(
    "Inventory page lists the expected number of products",
    { tag: ["@smoke", "@regression"] },
    async ({ page, inventoryPage }) => {
      await annotate({
        epic: "Shopping",
        feature: "Inventory",
        story: "Product catalogue is displayed",
        severity: "critical",
        owner: "Automation Team"
      });

      expect(await inventoryPage.getProductCount()).toBe(inventoryData.expectedProductCount);
      await ScreenshotUtil.attachStep(page, "Inventory product list");
    }
  );

  for (const sortCase of inventoryData.sortCases) {
    test(
      `Products sort correctly by ${sortCase.label}`,
      { tag: ["@regression"] },
      async ({ page, inventoryPage }) => {
        await annotate({
          epic: "Shopping",
          feature: "Inventory",
          story: "Product sorting",
          severity: "normal",
          owner: "Automation Team"
        });

        await inventoryPage.sortBy(sortCase.value);
        await expect(inventoryPage.sortDropdown).toHaveValue(sortCase.value);

        const valueReaders = {
          price: () => inventoryPage.getProductPrices(),
          name: () => inventoryPage.getProductNames()
        };
        const values = await valueReaders[sortCase.type]();

        expect(
          isSorted(values, sortCase.direction),
          `Expected products ordered ${sortCase.direction} by ${sortCase.type}, got: ${values.join(", ")}`
        ).toBe(true);
        await ScreenshotUtil.attachStep(page, `Sorted by ${sortCase.label}`);
      }
    );
  }

  test(
    "Cart badge reflects multiple products added",
    { tag: ["@regression"] },
    async ({ page, inventoryPage }) => {
      await annotate({
        epic: "Shopping",
        feature: "Cart",
        story: "Cart count tracks added items",
        severity: "normal",
        owner: "Automation Team"
      });

      for (const slug of inventoryData.multiAddProducts) {
        await inventoryPage.addProductToCart(slug);
      }

      expect(await inventoryPage.getCartItemCount()).toBe(inventoryData.multiAddProducts.length);
      await ScreenshotUtil.attachStep(page, "Cart badge updated");
    }
  );
});
