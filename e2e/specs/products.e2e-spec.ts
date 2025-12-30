import { expect, test } from '../fixtures';
import { ProductCard } from '../components';

test.describe('Products page', () => {
  test('should display categories and products', async ({ page, productsPage }) => {
    await productsPage.goto();

    await expect(productsPage.loadingProductListSpinner).toBeVisible();
    await expect(productsPage.loadingProductListSpinner).toHaveCount(0);

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

    await expect(productsPage.productCount).toContainText('14 products found');
    const productCard = new ProductCard(page);
    await expect(productCard.image).toHaveCount(14);
    await expect(productCard.name).toHaveCount(14);
    await expect(productCard.name.first()).toContainText('High-Speed Blender');
    await expect(productCard.description).toHaveCount(14);
    await expect(productCard.availability).toHaveCount(14);
    await expect(productCard.availability.first()).toContainText('Out of Stock');
    await expect(productCard.availability.nth(1)).toContainText('In Stock');
    await expect(productCard.price).toHaveCount(14);
    await expect(productCard.addToCartButton).toHaveCount(14);
  });

  test('should filter products by category', async ({ page, productsPage }) => {
    await productsPage.goto();
    await productsPage.selectCategory('Clothing');

    await expect(page).toHaveURL('products/clothing');
    await expect(productsPage.productCount).toContainText('3 products found');
    const productCard = new ProductCard(page);
    await expect(productCard.name).toHaveCount(3);
    await expect(productCard.name.first()).toContainText('Slim-Fit Denim Jeans');

    await productsPage.selectCategory('Accessories');

    await expect(page).toHaveURL('products/accessories');
    await expect(productsPage.productCount).toContainText('2 products found');
    await expect(productCard.name).toHaveCount(2);
    await expect(productCard.name.first()).toContainText('Genuine Leather Wallet');
  });
});
