import { expect, test } from '../fixtures/fixtures';

test.describe('Home page', () => {
  test('should display a navbar with the brand and actions', async ({ homePage, navbar }) => {
    await homePage.goto();

    await expect(navbar.brandLink).toBeVisible();
    await expect(navbar.brandLink).toHaveAttribute('href', '/');
    await expect(navbar.brandLink).toHaveText('MiniStore');

    await expect(navbar.wishlistLink).toBeVisible();
    await expect(navbar.wishlistLink).toHaveAttribute('href', '/wishlist');

    await expect(navbar.cartLink).toBeVisible();
    await expect(navbar.cartLink).toHaveAttribute('href', '/cart');

    await expect(navbar.loginButton).toBeVisible();
    await expect(navbar.loginButton).toContainText('Sign In');

    await expect(navbar.menuButton).toBeHidden();
  });

  test('should display a mobile menu on smaller screens', async ({ page, homePage, navbar }) => {
    await homePage.goto();
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(navbar.brandLink).toBeVisible();
    await expect(navbar.cartLink).toBeVisible();
    await expect(navbar.menuButton).toBeVisible();
    await expect(navbar.wishlistLink).toBeHidden();
    await expect(navbar.loginButton).toBeHidden();

    await navbar.openMenu();

    await expect(navbar.menuWishlistLink).toBeVisible();
    await expect(navbar.menuWishlistLink).toContainText('Wishlist');
    await expect(navbar.menuLoginButton).toBeVisible();
    await expect(navbar.menuLoginButton).toContainText('Sign In');

    await navbar.closeMenu();

    await expect(navbar.menuWishlistLink).toBeHidden();
    await expect(navbar.menuLoginButton).toBeHidden();
  });
});
