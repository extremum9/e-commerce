import { Locator, Page } from '@playwright/test';

export class ProductCard {
  public readonly parent: Page | Locator;
  public readonly image: Locator;
  public readonly name: Locator;
  public readonly description: Locator;
  public readonly availability: Locator;
  public readonly price: Locator;
  public readonly toggleWishlistButton: Locator;
  public readonly addToCartButton: Locator;

  constructor(parent: Page | Locator) {
    this.parent = parent;
    this.image = parent.getByTestId('product-image');
    this.name = parent.getByTestId('product-name');
    this.description = parent.getByTestId('product-description');
    this.availability = parent.getByTestId('product-availability');
    this.price = parent.getByTestId('product-price');
    this.toggleWishlistButton = parent.getByTestId('toggle-wishlist-button');
    this.addToCartButton = parent
      .getByTestId('product-add-to-cart-button')
      .filter({ hasText: 'Add to Cart' });
  }
}
