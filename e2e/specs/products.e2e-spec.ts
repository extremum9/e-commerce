import { expect, test } from '../fixtures/fixtures';

test.describe('Products page', () => {
  test('should display a list of products', async ({ page, productsPage }) => {
    await productsPage.goto();

    await expect(productsPage.productCards).toHaveCount(20);
    const productCard = productsPage.getProductCard(0);
    await expect(productCard.image).toBeVisible();
    await expect(productCard.name).toContainText('Wireless Headphones');
    await expect(productCard.description).toBeVisible();
    await expect(productCard.availability).toContainClass('text-green-600');
    await expect(productCard.availability).toContainText('In Stock');
    await expect(productCard.price).toContainText('$249.99');
    await expect(productCard.addToCartButton).toBeEnabled();

    await productsPage.selectCategory('Clothing');

    await expect(page).toHaveURL('products/clothing');
    await expect(productsPage.productCards).toHaveCount(5);
    await expect(productsPage.getProductCard(0).name).toContainText('Neck T-Shirt');

    await productsPage.selectCategory('Accessories');

    await expect(page).toHaveURL('products/accessories');
    await expect(productsPage.productCards).toHaveCount(5);
    await expect(productsPage.getProductCard(0).name).toContainText('Aviator Sunglasses');

    await productsPage.selectCategory('All');
    await expect(page).toHaveURL('products/all');
  });
});
