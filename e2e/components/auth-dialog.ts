import { Locator, Page } from '@playwright/test';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = LoginCredentials & {
  name: string;
};

export class AuthDialog {
  public readonly page: Page;

  public readonly signInTab: Locator;
  public readonly signUpTab: Locator;

  public readonly loginEmailInput: Locator;
  public readonly loginPasswordInput: Locator;
  public readonly loginRememberMeCheckbox: Locator;
  public readonly loginSubmitButton: Locator;
  public readonly loginWithGoogleButton: Locator;

  public readonly registerNameInput: Locator;
  public readonly registerEmailInput: Locator;
  public readonly registerPasswordInput: Locator;
  public readonly registerSubmitButton: Locator;

  public readonly passwordVisibilityToggleButton: Locator;

  public readonly resetPasswordButton: Locator;
  public readonly resetPasswordSpinner: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signInTab = page.getByRole('tab', { name: 'Sign In' });
    this.signUpTab = page.getByRole('tab', { name: 'Sign Up' });

    this.loginEmailInput = page.getByTestId('login-form-email-input');
    this.loginPasswordInput = page.getByTestId('login-form-password-input');
    this.loginRememberMeCheckbox = page.getByTestId('login-form-remember-me-checkbox');
    this.loginSubmitButton = page.getByTestId('login-form-submit-button');
    this.loginWithGoogleButton = page.getByTestId('login-with-google-button');

    this.registerNameInput = page.getByTestId('register-form-name-input');
    this.registerEmailInput = page.getByTestId('register-form-email-input');
    this.registerPasswordInput = page.getByTestId('register-form-password-input');
    this.registerSubmitButton = page.getByTestId('register-form-submit-button');

    this.passwordVisibilityToggleButton = page.getByTestId('password-visibility-toggle-button');

    this.resetPasswordButton = page.getByTestId('reset-password-button');
    this.resetPasswordSpinner = page.getByTestId('loading-reset-password-spinner');
  }

  public async login({ email, password }: LoginCredentials): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginSubmitButton.click();
  }

  public async register({ name, email, password }: RegisterCredentials): Promise<void> {
    await this.registerNameInput.fill(name);
    await this.registerEmailInput.fill(email);
    await this.registerPasswordInput.fill(password);
    await this.registerSubmitButton.click();
  }
}
