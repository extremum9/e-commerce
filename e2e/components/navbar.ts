import { Locator, Page } from '@playwright/test';

export class Navbar {
  public readonly page: Page;
  public readonly brandLink: Locator;
  public readonly wishlistLink: Locator;
  public readonly cartLink: Locator;
  public readonly loginButton: Locator;
  public readonly menuButton: Locator;
  public readonly menuWishlistLink: Locator;
  public readonly menuLoginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.brandLink = page.getByTestId('navbar-brand');
    this.wishlistLink = page.getByTestId('navbar-wishlist-link');
    this.cartLink = page.getByTestId('navbar-cart-link');
    this.loginButton = page.getByTestId('navbar-login-button');
    this.menuButton = page.getByTestId('navbar-menu-button');
    this.menuWishlistLink = page.getByTestId('menu-wishlist-link');
    this.menuLoginButton = page.getByTestId('menu-login-button');
  }

  public async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  public async closeMenu(): Promise<void> {
    await this.menuButton.click({ force: true });
  }
}
