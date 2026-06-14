class NavigationUtil {
  static async openBaseUrl(page, baseUrl) {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  }

  static async goToInventory(page) {
    await page.goto("https://www.saucedemo.com/inventory.html", {
      waitUntil: "domcontentloaded"
    });
  }
}

module.exports = { NavigationUtil };
