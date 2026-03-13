import { Locator, Page } from '@playwright/test';

export class ProductsPage {
  public readonly page: Page;
  public readonly categoryLinks: Locator;
  public readonly loadingProductListSpinner: Locator;
  public readonly count: Locator;
  public readonly cards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.categoryLinks = page.getByTestId('category-link');
    this.loadingProductListSpinner = page.getByTestId('loading-product-list-spinner');
    this.count = page.getByTestId('product-count');
    this.cards = page.getByTestId('product-card');
  }

  public async goto(category = 'all'): Promise<void> {
    await this.page.goto(`/products/${category}`);
  }

  public async selectCategory(category: string): Promise<void> {
    await this.categoryLinks.filter({ hasText: category }).click();
  }

  public getCard(name: string | RegExp): Locator {
    return this.cards.filter({ hasText: name });
  }
}
