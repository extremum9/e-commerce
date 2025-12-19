import { test as base } from '@playwright/test';

import { Navbar } from '../shared/components';
import { HomePage } from '../page-objects';

type Fixtures = {
  homePage: HomePage;
  navbar: Navbar;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  navbar: async ({ page }, use) => {
    await use(new Navbar(page));
  }
});

export { expect } from '@playwright/test';
