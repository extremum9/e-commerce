import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';

import { Navbar } from './navbar';

describe(Navbar.name, () => {
  const setup = () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    });
    const fixture = TestBed.createComponent(Navbar);
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    return { fixture, debugElement, loader };
  };

  it('should display the brand', () => {
    const { debugElement } = setup();
    const brandLink = debugElement.query(By.css('[data-testid=navbar-brand]'));
    expect(brandLink).withContext('No `a` element for the brand link').toBeTruthy();
    expect(brandLink.nativeElement.getAttribute('href'))
      .withContext('The `href` attribute of the brand link is incorrect')
      .toBe('/');
    expect(brandLink.nativeElement.textContent)
      .withContext('The brand link should have a text')
      .toContain('MiniStore');
  });

  it('should display actions', async () => {
    const { loader } = setup();

    const wishlistLinkHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=navbar-wishlist-link]' })
    );
    const wishlistLink = await wishlistLinkHarness.host();
    expect(await wishlistLink.getAttribute('href'))
      .withContext('The `href` attribute of the wishlist link is incorrect')
      .toBe('/wishlist');
    expect(await wishlistLink.getAttribute('aria-label'))
      .withContext('The `aria-label` attribute of the wishlist link is incorrect')
      .toContain('Wishlist');

    const wishlistLinkIconHarness = await wishlistLinkHarness.getHarness(MatIconHarness);
    expect(await wishlistLinkIconHarness.getName())
      .withContext('The wishlist link should have an icon')
      .toBe('favorite');

    const cartLinkHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=navbar-cart-link]' })
    );
    const cartLink = await cartLinkHarness.host();
    expect(await cartLink.getAttribute('href'))
      .withContext('The `href` attribute of the cart link is incorrect')
      .toBe('/cart');
    expect(await cartLink.getAttribute('aria-label'))
      .withContext('The `aria-label` attribute of the cart link is incorrect')
      .toContain('Cart');

    const cartLinkIconHarness = await cartLinkHarness.getHarness(MatIconHarness);
    expect(await cartLinkIconHarness.getName())
      .withContext('The cart link should have an icon')
      .toBe('shopping_cart');

    const loginButtonHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=navbar-login-button]', appearance: 'filled' })
    );
    expect(await loginButtonHarness.getText())
      .withContext('The login button should have a text')
      .toContain('Sign In');
  });

  it('should toggle the menu', async () => {
    const { loader } = setup();
    const menuButtonSelector = '[data-testid=navbar-menu-button]';

    const menuButtonHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: menuButtonSelector })
    );
    const menuButton = await menuButtonHarness.host();
    expect(await menuButton.getAttribute('aria-label'))
      .withContext('The `aria-label` attribute of the menu button is incorrect')
      .toContain('Toggle menu');

    const menuButtonIconHarness = await menuButtonHarness.getHarness(MatIconHarness);
    expect(await menuButtonIconHarness.getName())
      .withContext('The menu button should have an icon')
      .toBe('menu');

    const menuHarness = await loader.getHarness(
      MatMenuHarness.with({ selector: menuButtonSelector })
    );
    await menuHarness.open();

    expect(await menuHarness.isOpen())
      .withContext('The menu should be opened after click')
      .toBe(true);

    const menuItems = await menuHarness.getItems();
    expect(menuItems.length)
      .withContext('The menu should have two items: the wishlist link and the login button')
      .toBe(2);
  });
});
