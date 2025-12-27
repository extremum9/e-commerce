import { Locator } from '@playwright/test';

export class ProductCard {
  public readonly parent: Locator;
  public readonly image: Locator;
  public readonly name: Locator;
  public readonly description: Locator;
  public readonly availability: Locator;
  public readonly price: Locator;
  public readonly addToCartButton: Locator;

  constructor(parent: Locator) {
    this.parent = parent;
    this.image = parent.getByTestId('product-image');
    this.name = parent.getByTestId('product-name');
    this.description = parent.getByTestId('product-description');
    this.availability = parent.getByTestId('product-availability');
    this.price = parent.getByTestId('product-price');
    this.addToCartButton = parent
      .getByTestId('product-add-to-cart-button')
      .filter({ hasText: 'Add to Cart' });
  }
}
