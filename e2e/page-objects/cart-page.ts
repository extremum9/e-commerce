import { Locator, Page } from '@playwright/test';

export class CartPage {
  public readonly page: Page;
  public readonly loadingSpinner: Locator;
  public readonly backButton: Locator;
  public readonly title: Locator;
  public readonly count: Locator;
  public readonly products: Locator;

  public readonly wishlistPreviewTitle: Locator;
  public readonly wishlistPreviewDescription: Locator;
  public readonly wishlistPreviewLink: Locator;
  public readonly wishlistPreviewMoveAllButton: Locator;

  public readonly orderTitle: Locator;
  public readonly orderSubtotal: Locator;
  public readonly orderTax: Locator;
  public readonly orderTotal: Locator;

  public readonly emptyTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.getByTestId('loading-cart-spinner');
    this.backButton = page.getByTestId('back-button');
    this.title = page.getByTestId('cart-title');
    this.count = page.getByTestId('cart-count');
    this.products = page.getByTestId('cart-product');

    this.wishlistPreviewTitle = page.getByTestId('cart-wishlist-preview-title');
    this.wishlistPreviewDescription = page.getByTestId('cart-wishlist-preview-description');
    this.wishlistPreviewLink = page.getByTestId('cart-wishlist-preview-link');
    this.wishlistPreviewMoveAllButton = page.getByTestId('cart-wishlist-preview-move-all-button');

    this.orderTitle = page.getByTestId('cart-order-title');
    this.orderSubtotal = page.getByTestId('cart-order-subtotal');
    this.orderTax = page.getByTestId('cart-order-tax');
    this.orderTotal = page.getByTestId('cart-order-total');

    this.emptyTitle = page.getByTestId('cart-empty-title');
  }

  public async goto(): Promise<void> {
    await this.page.goto('/cart');
  }
}
