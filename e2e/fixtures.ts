import { test as base } from '@playwright/test';

import { Navbar } from './components';
import { HomePage, ProductsPage } from './page-objects';
import { clearFirestore, seedProducts } from './utils';

type Fixtures = {
  navbar: Navbar;
  homePage: HomePage;
  productsPage: ProductsPage;
  db: {
    seedProducts: () => Promise<void>;
  };
  dbClean: void;
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
  },
  // eslint-disable-next-line no-empty-pattern
  db: async ({}, use) => {
    await use({
      seedProducts
    });
  },
  dbClean: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      await clearFirestore();
      await use();
    },
    {
      auto: true
    }
  ]
});

export { expect } from '@playwright/test';
