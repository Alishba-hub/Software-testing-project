const { BasePage } = require("./BasePage");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator("#user-name");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("#login-button");
    this.errorMessage = page.locator("[data-test='error']");
  }

  async open(baseUrl) {
    await this.goto(baseUrl);
  }

  async login(username, password) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage() {
    return (await this.getText(this.errorMessage))?.trim();
  }
}

module.exports = { LoginPage };
