import { expect, test } from '../fixtures';
import { getRandomString } from '../utils';
import { ProductCard } from '../components';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page, navbar }) => {
    await page.goto('/');
    await navbar.loginButton.click();
  });

  test('should display a login tab', async ({ authDialog }) => {
    await expect(authDialog.loginSubmitButton).toBeVisible();
    await expect(authDialog.loginSubmitButton).toBeEnabled();

    await authDialog.loginEmailInput.fill('');
    await authDialog.loginEmailInput.blur();
    await expect(authDialog.errorMessage).toBeVisible();
    await expect(authDialog.errorMessage).toContainText('Email is required');

    await authDialog.loginEmailInput.fill('john');
    await expect(authDialog.errorMessage).toBeVisible();
    await expect(authDialog.errorMessage).toContainText('Email is invalid');

    await authDialog.loginEmailInput.fill('john.doe@mail.com');
    await expect(authDialog.errorMessage).toBeHidden();

    await authDialog.loginPasswordInput.fill('');
    await authDialog.loginPasswordInput.blur();
    await expect(authDialog.errorMessage).toBeVisible();
    await expect(authDialog.errorMessage).toContainText('Password is required');

    await authDialog.loginPasswordInput.fill('1234');
    await expect(authDialog.errorMessage).toBeVisible();
    await expect(authDialog.errorMessage).toContainText(
      'Password must be at least 6 characters long'
    );

    await authDialog.loginPasswordInput.fill('123456');
    await expect(authDialog.errorMessage).toBeHidden();

    await expect(authDialog.loginPasswordToggleButton).toBeVisible();

    await authDialog.loginPasswordToggleButton.click();
    await expect(authDialog.loginPasswordInput).toHaveAttribute('type', 'text');

    await authDialog.loginPasswordToggleButton.click();
    await expect(authDialog.loginPasswordInput).toHaveAttribute('type', 'password');

    await expect(authDialog.loginRememberMeCheckbox).toBeVisible();
    await expect(authDialog.loginRememberMeCheckbox).not.toBeChecked();
    await authDialog.loginRememberMeCheckbox.check();
    await expect(authDialog.loginRememberMeCheckbox).toBeChecked();

    await authDialog.loginSubmitButton.click();

    await expect(authDialog.loginSubmitButton).toBeHidden();
  });

  test('should display a snackbar on login failure', async ({ page, authDialog }) => {
    await authDialog.login({ email: `${getRandomString()}@mail.com` });

    await expect(page.getByText('The email or password is incorrect')).toBeVisible();

    await expect(authDialog.loginSubmitButton).toBeEnabled();
    await expect(authDialog.loginSubmitButton).toContainText('Sign In');
  });

  test('should display a register tab', async ({ authDialog }) => {
    await authDialog.signUpTab.click();

    await expect(authDialog.registerSubmitButton).toBeVisible();
    await expect(authDialog.registerSubmitButton).toBeEnabled();

    await authDialog.registerNameInput.fill('');
    await authDialog.registerNameInput.blur();
    await expect(authDialog.errorMessage).toBeVisible();
    await expect(authDialog.errorMessage).toContainText('Name is required');

    const name = getRandomString();
    await authDialog.registerNameInput.fill(name);
    await expect(authDialog.errorMessage).toBeHidden();

    await authDialog.registerEmailInput.fill('');
    await authDialog.registerEmailInput.blur();
    await expect(authDialog.errorMessage).toBeVisible();
    await expect(authDialog.errorMessage).toContainText('Email is required');

    await authDialog.registerEmailInput.fill('test');
    await expect(authDialog.errorMessage).toBeVisible();
    await expect(authDialog.errorMessage).toContainText('Email is invalid');

    const email = `${getRandomString()}@mail.com`;
    await authDialog.registerEmailInput.fill(email);
    await expect(authDialog.errorMessage).toBeHidden();

    await authDialog.registerPasswordInput.fill('');
    await authDialog.registerPasswordInput.blur();
    await expect(authDialog.errorMessage).toBeVisible();
    await expect(authDialog.errorMessage).toContainText('Password is required');

    await authDialog.registerPasswordInput.fill('1234');
    await expect(authDialog.errorMessage).toBeVisible();
    await expect(authDialog.errorMessage).toContainText(
      'Password must be at least 6 characters long'
    );

    await authDialog.registerPasswordInput.fill('123456');
    await expect(authDialog.errorMessage).toBeHidden();

    await expect(authDialog.registerPasswordToggleButton).toBeVisible();

    await authDialog.registerPasswordToggleButton.click();
    await expect(authDialog.registerPasswordInput).toHaveAttribute('type', 'text');

    await authDialog.registerPasswordToggleButton.click();
    await expect(authDialog.registerPasswordInput).toHaveAttribute('type', 'password');

    await authDialog.registerSubmitButton.click();

    await expect(authDialog.registerSubmitButton).toBeHidden();
  });

  test('should display a snackbar on register failure', async ({ page, authDialog }) => {
    await authDialog.signUpTab.click();
    await authDialog.register({ email: 'john.doe@mail.com' });

    await expect(page.getByText('Try again with another email')).toBeVisible();

    await expect(authDialog.registerSubmitButton).toBeEnabled();
    await expect(authDialog.registerSubmitButton).toContainText('Sign Up');
  });

  test('should send password reset link', async ({ page, authDialog }) => {
    await authDialog.resetPasswordButton.click();
    await expect(page.getByText('Please enter your email address')).toBeVisible();

    await authDialog.loginEmailInput.fill('john.doe@mail.com');
    await authDialog.resetPasswordButton.click();

    await expect(page.getByText('A password reset link has been sent')).toBeVisible();
    await expect(authDialog.resetPasswordSpinner).toBeHidden();
    await expect(authDialog.resetPasswordButton).toBeVisible();
  });

  test('should login with google', async ({ page, authDialog }) => {
    const popupPromise = page.waitForEvent('popup');

    await authDialog.loginWithGoogleButton.click();

    const popup = await popupPromise;
    await popup.waitForLoadState('domcontentloaded');
    await popup.getByRole('button', { name: 'Add new account' }).click();
    await popup.getByRole('button', { name: /Auto-generate/ }).click();
    await popup.getByRole('button', { name: /Sign in/ }).click();
    await popup.waitForEvent('close');

    await expect(authDialog.loginWithGoogleButton).toBeHidden();
  });

  test('should sync local wishlist on login', async ({ page, productsPage, login, navbar }) => {
    await productsPage.goto();

    const productCard = new ProductCard(productsPage.productCards.first());
    await productCard.toggleWishlistButton.click();

    await login();

    await expect(navbar.userMenuButton).toBeVisible();
    await expect(navbar.wishlistLink).toContainText('1');
    await expect
      .poll(async () => page.evaluate(() => window.localStorage.getItem('e-commerce-wishlist')))
      .toBeNull();

    await page.reload();

    await expect(navbar.wishlistLink).toContainText('1');
  });

  test('should sync local wishlist on register', async ({
    page,
    productsPage,
    register,
    navbar
  }) => {
    await productsPage.goto();

    const productCard = new ProductCard(productsPage.productCards.first());
    await productCard.toggleWishlistButton.click();

    await register();

    await expect(navbar.userMenuButton).toBeVisible();
    await expect(navbar.wishlistLink).toContainText('1');
    await expect
      .poll(async () => page.evaluate(() => window.localStorage.getItem('e-commerce-wishlist')))
      .toBeNull();

    await page.reload();

    await expect(navbar.wishlistLink).toContainText('1');
  });
});
