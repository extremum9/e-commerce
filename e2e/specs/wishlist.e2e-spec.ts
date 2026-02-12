import { expect, test } from '../fixtures';
import { ProductCard } from '../components';

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

    test.describe('Wishlist has items', () => {
      test.beforeEach(async ({ productsPage, wishlistPage }) => {
        await productsPage.goto();
        await new ProductCard(productsPage.productCards.first()).toggleWishlistButton.click();
        await new ProductCard(productsPage.productCards.nth(1)).toggleWishlistButton.click();
        await wishlistPage.goto();
      });

      test('should display back button, title and count', async ({ wishlistPage }) => {
        await expect(wishlistPage.backButton).toBeVisible();
        await expect(wishlistPage.backButton).toHaveAttribute('href', '/products');
        await expect(wishlistPage.backButton).toContainText('Continue Shopping');

        await expect(wishlistPage.title).toBeVisible();
        await expect(wishlistPage.title).toContainText('My Wishlist');

        await expect(wishlistPage.count).toBeVisible();
        await expect(wishlistPage.count).toContainText('2 items');
      });
    });
  });

  test.describe('Authenticated user', () => {
    test.beforeEach(async ({ register }) => {
      await register();
    });

    test.describe('Wishlist is empty', () => {
      test('should display empty block', async ({ wishlistPage }) => {
        await wishlistPage.goto();

        await expect(wishlistPage.emptyTitle).toBeVisible();
        await expect(wishlistPage.emptyLink).toBeVisible();
      });
    });

    test.describe('Wishlist has items', () => {
      test.beforeEach(async ({ productsPage, wishlistPage }) => {
        await new ProductCard(productsPage.productCards.first()).toggleWishlistButton.click();
        await new ProductCard(productsPage.productCards.nth(1)).toggleWishlistButton.click();
        await wishlistPage.goto();
      });

      test('should display back button, title and count', async ({ wishlistPage }) => {
        await expect(wishlistPage.backButton).toBeVisible();
        await expect(wishlistPage.title).toBeVisible();
        await expect(wishlistPage.count).toBeVisible();
      });
    });
  });
});
