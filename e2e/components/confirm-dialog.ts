import { Locator, Page } from '@playwright/test';

export class ConfirmDialog {
  public readonly page: Page;
  public readonly title: Locator;
  public readonly message: Locator;
  public readonly cancelButton: Locator;
  public readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('confirm-dialog-title');
    this.message = page.getByTestId('confirm-dialog-message');
    this.cancelButton = page.getByTestId('confirm-dialog-cancel-button');
    this.confirmButton = page.getByTestId('confirm-dialog-confirm-button');
  }
}
