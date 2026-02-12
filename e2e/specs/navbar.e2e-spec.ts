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

    await expect(navbar.userMenuButton).toBeHidden();
  });

  test('should display logged in user and logout', async ({ navbar, login }) => {
    await login();

    await expect(navbar.loginButton).toBeHidden();
    await expect(navbar.userMenuButton).toBeVisible();
    await expect(navbar.userProfileImage).toBeVisible();

    await navbar.userMenuButton.click();

    await expect(navbar.userMenuName).toBeVisible();
    await expect(navbar.userMenuName).toHaveText('John Doe');
    await expect(navbar.userMenuEmail).toBeVisible();
    await expect(navbar.userMenuEmail).toHaveText('john.doe@mail.com');
    await expect(navbar.logoutButton).toBeVisible();
    await expect(navbar.logoutButton).toContainText('Sign Out');

    await navbar.logoutButton.click();

    await expect(navbar.userMenuButton).toBeHidden();
    await expect(navbar.loginButton).toBeVisible();
  });
});
