import { test as base } from '@playwright/test';

import { Navbar } from './components';
import { ProductsPage } from './page-objects';

type Fixtures = {
  navbar: Navbar;
  productsPage: ProductsPage;
};

export const test = base.extend<Fixtures>({
  navbar: async ({ page }, use) => {
    await use(new Navbar(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  }
});

export { expect } from '@playwright/test';
