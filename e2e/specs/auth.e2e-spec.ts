import { expect, test } from '../fixtures';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page, navbar }) => {
    await page.goto('/');
    await navbar.loginButton.click();
  });

  test('should display a sign-in tab', async ({ authDialog }) => {
    await expect(authDialog.submitButton).toBeVisible();
    await expect(authDialog.submitButton).toBeEnabled();

    await authDialog.emailInput.fill('');
    await authDialog.emailInput.blur();
    await expect(authDialog.errorMessage).toBeVisible();
    await expect(authDialog.errorMessage).toContainText('Email is required');

    await authDialog.emailInput.fill('john');
    await expect(authDialog.errorMessage).toBeVisible();
    await expect(authDialog.errorMessage).toContainText('Email is invalid');

    await authDialog.emailInput.fill('john.doe@mail.com');
    await expect(authDialog.errorMessage).toBeHidden();

    await authDialog.passwordInput.fill('');
    await authDialog.passwordInput.blur();
    await expect(authDialog.errorMessage).toBeVisible();
    await expect(authDialog.errorMessage).toContainText('Password is required');

    await authDialog.passwordInput.fill('1234');
    await expect(authDialog.errorMessage).toBeVisible();
    await expect(authDialog.errorMessage).toContainText(
      'Password must be at least 6 characters long'
    );

    await authDialog.passwordInput.fill('123456');
    await expect(authDialog.errorMessage).toBeHidden();

    await authDialog.passwordVisibilityToggleButton.click();
    await expect(authDialog.passwordInput).toHaveAttribute('type', 'text');

    await authDialog.passwordVisibilityToggleButton.click();
    await expect(authDialog.passwordInput).toHaveAttribute('type', 'password');

    await authDialog.submitButton.click();

    await expect(authDialog.submitButton).toBeDisabled();
    await expect(authDialog.submitButton).toContainText('Signing In...');

    await expect(authDialog.submitButton).toBeHidden();
  });

  test('should display a snackbar on login failure', async ({ page, authDialog }) => {
    await authDialog.login({ email: 'john@mail.com' });

    await expect(authDialog.submitButton).toBeEnabled();
    await expect(authDialog.submitButton).toContainText('Sign In');
    await expect(authDialog.submitButton).toBeVisible();

    const snackbar = page.getByText('The email or password is incorrect');
    await expect(snackbar).toBeVisible();
    await expect(snackbar).toBeHidden();
  });
});
