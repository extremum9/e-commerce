import { Page } from '@playwright/test';

export class HomePage {
  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
