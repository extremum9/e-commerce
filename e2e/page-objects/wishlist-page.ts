import { Locator, Page } from '@playwright/test';

export class WishlistPage {
  public readonly page: Page;
  public readonly loadingSpinner: Locator;
  public readonly backButton: Locator;
  public readonly title: Locator;
  public readonly count: Locator;
  public readonly items: Locator;
  public readonly clearButton: Locator;
  public readonly emptyTitle: Locator;
  public readonly emptyLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.getByTestId('loading-wishlist-spinner');
    this.backButton = page.getByTestId('back-button');
    this.title = page.getByTestId('wishlist-title');
    this.count = page.getByTestId('wishlist-count');
    this.items = page.getByTestId('product-card');
    this.clearButton = page.getByTestId('clear-wishlist-button');
    this.emptyTitle = page.getByTestId('wishlist-empty-title');
    this.emptyLink = page.getByTestId('wishlist-empty-link');
  }

  public async goto(): Promise<void> {
    await this.page.goto('/wishlist');
  }
}
