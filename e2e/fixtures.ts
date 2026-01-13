import { test as base } from '@playwright/test';

import { Navbar } from './components';
import { ProductsPage } from './page-objects';
import { AuthDialog, LoginCredentials } from './components/auth-dialog';

type Fixtures = {
  navbar: Navbar;
  authDialog: AuthDialog;
  productsPage: ProductsPage;
  login: (credentials?: LoginCredentials) => Promise<void>;
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
    await use(async (credentials: Partial<{ email: string; password: string }> = {}) => {
      await page.goto('/');
      await navbar.loginButton.click();
      await authDialog.login({ email: 'john.doe@mail.com', password: '123456', ...credentials });
    });
  }
});

export { expect } from '@playwright/test';
