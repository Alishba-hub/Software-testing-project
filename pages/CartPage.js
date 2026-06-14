const { BasePage } = require("./BasePage");

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.checkoutButton = page.locator("#checkout");
  }

  cartItemByName(itemName) {
    return this.page.locator(".cart_item .inventory_item_name", { hasText: itemName });
  }

  removeButton(productSlug) {
    return this.page.locator(`[data-test='remove-${productSlug}']`);
  }

  async isProductPresent(itemName) {
    return this.cartItemByName(itemName).isVisible();
  }

  async removeProduct(productSlug) {
    await this.click(this.removeButton(productSlug));
  }

  async checkout() {
    await this.click(this.checkoutButton);
  }
}

module.exports = { CartPage };
