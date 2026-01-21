import { Locator, Page } from '@playwright/test';

export class ProductsPage {
  public readonly page: Page;
  public readonly categoryLinks: Locator;
  public readonly loadingProductListSpinner: Locator;
  public readonly productCount: Locator;
  public readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.categoryLinks = page.getByTestId('category-link');
    this.loadingProductListSpinner = page.getByTestId('loading-product-list-spinner');
    this.productCount = page.getByTestId('product-count');
    this.productCards = page.getByTestId('product-card');
  }

  public async goto(category = 'all'): Promise<void> {
    await this.page.goto(`/products/${category}`);
  }

  public async selectCategory(category: string): Promise<void> {
    await this.categoryLinks.filter({ hasText: category }).click();
  }

  public getProductCard(name: string | RegExp): Locator {
    return this.productCards.filter({ hasText: name });
  }
}
