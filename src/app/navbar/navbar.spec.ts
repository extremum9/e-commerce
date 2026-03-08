import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness, MatIconTestingModule } from '@angular/material/icon/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatBadgeHarness } from '@angular/material/badge/testing';

import { createMockUser, provideDisabledAnimations } from '../testing-utils';
import { CurrentUser } from '../models/current-user';
import { AuthApiClient } from '../auth/auth-api-client';
import { WishlistApiClient } from '../wishlist/wishlist-api-client';
import { AuthDialog } from '../auth/auth-dialog/auth-dialog';
import { CartApiClient } from '../cart/cart-api-client';

import { Navbar } from './navbar';

describe(Navbar.name, () => {
  const setup = async () => {
    const mockUser = createMockUser();

    const currentUser = signal<CurrentUser | null>(null);
    const authApiClientSpy = jasmine.createSpyObj<AuthApiClient>('AuthApiClient', ['logout'], {
      currentUser
    });

    const wishlistCount = signal(0);
    const wishlistApiClientSpy = jasmine.createSpyObj<WishlistApiClient>('WishlistApiClient', [], {
      count: wishlistCount
    });

    const cartCount = signal(0);
    const cartApiClientSpy = jasmine.createSpyObj<CartApiClient>('CartApiClient', [], {
      count: cartCount
    });

    const dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideDisabledAnimations(),
        {
          provide: AuthApiClient,
          useValue: authApiClientSpy
        },
        {
          provide: WishlistApiClient,
          useValue: wishlistApiClientSpy
        },
        {
          provide: CartApiClient,
          useValue: cartApiClientSpy
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
    await fixture.whenStable();

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
      wishlistCount,
      cartCount,
      dialogSpy
    };
  };

  it('should display brand', async () => {
    const { debugElement } = await setup();
    const brandLinkDebugElement = debugElement.query(By.css('[data-testid=navbar-brand]'));
    expect(brandLinkDebugElement).toBeTruthy();
    expect(brandLinkDebugElement.nativeElement.getAttribute('href')).toBe('/');
    expect(brandLinkDebugElement.nativeElement.textContent).toContain('MiniStore');
  });

  it('should display user links', async () => {
    const { loader, getLoginButtonHarness } = await setup();

    const wishlistLinkHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=navbar-wishlist-link]' })
    );
    const wishlistLinkHost = await wishlistLinkHarness.host();
    expect(await wishlistLinkHost.getAttribute('href')).toBe('/wishlist');
    expect(await wishlistLinkHost.getAttribute('aria-label')).toContain('Wishlist');

    const wishlistLinkIconHarness = await wishlistLinkHarness.getHarness(MatIconHarness);
    expect(await wishlistLinkIconHarness.getName()).toBe('favorite');

    const cartLinkHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=navbar-cart-link]' })
    );
    const cartLinkHost = await cartLinkHarness.host();
    expect(await cartLinkHost.getAttribute('href')).toBe('/cart');
    expect(await cartLinkHost.getAttribute('aria-label')).toContain('Cart');

    const cartLinkIconHarness = await cartLinkHarness.getHarness(MatIconHarness);
    expect(await cartLinkIconHarness.getName()).toBe('shopping_cart');

    const loginButtonHarness = await getLoginButtonHarness();
    expect(await loginButtonHarness.getText()).toContain('Sign In');
  });

  it('should display wishlist count if not empty', async () => {
    const { loader, wishlistCount } = await setup();
    const badgeHarness = await loader.getHarness(
      MatBadgeHarness.with({ selector: '[data-testid=navbar-wishlist-link]' })
    );

    expect(await badgeHarness.isHidden()).toBe(true);
    wishlistCount.set(1);
    expect(await badgeHarness.isHidden()).toBe(false);
    expect(await badgeHarness.getText()).toBe('1');
  });

  it('should display cart count if not empty', async () => {
    const { loader, cartCount } = await setup();
    const badgeHarness = await loader.getHarness(
      MatBadgeHarness.with({ selector: '[data-testid=navbar-cart-link]' })
    );

    expect(await badgeHarness.isHidden()).toBe(true);
    cartCount.set(1);
    expect(await badgeHarness.isHidden()).toBe(false);
    expect(await badgeHarness.getText()).toBe('1');
  });

  it('should display user profile if logged in', async () => {
    const { fixture, debugElement, loader, getUserMenuHarness, mockUser, currentUser } =
      await setup();
    currentUser.set(mockUser);

    const hasLoginButtonHarness = await loader.hasHarness(
      MatButtonHarness.with({ selector: '[data-testid=navbar-login-button]' })
    );
    expect(hasLoginButtonHarness).toBe(false);

    const userMenuButtonHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=user-menu-button]' })
    );
    const userMenuButtonHost = await userMenuButtonHarness.host();
    expect(await userMenuButtonHost.getAttribute('aria-label')).toBe('Toggle user menu');

    const userProfileImageDebugElement = debugElement.query(
      By.css('[data-testid=user-profile-image]')
    );
    expect(userProfileImageDebugElement).toBeTruthy();

    const userProfileImageElement: HTMLImageElement = userProfileImageDebugElement.nativeElement;
    expect(userProfileImageElement.getAttribute('src')).toBe(mockUser.imageUrl);
    expect(userProfileImageElement.getAttribute('alt')).toBe('Profile image');

    currentUser.set({ ...mockUser, imageUrl: null });
    await fixture.whenStable();

    expect(userProfileImageElement.getAttribute('src')).toBe('person.jpg');

    const userMenuHarness = await getUserMenuHarness();
    await userMenuHarness.open();

    const userMenuHarnessItems = await userMenuHarness.getItems();
    expect(userMenuHarnessItems.length).toBe(1);

    const userMenuNameDebugElement = debugElement.query(By.css('[data-testid=user-menu-name]'));
    expect(userMenuNameDebugElement).toBeTruthy();
    expect(userMenuNameDebugElement.nativeElement.textContent).toContain(mockUser.name);

    const userMenuEmailDebugElement = debugElement.query(By.css('[data-testid=user-menu-email]'));
    expect(userMenuEmailDebugElement).toBeTruthy();
    expect(userMenuEmailDebugElement.nativeElement.textContent).toContain(mockUser.email);
  });

  it('should open auth dialog when clicking login button', async () => {
    const { getLoginButtonHarness, dialogSpy } = await setup();
    const loginButtonHarness = await getLoginButtonHarness();

    await loginButtonHarness.click();

    expect(dialogSpy.open).toHaveBeenCalledOnceWith(AuthDialog, { width: '400px' });
  });

  it('should logout user', async () => {
    const { getUserMenuHarness, mockUser, currentUser, authApiClientSpy } = await setup();
    currentUser.set(mockUser);

    const userMenuHarness = await getUserMenuHarness();
    await userMenuHarness.open();
    await userMenuHarness.clickItem({ selector: '[data-testid=logout-button]' });

    expect(authApiClientSpy.logout).toHaveBeenCalled();
  });
});
