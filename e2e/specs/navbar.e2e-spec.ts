import { expect, test } from '../fixtures';

test.describe('Navbar', () => {
  test('should display brand and user links', async ({ page, navbar }) => {
    await page.goto('/');

    await expect(navbar.brandLink).toBeVisible();
    await expect(navbar.brandLink).toHaveAttribute('href', '/');
    await expect(navbar.brandLink).toHaveText('MiniStore');

    await expect(navbar.wishlistLink).toBeVisible();
    await expect(navbar.wishlistLink).toHaveAttribute('href', '/wishlist');

    await expect(navbar.cartLink).toBeVisible();
    await expect(navbar.cartLink).toHaveAttribute('href', '/cart');

    await expect(navbar.loginButton).toBeVisible();
    await expect(navbar.loginButton).toContainText('Sign In');
  });
});
