import { expect, test } from '../fixtures';
import { ProductCard } from '../components';

test.describe('Products page', () => {
  test('should display categories and products', async ({ productsPage }) => {
    await productsPage.goto();

    await expect(productsPage.loadingProductListSpinner).toBeHidden();

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
    await expect(productsPage.productCards).toHaveCount(14);

    const lampCardContainer = productsPage.getProductCard(/Lamp/);
    const lampCard = new ProductCard(lampCardContainer);
    await expect(lampCard.image).toBeVisible();
    await expect(lampCard.name).toBeVisible();
    await expect(lampCard.description).toBeVisible();
    await expect(lampCard.availability).toBeVisible();
    await expect(lampCard.availability).toContainText('In Stock');
    await expect(lampCard.price).toBeVisible();
    await expect(lampCard.addToCartButton).toBeVisible();

    const blenderCardContainer = productsPage.getProductCard(/Blender/);
    const blenderCard = new ProductCard(blenderCardContainer);
    await expect(blenderCard.availability).toContainText('Out of Stock');
  });

  test('should filter products by category', async ({ page, productsPage }) => {
    await productsPage.goto();
    await productsPage.selectCategory('Clothing');

    await expect(page).toHaveURL('products/clothing');
    await expect(productsPage.productCount).toContainText('3 products found');
    await expect(productsPage.productCards).toHaveCount(3);
    await expect(productsPage.getProductCard(/Jeans/)).toBeVisible();

    await productsPage.selectCategory('Accessories');

    await expect(page).toHaveURL('products/accessories');
    await expect(productsPage.productCount).toContainText('2 products found');
    await expect(productsPage.productCards).toHaveCount(2);
    await expect(productsPage.getProductCard(/Wallet/)).toBeVisible();
  });
});
