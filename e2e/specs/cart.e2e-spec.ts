import { expect, test } from '../fixtures';
import { ProductCard } from '../components';

test.describe('Cart page', () => {
  test('should display title and back button', async ({ cartPage }) => {
    await cartPage.goto();

    await expect(cartPage.backButton).toBeVisible();
    await expect(cartPage.backButton).toHaveAttribute('href', '/products');
    await expect(cartPage.backButton).toContainText('Continue Shopping');

    await expect(cartPage.title).toBeVisible();
    await expect(cartPage.title).toContainText('Shopping Cart');
  });

  test('should display wishlist preview and move all items from wishlist to cart', async ({
    cartPage,
    productsPage,
    navbar
  }) => {
    await cartPage.goto();

    await expect(cartPage.wishlistPreviewTitle).toBeVisible();
    await expect(cartPage.wishlistPreviewTitle).toContainText('Wishlist (0)');

    await expect(cartPage.wishlistPreviewDescription).toBeVisible();
    await expect(cartPage.wishlistPreviewDescription).toContainText(
      'You have 0 items saved for later'
    );

    await expect(cartPage.wishlistPreviewLink).toBeVisible();
    await expect(cartPage.wishlistPreviewLink).toContainText('View All');

    await expect(cartPage.wishlistPreviewMoveAllButton).toBeHidden();

    await productsPage.goto();
    await new ProductCard(productsPage.cards.first()).toggleWishlistButton.click();
    await new ProductCard(productsPage.cards.nth(1)).toggleWishlistButton.click();
    await cartPage.goto();

    await expect(cartPage.wishlistPreviewTitle).toContainText('Wishlist (2)');
    await expect(cartPage.wishlistPreviewDescription).toContainText(
      'You have 2 items saved for later'
    );
    await expect(cartPage.wishlistPreviewMoveAllButton).toBeVisible();
    await expect(cartPage.wishlistPreviewMoveAllButton).toContainText('Move All to Cart');
    await expect(cartPage.products).toHaveCount(0);

    await cartPage.wishlistPreviewMoveAllButton.click();

    await expect(navbar.wishlistLink).toContainText('0');
    await expect(cartPage.wishlistPreviewMoveAllButton).toBeHidden();

    await expect(cartPage.products).toHaveCount(2);
  });

  test('should display empty block if cart is empty', async ({ cartPage }) => {
    await cartPage.goto();

    await expect(cartPage.emptyTitle).toBeVisible();
    await expect(cartPage.emptyTitle).toContainText('Your cart is empty');
  });
});
