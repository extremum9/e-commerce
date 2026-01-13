import { Locator, Page } from '@playwright/test';

export class Navbar {
  public readonly page: Page;
  public readonly brandLink: Locator;
  public readonly wishlistLink: Locator;
  public readonly cartLink: Locator;
  public readonly loginButton: Locator;
  public readonly userMenuButton: Locator;
  public readonly userProfileImage: Locator;
  public readonly userMenuName: Locator;
  public readonly userMenuEmail: Locator;
  public readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.brandLink = page.getByTestId('navbar-brand');
    this.wishlistLink = page.getByTestId('navbar-wishlist-link');
    this.cartLink = page.getByTestId('navbar-cart-link');
    this.loginButton = page.getByTestId('navbar-login-button');
    this.userMenuButton = page.getByTestId('user-menu-button');
    this.userProfileImage = page.getByTestId('user-profile-image');
    this.userMenuName = page.getByTestId('user-menu-name');
    this.userMenuEmail = page.getByTestId('user-menu-email');
    this.logoutButton = page.getByTestId('logout-button');
  }
}
