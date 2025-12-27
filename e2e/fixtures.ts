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
  db: async (_, use) => {
    await use({
      seedProducts
    });
  },
  dbClean: [
    async (_, use) => {
      await clearFirestore();
      await use();
    },
    {
      auto: true
    }
  ]
});

export { expect } from '@playwright/test';
