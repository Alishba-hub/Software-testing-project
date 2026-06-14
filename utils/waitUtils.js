class WaitUtils {
  static async forVisible(locator, timeout = 10000) {
    await locator.waitFor({ state: "visible", timeout });
  }

  static async forHidden(locator, timeout = 10000) {
    await locator.waitFor({ state: "hidden", timeout });
  }

  static async forUrl(page, expectedPattern, timeout = 10000) {
    await page.waitForURL(expectedPattern, { timeout });
  }

  static setDefaultTimeout(page, timeoutMs) {
    page.setDefaultTimeout(timeoutMs);
  }

  static setDefaultNavigationTimeout(page, timeoutMs) {
    page.setDefaultNavigationTimeout(timeoutMs);
  }
}

module.exports = { WaitUtils };
