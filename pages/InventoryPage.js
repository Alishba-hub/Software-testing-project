const { BasePage } = require("./BasePage");

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.inventoryList = page.locator(".inventory_list");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator(".shopping_cart_link");
    this.menuButton = page.locator("#react-burger-menu-btn");
    this.logoutLink = page.locator("#logout_sidebar_link");
    this.sortDropdown = page.locator(".product_sort_container");
  }

  addToCartButton(productSlug) {
    return this.page.locator(`[data-test='add-to-cart-${productSlug}']`);
  }

  removeFromCartButton(productSlug) {
    return this.page.locator(`[data-test='remove-${productSlug}']`);
  }

  async isLoaded() {
    return this.inventoryList.isVisible();
  }

  inventoryItemNames() {
    return this.page.locator(".inventory_item_name");
  }

  async getFirstInventoryItemName() {
    return (await this.inventoryItemNames().first().textContent())?.trim();
  }

  async addProductToCart(productSlug) {
    await this.click(this.addToCartButton(productSlug));
  }

  async removeProductFromCart(productSlug) {
    await this.click(this.removeFromCartButton(productSlug));
  }

  async openCart() {
    await this.click(this.cartLink);
  }

  async getCartItemCount() {
    if (!(await this.cartBadge.isVisible())) {
      return 0;
    }
    return Number(await this.cartBadge.textContent());
  }

  async logout() {
    await this.click(this.menuButton);
    await this.click(this.logoutLink);
  }

  async sortBy(optionValue) {
    await this.sortDropdown.selectOption(optionValue);
  }
}

module.exports = { InventoryPage };
