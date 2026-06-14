const { BasePage } = require("./BasePage");

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameInput = page.locator("#first-name");
    this.lastNameInput = page.locator("#last-name");
    this.postalCodeInput = page.locator("#postal-code");
    this.continueButton = page.locator("#continue");
    this.finishButton = page.locator("#finish");
    this.completeHeader = page.locator(".complete-header");
  }

  async enterCustomerInformation(firstName, lastName, postalCode) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
    await this.click(this.continueButton);
  }

  async finishCheckout() {
    await this.click(this.finishButton);
  }

  async getCompletionMessage() {
    return (await this.getText(this.completeHeader))?.trim();
  }
}

module.exports = { CheckoutPage };
