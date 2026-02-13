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

        await expect(wishlistPage.items).toHaveCount(2);
      });

      test('should remove item from list', async ({ wishlistPage, page, navbar }) => {
        const productCard = new ProductCard(wishlistPage.items.first());
        await productCard.deleteFromWishlistButton.click();

        await expect(page.getByText('Product removed from wishlist')).toBeVisible();
        await expect(navbar.wishlistLink).toContainText('1');
        await expect(wishlistPage.count).toContainText('1 items');
        await expect(wishlistPage.items).toHaveCount(1);
      });

      test('should clear list', async ({ wishlistPage, confirmDialog }) => {
        await wishlistPage.clearButton.click();

        await expect(confirmDialog.title).toBeVisible();
        await expect(confirmDialog.title).toContainText('Clear Wishlist');
        await expect(confirmDialog.message).toBeVisible();
        await expect(confirmDialog.message).toContainText(
          'Are you sure you want to delete all items?'
        );
        await expect(confirmDialog.cancelButton).toBeVisible();
        await expect(confirmDialog.cancelButton).toContainText('Cancel');
        await expect(confirmDialog.confirmButton).toBeVisible();
        await expect(confirmDialog.confirmButton).toContainText('Clear');

        await confirmDialog.cancelButton.click();

        await expect(confirmDialog.title).toBeHidden();
        await expect(wishlistPage.items).toHaveCount(2);

        await wishlistPage.clearButton.click();
        await confirmDialog.confirmButton.click();

        await expect(confirmDialog.title).toBeHidden();
        await expect(wishlistPage.title).toBeHidden();
        await expect(wishlistPage.emptyTitle).toBeVisible();
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
        await productsPage.goto();
        await new ProductCard(productsPage.productCards.first()).toggleWishlistButton.click();
        await new ProductCard(productsPage.productCards.nth(1)).toggleWishlistButton.click();
        await wishlistPage.goto();
      });

      test('should display back button, title and count', async ({ wishlistPage }) => {
        await expect(wishlistPage.backButton).toBeVisible();
        await expect(wishlistPage.title).toBeVisible();
        await expect(wishlistPage.count).toBeVisible();
        await expect(wishlistPage.items).toHaveCount(2);
      });

      test('should remove item from list', async ({ wishlistPage, navbar }) => {
        const productCard = new ProductCard(wishlistPage.items.first());
        await productCard.deleteFromWishlistButton.click();

        await expect(navbar.wishlistLink).toContainText('1');
        await expect(wishlistPage.count).toContainText('1 items');
        await expect(wishlistPage.items).toHaveCount(1);
      });

      test('should clear list', async ({ wishlistPage, confirmDialog }) => {
        await wishlistPage.clearButton.click();
        await confirmDialog.confirmButton.click();

        await expect(wishlistPage.title).toBeHidden();
        await expect(wishlistPage.emptyTitle).toBeVisible();
      });
    });
  });
});
