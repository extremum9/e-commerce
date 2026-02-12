import { expect, test } from '../fixtures';

test.describe('Wishlist page', () => {
  test.describe('Non-authenticated user', () => {
    test.describe('Wishlist is empty', () => {
      test('should display empty block', async ({ wishlistPage }) => {
        await wishlistPage.goto();

        await expect(wishlistPage.backButton).toBeHidden();
        await expect(wishlistPage.title).toBeHidden();

        await expect(wishlistPage.emptyTitle).toBeVisible();
        await expect(wishlistPage.emptyTitle).toContainText('Your wishlist is empty');

        await expect(wishlistPage.emptyLink).toBeVisible();
        await expect(wishlistPage.emptyLink).toHaveAttribute('href', '/products');
        await expect(wishlistPage.emptyLink).toContainText('Start Shopping');
      });
    });
  });

  test.describe('Authenticated user', () => {
    test.describe('Wishlist is empty', () => {
      test('should display empty block', async ({ register, wishlistPage }) => {
        await register();
        await wishlistPage.goto();

        await expect(wishlistPage.emptyTitle).toBeVisible();
        await expect(wishlistPage.emptyLink).toBeVisible();
      });
    });
  });
});
