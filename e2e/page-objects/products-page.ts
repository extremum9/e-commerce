import { Locator, Page } from '@playwright/test';

import { ProductCard } from '../shared/components';

export class ProductsPage {
  public readonly page: Page;
  public readonly categoryLinks: Locator;
  public readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.categoryLinks = page.getByTestId('category-link');
    this.productCards = page.getByTestId('product-card');
  }

  public async goto(category = 'all'): Promise<void> {
    await this.page.goto(`/products/${category}`);
  }

  public async selectCategory(category: string): Promise<void> {
    await this.categoryLinks.filter({ hasText: category }).click();
  }

  public getProductCard(index: number): ProductCard {
    return new ProductCard(this.productCards.nth(index));
  }
}
