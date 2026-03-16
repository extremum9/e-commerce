import { expect, test } from '../fixtures';
import { ProductCard } from '../components';
import { CartProductRow } from '../components/cart-product-row';

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

  test('should display items', async ({ productsPage, cartPage, navbar }) => {
    await productsPage.goto();

    await new ProductCard(productsPage.cards.first()).addToCartButton.click();
    await new ProductCard(productsPage.cards.nth(1)).addToCartButton.click();

    await cartPage.goto();

    await expect(cartPage.count).toBeVisible();
    await expect(cartPage.count).toContainText('Cart Items (2)');

    const productRow = new CartProductRow(cartPage.products.first());
    await expect(productRow.image).toBeVisible();
    await expect(productRow.name).toBeVisible();
    await expect(productRow.name).toContainText('Gaming Laptop');
    await expect(productRow.price).toBeVisible();
    await expect(productRow.price).toContainText('$1,299');
    await expect(productRow.decrementButton).toBeVisible();
    await expect(productRow.decrementButton).toBeDisabled();
    await expect(productRow.quantity).toBeVisible();
    await expect(productRow.quantity).toContainText('1');
    await expect(productRow.incrementButton).toBeVisible();
    await expect(productRow.total).toBeVisible();
    await expect(productRow.total).toContainText('$1,299');
    await expect(productRow.moveToWishlistButton).toBeVisible();
    await expect(productRow.deleteButton).toBeVisible();

    await productRow.incrementButton.click();

    await expect(productRow.decrementButton).toBeEnabled();
    await expect(productRow.quantity).toContainText('2');
    await expect(productRow.total).toContainText('$2,598');

    await productRow.moveToWishlistButton.click();

    await expect(cartPage.products).toHaveCount(1);
    await expect(navbar.wishlistLink).toContainText('1');

    await productRow.deleteButton.click();

    await expect(cartPage.products).toHaveCount(0);
  });

  test('should display order summary', async ({ productsPage, cartPage }) => {
    await productsPage.goto();

    await new ProductCard(productsPage.cards.first()).addToCartButton.click();
    await new ProductCard(productsPage.cards.nth(1)).addToCartButton.click();

    await cartPage.goto();

    await expect(cartPage.orderTitle).toBeVisible();
    await expect(cartPage.orderTitle).toContainText('Order Summary');

    await expect(cartPage.orderSubtotal).toBeVisible();
    await expect(cartPage.orderSubtotal).toContainText('$1,388.99');

    await expect(cartPage.orderTax).toBeVisible();
    await expect(cartPage.orderTax).toContainText('$69.45');

    await expect(cartPage.orderTotal).toBeVisible();
    await expect(cartPage.orderTotal).toContainText('$1,458.44');
  });
});
