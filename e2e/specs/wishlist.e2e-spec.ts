import { expect, test } from '../fixtures';
import { ProductCard } from '../components';

test.describe('Wishlist page', () => {
  test('should display empty block if wishlist is empty', async ({ wishlistPage }) => {
    await wishlistPage.goto();

    await expect(wishlistPage.backButton).toBeHidden();
    await expect(wishlistPage.title).toBeHidden();
    await expect(wishlistPage.count).toBeHidden();

    await expect(wishlistPage.emptyTitle).toBeVisible();
    await expect(wishlistPage.emptyTitle).toContainText('Your wishlist is empty');

    await expect(wishlistPage.emptyLink).toBeVisible();
    await expect(wishlistPage.emptyLink).toHaveAttribute('href', '/products');
    await expect(wishlistPage.emptyLink).toContainText('Start Shopping');
  });

  test('should display items', async ({ productsPage, wishlistPage, navbar }) => {
    await productsPage.goto();

    await new ProductCard(productsPage.cards.first()).toggleWishlistButton.click();
    await new ProductCard(productsPage.cards.nth(1)).toggleWishlistButton.click();

    await wishlistPage.goto();

    await expect(wishlistPage.backButton).toBeVisible();
    await expect(wishlistPage.backButton).toHaveAttribute('href', '/products');
    await expect(wishlistPage.backButton).toContainText('Continue Shopping');

    await expect(wishlistPage.title).toBeVisible();
    await expect(wishlistPage.title).toContainText('My Wishlist');

    await expect(wishlistPage.count).toBeVisible();
    await expect(wishlistPage.count).toContainText('2 items');

    await expect(wishlistPage.products).toHaveCount(2);

    const productCard = new ProductCard(wishlistPage.products.first());
    await expect(productCard.name).toContainText('Gaming Laptop');

    await productCard.deleteFromWishlistButton.click();

    await expect(wishlistPage.count).toContainText('1 items');
    await expect(wishlistPage.products).toHaveCount(1);
    await expect(navbar.wishlistLink).toContainText('1');
  });

  test('should delete all items', async ({ productsPage, wishlistPage, confirmDialog }) => {
    await productsPage.goto();

    await new ProductCard(productsPage.cards.first()).toggleWishlistButton.click();
    await new ProductCard(productsPage.cards.nth(1)).toggleWishlistButton.click();

    await wishlistPage.goto();
    await wishlistPage.clearButton.click();

    await expect(confirmDialog.title).toBeVisible();
    await expect(confirmDialog.title).toContainText('Clear Wishlist');
    await expect(confirmDialog.message).toBeVisible();
    await expect(confirmDialog.message).toContainText('Are you sure you want to delete all items?');
    await expect(confirmDialog.cancelButton).toBeVisible();
    await expect(confirmDialog.cancelButton).toContainText('Cancel');
    await expect(confirmDialog.confirmButton).toBeVisible();
    await expect(confirmDialog.confirmButton).toContainText('Clear');

    await confirmDialog.cancelButton.click();

    await expect(confirmDialog.title).toBeHidden();
    await expect(wishlistPage.products).toHaveCount(2);

    await wishlistPage.clearButton.click();
    await confirmDialog.confirmButton.click();

    await expect(confirmDialog.title).toBeHidden();
    await expect(wishlistPage.title).toBeHidden();
    await expect(wishlistPage.products).toHaveCount(0);
    await expect(wishlistPage.emptyTitle).toBeVisible();
  });

  test('should persist items in local storage if not authenticated', async ({
    productsPage,
    wishlistPage,
    page
  }) => {
    await productsPage.goto();

    await new ProductCard(productsPage.cards.first()).toggleWishlistButton.click();
    await new ProductCard(productsPage.cards.nth(1)).toggleWishlistButton.click();

    await page.reload();
    await wishlistPage.goto();

    await expect(wishlistPage.products).toHaveCount(2);
  });

  test('should persist items in database if authenticated', async ({
    register,
    productsPage,
    page,
    wishlistPage
  }) => {
    await register();

    await new ProductCard(productsPage.cards.first()).toggleWishlistButton.click();
    await new ProductCard(productsPage.cards.nth(1)).toggleWishlistButton.click();

    await page.reload();
    await wishlistPage.goto();

    await expect(wishlistPage.loadingSpinner).toBeHidden();
    await expect(wishlistPage.products).toHaveCount(2);
  });
});
