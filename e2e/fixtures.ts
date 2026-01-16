import { test as base } from '@playwright/test';

import { Navbar } from './components';
import { ProductsPage } from './page-objects';
import { AuthDialog, LoginCredentials, RegisterCredentials } from './components/auth-dialog';

type Fixtures = {
  navbar: Navbar;
  authDialog: AuthDialog;
  productsPage: ProductsPage;
  login: (credentials?: Partial<LoginCredentials>) => Promise<void>;
  register: (credentials?: Partial<RegisterCredentials>) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  navbar: async ({ page }, use) => {
    await use(new Navbar(page));
  },
  authDialog: async ({ page }, use) => {
    await use(new AuthDialog(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  login: async ({ page, navbar, authDialog }, use) => {
    await use(async (credentials: Partial<LoginCredentials> = {}) => {
      await page.goto('/');
      await navbar.loginButton.click();
      await authDialog.login(credentials);
    });
  },
  register: async ({ page, navbar, authDialog }, use) => {
    await use(async (credentials: Partial<RegisterCredentials> = {}) => {
      await page.goto('/');
      await navbar.loginButton.click();
      await authDialog.signUpTab.click();
      await authDialog.register(credentials);
    });
  }
});

export { expect } from '@playwright/test';
