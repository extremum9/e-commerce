import { Locator, Page } from '@playwright/test';

import { getRandomString } from '../utils';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = LoginCredentials & {
  name: string;
};

export class AuthDialog {
  public readonly page: Page;

  public readonly signUpTab: Locator;

  public readonly loginEmailInput: Locator;
  public readonly loginPasswordInput: Locator;
  public readonly loginPasswordToggleButton: Locator;
  public readonly loginRememberMeCheckbox: Locator;
  public readonly loginSubmitButton: Locator;

  public readonly registerNameInput: Locator;
  public readonly registerEmailInput: Locator;
  public readonly registerPasswordInput: Locator;
  public readonly registerPasswordToggleButton: Locator;
  public readonly registerSubmitButton: Locator;

  public readonly errorMessage: Locator;

  public readonly resetPasswordButton: Locator;
  public readonly resetPasswordSpinner: Locator;

  public readonly loginWithGoogleButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signUpTab = page.getByRole('tab', { name: 'Sign Up' });

    this.loginEmailInput = page.getByTestId('login-email-input');
    this.loginPasswordInput = page.getByTestId('login-password-input');
    this.loginPasswordToggleButton = page.getByTestId('login-password-toggle-button');
    this.loginRememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember me' });
    this.loginSubmitButton = page.getByTestId('login-submit-button');

    this.registerNameInput = page.getByTestId('register-name-input');
    this.registerEmailInput = page.getByTestId('register-email-input');
    this.registerPasswordInput = page.getByTestId('register-password-input');
    this.registerPasswordToggleButton = page.getByTestId('register-password-toggle-button');
    this.registerSubmitButton = page.getByTestId('register-submit-button');

    this.errorMessage = page.locator('mat-error');

    this.resetPasswordButton = page.getByTestId('reset-password-button');
    this.resetPasswordSpinner = page.getByTestId('loading-reset-password-spinner');

    this.loginWithGoogleButton = page.getByTestId('login-with-google-button');
  }

  public async login({
    email = 'john.doe@mail.com',
    password = '123456'
  }: Partial<LoginCredentials> = {}): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginSubmitButton.click();
  }

  public async register({
    name = getRandomString(),
    email = `${getRandomString()}@mail.com`,
    password = '123456'
  }: Partial<RegisterCredentials> = {}): Promise<void> {
    await this.registerNameInput.fill(name);
    await this.registerEmailInput.fill(email);
    await this.registerPasswordInput.fill(password);
    await this.registerSubmitButton.click();
  }
}
