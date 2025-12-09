import { expect, test } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display a brand', async ({ page }) => {
    await expect(page.getByTestId('navbar-brand')).toContainText('MiniStore');
  });
});
