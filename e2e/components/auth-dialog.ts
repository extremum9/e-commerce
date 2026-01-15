import { Locator, Page } from '@playwright/test';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  name: string;
  email: string;
  password?: string;
};

export class AuthDialog {
  public readonly page: Page;

  public readonly signUpTab: Locator;

  public readonly nameInput: Locator;
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly passwordVisibilityToggleButton: Locator;
  public readonly rememberMeCheckbox: Locator;
  public readonly errorMessage: Locator;
  public readonly submitButton: Locator;

  public readonly resetPasswordButton: Locator;
  public readonly resetPasswordSpinner: Locator;

  public readonly loginWithGoogleButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signUpTab = page.getByRole('tab', { name: 'Sign Up' });

    this.nameInput = page.getByPlaceholder('Enter your name');
    this.emailInput = page.getByPlaceholder('Enter your email');
    this.passwordInput = page.getByPlaceholder('Enter your password');
    this.passwordVisibilityToggleButton = page.getByTestId('password-visibility-toggle-button');
    this.rememberMeCheckbox = page.getByTestId('login-form-remember-me-checkbox');
    this.submitButton = page.locator('button[type=submit]');
    this.errorMessage = page.locator('mat-error');

    this.resetPasswordButton = page.getByTestId('reset-password-button');
    this.resetPasswordSpinner = page.getByTestId('loading-reset-password-spinner');

    this.loginWithGoogleButton = page.getByTestId('login-with-google-button');
  }

  public async login({
    email = 'john.doe@mail.com',
    password = '123456'
  }: Partial<LoginCredentials> = {}): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  public async register({ name, email, password = '123456' }: RegisterCredentials): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
