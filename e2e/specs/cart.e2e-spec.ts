import { expect, test } from '../fixtures';

test.describe('Cart page', () => {
  test('should display title and back button', async ({ cartPage }) => {
    await cartPage.goto();

    await expect(cartPage.backButton).toBeVisible();
    await expect(cartPage.backButton).toHaveAttribute('href', '/products');
    await expect(cartPage.backButton).toContainText('Continue Shopping');

    await expect(cartPage.title).toBeVisible();
    await expect(cartPage.title).toContainText('Shopping Cart');
  });
});
