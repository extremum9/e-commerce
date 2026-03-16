import { Locator, Page } from '@playwright/test';

export class CartProductRow {
  public parent: Page | Locator;
  public readonly image: Locator;
  public readonly name: Locator;
  public readonly price: Locator;
  public readonly quantity: Locator;
  public readonly incrementButton: Locator;
  public readonly decrementButton: Locator;
  public readonly total: Locator;
  public readonly moveToWishlistButton: Locator;
  public readonly deleteButton: Locator;

  constructor(parent: Page | Locator) {
    this.parent = parent;
    this.image = parent.getByTestId('cart-product-image');
    this.name = parent.getByTestId('cart-product-name');
    this.price = parent.getByTestId('cart-product-price');
    this.quantity = parent.getByTestId('cart-quantity');
    this.incrementButton = parent.getByTestId('cart-quantity-increment-button');
    this.decrementButton = parent.getByTestId('cart-quantity-decrement-button');
    this.total = parent.getByTestId('cart-product-total');
    this.moveToWishlistButton = parent.getByTestId('cart-product-move-to-wishlist-button');
    this.deleteButton = parent.getByTestId('cart-product-delete-button');
  }
}
