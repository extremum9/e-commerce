import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness, MatIconTestingModule } from '@angular/material/icon/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatDialog } from '@angular/material/dialog';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';

import { createMockUser } from '../testing-utils';
import { CurrentUser } from '../models/current-user';
import { AuthApiClient } from '../auth/auth-api-client';
import AuthDialog from '../auth/auth-dialog/auth-dialog';

import { Navbar } from './navbar';

describe(Navbar.name, () => {
  const setup = () => {
    const mockUser = createMockUser();
    const currentUser = signal<CurrentUser | null>(null);
    const authApiClientSpy = jasmine.createSpyObj<AuthApiClient>('AuthApiClient', ['logout'], {
      currentUser
    });

    const dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: MATERIAL_ANIMATIONS,
          useValue: { animationsDisabled: true }
        },
        {
          provide: AuthApiClient,
          useValue: authApiClientSpy
        },
        {
          provide: MatDialog,
          useValue: dialogSpy
        }
      ]
    });
    const fixture = TestBed.createComponent(Navbar);
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    const getLoginButtonHarness = () =>
      loader.getHarness(
        MatButtonHarness.with({
          selector: '[data-testid=navbar-login-button]',
          appearance: 'filled'
        })
      );

    const getUserMenuHarness = () =>
      loader.getHarness(MatMenuHarness.with({ selector: '[data-testid=user-menu-button]' }));

    return {
      fixture,
      debugElement,
      loader,
      getLoginButtonHarness,
      getUserMenuHarness,
      mockUser,
      currentUser,
      authApiClientSpy,
      dialogSpy
    };
  };

  it('should display brand', () => {
    const { debugElement } = setup();
    const brandLink = debugElement.query(By.css('[data-testid=navbar-brand]'));
    expect(brandLink).withContext('brand link element').toBeTruthy();
    expect(brandLink.nativeElement.getAttribute('href')).withContext('brand link href').toBe('/');
    expect(brandLink.nativeElement.textContent)
      .withContext('brand link text')
      .toContain('MiniStore');
  });

  it('should display user links', async () => {
    const { loader, getLoginButtonHarness } = setup();

    const wishlistLinkHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=navbar-wishlist-link]' })
    );
    const wishlistLink = await wishlistLinkHarness.host();
    expect(await wishlistLink.getAttribute('href'))
      .withContext('wishlist link href')
      .toBe('/wishlist');
    expect(await wishlistLink.getAttribute('aria-label'))
      .withContext('wishlist link aria-label')
      .toContain('Wishlist');

    const wishlistLinkIconHarness = await wishlistLinkHarness.getHarness(MatIconHarness);
    expect(await wishlistLinkIconHarness.getName())
      .withContext('wishlist link icon')
      .toBe('favorite');

    const cartLinkHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=navbar-cart-link]' })
    );
    const cartLink = await cartLinkHarness.host();
    expect(await cartLink.getAttribute('href'))
      .withContext('cart link href')
      .toBe('/cart');
    expect(await cartLink.getAttribute('aria-label'))
      .withContext('cart link aria-label')
      .toContain('Cart');

    const cartLinkIconHarness = await cartLinkHarness.getHarness(MatIconHarness);
    expect(await cartLinkIconHarness.getName())
      .withContext('cart link icon')
      .toBe('shopping_cart');

    const loginButtonHarness = await getLoginButtonHarness();
    expect(await loginButtonHarness.getText())
      .withContext('login button text')
      .toContain('Sign In');
  });

  it('should display user profile if logged in', async () => {
    const { fixture, debugElement, loader, getUserMenuHarness, mockUser, currentUser } = setup();
    currentUser.set(mockUser);
    fixture.detectChanges();

    expect(debugElement.query(By.css('[data-testid=navbar-login-button]')))
      .withContext('login button (logged in)')
      .toBeFalsy();

    const userMenuButtonHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=user-menu-button]' })
    );
    const userMenuButton = await userMenuButtonHarness.host();
    expect(await userMenuButton.getAttribute('aria-label'))
      .withContext('user menu button aria-label')
      .toBe('Toggle user menu');

    const userProfileImage = debugElement.query(By.css('[data-testid=user-profile-image]'));
    expect(userProfileImage).withContext('User profile image element').toBeTruthy();
    expect(userProfileImage.nativeElement.getAttribute('src'))
      .withContext('user profile image src')
      .toBe(mockUser.imageUrl);
    expect(userProfileImage.nativeElement.getAttribute('alt'))
      .withContext('user profile image alt text')
      .toBe('Profile image');

    currentUser.set({ ...mockUser, imageUrl: null });
    fixture.detectChanges();

    expect(userProfileImage.nativeElement.getAttribute('src'))
      .withContext('user profile image src (fallback)')
      .toBe('person.jpg');

    const userMenuHarness = await getUserMenuHarness();
    await userMenuHarness.open();

    const userMenuItems = await userMenuHarness.getItems();
    expect(userMenuItems.length).withContext('user menu items').toBe(1);

    const userMenuName = debugElement.query(By.css('[data-testid=user-menu-name]'));
    expect(userMenuName).toBeTruthy();
    expect(userMenuName.nativeElement.textContent)
      .withContext('user menu name')
      .toContain(mockUser.name);

    const userMenuEmail = debugElement.query(By.css('[data-testid=user-menu-email]'));
    expect(userMenuEmail).toBeTruthy();
    expect(userMenuEmail.nativeElement.textContent)
      .withContext('user menu email')
      .toContain(mockUser.email);
  });

  it('should call MatDialog.open to open auth dialog', async () => {
    const { getLoginButtonHarness, dialogSpy } = setup();
    const loginButtonHarness = await getLoginButtonHarness();

    await loginButtonHarness.click();

    expect(dialogSpy.open).toHaveBeenCalledOnceWith(AuthDialog, { width: '400px' });
  });

  it('should call AuthApiClient.logout and logout user', async () => {
    const { fixture, getUserMenuHarness, mockUser, currentUser, authApiClientSpy } = setup();
    currentUser.set(mockUser);
    fixture.detectChanges();

    const userMenuHarness = await getUserMenuHarness();
    await userMenuHarness.open();
    await userMenuHarness.clickItem({ selector: '[data-testid=logout-button]' });

    expect(authApiClientSpy.logout).toHaveBeenCalled();
  });
});
