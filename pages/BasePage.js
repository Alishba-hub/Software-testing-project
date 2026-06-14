class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  async click(locator) {
    await locator.click();
  }

  async fill(locator, text) {
    await locator.fill(text);
  }

  async getText(locator) {
    return locator.textContent();
  }
}

module.exports = { BasePage };
