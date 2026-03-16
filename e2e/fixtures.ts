import { test as base } from '@playwright/test';

import { CartPage, ProductsPage, WishlistPage } from './page-objects';
import { AuthDialog, ConfirmDialog, Navbar, RegisterCredentials } from './components';

type Fixtures = {
  navbar: Navbar;
  authDialog: AuthDialog;
  confirmDialog: ConfirmDialog;
  productsPage: ProductsPage;
  wishlistPage: WishlistPage;
  cartPage: CartPage;
  login: (email?: string) => Promise<void>;
  register: (credentials?: Partial<RegisterCredentials>) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  navbar: async ({ page }, use) => {
    await use(new Navbar(page));
  },
  authDialog: async ({ page }, use) => {
    await use(new AuthDialog(page));
  },
  confirmDialog: async ({ page }, use) => {
    await use(new ConfirmDialog(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  wishlistPage: async ({ page }, use) => {
    await use(new WishlistPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  login: async ({ page, navbar, authDialog }, use) => {
    await use(async (email?: string) => {
      await page.goto('/');
      await navbar.loginButton.click();
      await authDialog.login(email);
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
