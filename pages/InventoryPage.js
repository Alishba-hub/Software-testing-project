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
    this.itemNames = page.locator(".inventory_item_name");
    this.itemPrices = page.locator(".inventory_item_price");
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

  async getProductCount() {
    return this.itemNames.count();
  }

  async getProductNames() {
    return this.itemNames.allTextContents();
  }

  async getProductPrices() {
    const priceTexts = await this.itemPrices.allTextContents();
    return priceTexts.map((text) => Number(text.replace("$", "")));
  }
}

module.exports = { InventoryPage };
