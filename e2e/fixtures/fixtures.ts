import { test as base } from '@playwright/test';

import { Navbar } from '../shared/components';
import { HomePage, ProductsPage } from '../page-objects';

type Fixtures = {
  navbar: Navbar;
  homePage: HomePage;
  productsPage: ProductsPage;
};

export const test = base.extend<Fixtures>({
  navbar: async ({ page }, use) => {
    await use(new Navbar(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  }
});

export { expect } from '@playwright/test';
