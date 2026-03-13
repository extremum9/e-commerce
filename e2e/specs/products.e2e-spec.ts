import { expect, test } from '../fixtures';
import { ProductCard } from '../components';

test.describe('Products page', () => {
  test('should display categories', async ({ productsPage }) => {
    await productsPage.goto();

    await expect(productsPage.categoryLinks).toHaveText([
      'All',
      'Electronics',
      'Clothing',
      'Accessories',
      'Home'
    ]);
    await expect(productsPage.categoryLinks.first()).toHaveAttribute('href', '/products');
    await expect(productsPage.categoryLinks.first()).toHaveAttribute('aria-current', 'page');
    await expect(productsPage.categoryLinks.nth(1)).toHaveAttribute(
      'href',
      '/products/electronics'
    );
    await expect(productsPage.categoryLinks.nth(1)).not.toHaveAttribute('aria-current', 'page');
  });

  test('should display products', async ({ productsPage }) => {
    await productsPage.goto();

    await expect(productsPage.loadingProductListSpinner).toBeHidden();

    await expect(productsPage.count).toContainText('14 products found');
    await expect(productsPage.cards).toHaveCount(14);

    let productCard = new ProductCard(productsPage.cards.first());
    await expect(productCard.image).toBeVisible();
    await expect(productCard.name).toBeVisible();
    await expect(productCard.name).toContainText('Hiking Jacket');
    await expect(productCard.description).toBeVisible();
    await expect(productCard.availability).toBeVisible();
    await expect(productCard.availability).toContainText('In Stock');
    await expect(productCard.price).toBeVisible();
    await expect(productCard.toggleWishlistButton).toBeVisible();
    await expect(productCard.addToCartButton).toBeVisible();

    productCard = new ProductCard(productsPage.cards.last());
    await expect(productCard.availability).toContainText('Out of Stock');
  });

  test('should filter products by category', async ({ page, productsPage }) => {
    await productsPage.goto();
    await productsPage.selectCategory('Clothing');

    await expect(page).toHaveURL('products/clothing');
    await expect(productsPage.count).toContainText('3 products found');
    await expect(productsPage.cards).toHaveCount(3);
    await expect(productsPage.getCard('Jeans')).toBeVisible();

    await productsPage.selectCategory('Accessories');

    await expect(page).toHaveURL('products/accessories');
    await expect(productsPage.count).toContainText('2 products found');
    await expect(productsPage.cards).toHaveCount(2);
    await expect(productsPage.getCard('Wallet')).toBeVisible();
  });

  test('should add or remove product from wishlist and update count', async ({
    productsPage,
    page,
    navbar
  }) => {
    await productsPage.goto();

    const productCard = new ProductCard(productsPage.cards.first());
    await productCard.toggleWishlistButton.click();

    await expect(page.getByText('Product added to wishlist')).toBeVisible();
    await expect(navbar.wishlistLink.getByText('1')).toBeVisible();

    await productCard.toggleWishlistButton.click();

    await expect(page.getByText('Product removed from wishlist')).toBeVisible();
    await expect(navbar.wishlistLink).toContainText('0');
  });
});
