import { TestBed } from '@angular/core/testing';
import { Component, input, output, provideZonelessChangeDetection, signal } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';

import { createMockProduct, provideDisabledAnimations } from '../testing-utils';
import { CartProduct } from '../models/cart-product';
import { BackButton } from '../back-button/back-button';
import { Snackbar } from '../snackbar/snackbar';
import { ProductApiClient } from '../product/product-api-client';
import { WishlistApiClient } from '../wishlist/wishlist-api-client';
import { OrderSummary } from '../models/order-summary';

import Cart from './cart';
import { CartWishlistPreview } from './cart-wishlist-preview/cart-wishlist-preview';
import { CartProductRow } from './cart-product-row/cart-product-row';
import { CartQuantity } from './cart-quantity/cart-quantity';
import { CartOrderSummary } from './cart-order-summary/cart-order-summary';
import { CartApiClient } from './cart-api-client';
import { CartEmptyBlock } from './cart-empty-block/cart-empty-block';

type SetupConfig = {
  cart$: Observable<Map<string, number>>;
};

@Component({
  selector: 'app-back-button',
  template: '<ng-content />'
})
class BackButtonStub {
  navigateTo = input.required<string>();
}

@Component({
  selector: 'app-cart-wishlist-preview',
  template: ''
})
class CartWishlistPreviewStub {
  count = input.required<number>();
  allAdded = output();
}

@Component({
  selector: 'app-cart-product-row',
  template: '<ng-content />'
})
class CartProductRowStub {
  product = input.required<CartProduct>();
  favorited = output();
  deleted = output();
}

@Component({
  selector: 'app-cart-quantity',
  template: ''
})
class CartQuantityStub {
  quantity = input.required<number>();
}

@Component({
  selector: 'app-cart-order-summary',
  template: ''
})
class CartOrderSummaryStub {
  summary = input.required<OrderSummary>();
}

describe(Cart.name, () => {
  const setup = async (config: Partial<SetupConfig> = {}) => {
    const mockCart = new Map([
      ['1', 1],
      ['2', 2]
    ]);
    const { cart$ }: SetupConfig = {
      cart$: of(mockCart),
      ...config
    };

    const cartApiClientSpy = jasmine.createSpyObj<CartApiClient>(
      'CartApiClient',
      ['create', 'createMany', 'delete'],
      {
        cart$,
        cart: signal(mockCart),
        count: signal(2)
      }
    );
    cartApiClientSpy.createMany.and.returnValue(of(undefined));
    cartApiClientSpy.delete.and.returnValue(of(undefined));

    const wishlistSet = signal(new Set(['1', '2', '3', '4']));
    const wishlistApiClientSpy = jasmine.createSpyObj<WishlistApiClient>(
      'WishlistApiClient',
      ['create', 'deleteAll'],
      {
        wishlistSet,
        count: signal(4)
      }
    );
    wishlistApiClientSpy.create.and.returnValue(of(undefined));
    wishlistApiClientSpy.deleteAll.and.returnValue(of(undefined));

    const mockProducts = [
      createMockProduct({ price: 10 }),
      createMockProduct({ id: '2', price: 20 })
    ];
    const productApiClientSpy = jasmine.createSpyObj<ProductApiClient>('ProductApiClient', [
      'listByIds'
    ]);
    productApiClientSpy.listByIds.and.returnValue(of(mockProducts));

    const snackbarSpy = jasmine.createSpyObj<Snackbar>('Snackbar', ['showSuccess']);

    TestBed.overrideComponent(Cart, {
      remove: {
        imports: [BackButton, CartWishlistPreview, CartProductRow, CartQuantity, CartOrderSummary]
      },
      add: {
        imports: [
          BackButtonStub,
          CartWishlistPreviewStub,
          CartProductRowStub,
          CartQuantityStub,
          CartOrderSummaryStub
        ]
      }
    });
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideDisabledAnimations(),
        {
          provide: CartApiClient,
          useValue: cartApiClientSpy
        },
        {
          provide: WishlistApiClient,
          useValue: wishlistApiClientSpy
        },
        {
          provide: ProductApiClient,
          useValue: productApiClientSpy
        },
        {
          provide: Snackbar,
          useValue: snackbarSpy
        }
      ]
    });
    const fixture = TestBed.createComponent(Cart);
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    const getWishlistPreviewDebugElement = () =>
      debugElement.query(By.directive(CartWishlistPreviewStub));
    const getProductRowDebugElements = () =>
      debugElement.queryAll(By.directive(CartProductRowStub));
    const getQuantityDebugElements = () => debugElement.queryAll(By.directive(CartQuantityStub));

    return {
      fixture,
      debugElement,
      loader,
      getWishlistPreviewDebugElement,
      getProductRowDebugElements,
      getQuantityDebugElements,
      mockProducts,
      cartApiClientSpy,
      wishlistApiClientSpy,
      snackbarSpy
    };
  };

  it('should display loading spinner if cart is loading', async () => {
    const cart$ = new Subject<Map<string, number>>();
    const { loader } = await setup({ cart$ });
    const hasSpinnerHarness = () =>
      loader.hasHarness(
        MatProgressSpinnerHarness.with({ selector: '[data-testid=loading-cart-spinner]' })
      );

    expect(await hasSpinnerHarness()).toBe(true);
    cart$.next(new Map());
    expect(await hasSpinnerHarness()).toBe(false);
  });

  it('should display empty block if cart is empty', async () => {
    const cart$ = new Subject<Map<string, number>>();
    const { fixture, debugElement } = await setup({ cart$ });

    expect(debugElement.query(By.directive(CartEmptyBlock))).toBeFalsy();
    cart$.next(new Map());
    await fixture.whenStable();
    expect(debugElement.query(By.directive(CartEmptyBlock))).toBeTruthy();
  });

  it('should display back button', async () => {
    const { debugElement } = await setup();
    const backButtonDebugElement = debugElement.query(By.directive(BackButtonStub));

    expect(backButtonDebugElement).toBeTruthy();
    expect(backButtonDebugElement.nativeElement.textContent).toContain('Continue Shopping');
    expect((backButtonDebugElement.componentInstance as BackButtonStub).navigateTo()).toBe(
      '/products'
    );
  });

  it('should display title', async () => {
    const { debugElement } = await setup();
    const titleDebugElement = debugElement.query(By.css('[data-testid=cart-title]'));

    expect(titleDebugElement).toBeTruthy();
    expect(titleDebugElement.nativeElement.textContent).toContain('Cart');
  });

  it('should display wishlist preview', async () => {
    const { getWishlistPreviewDebugElement } = await setup();
    const wishlistPreviewDebugElement = getWishlistPreviewDebugElement();

    expect(wishlistPreviewDebugElement).toBeTruthy();
    expect((wishlistPreviewDebugElement.componentInstance as CartWishlistPreviewStub).count()).toBe(
      4
    );
  });

  it('should display count', async () => {
    const { debugElement } = await setup();
    const countDebugElement = debugElement.query(By.css('[data-testid=cart-count]'));

    expect(countDebugElement).toBeTruthy();
    expect(countDebugElement.nativeElement.textContent).toContain('2');
  });

  it('should display products and its quantities', async () => {
    const { getProductRowDebugElements, getQuantityDebugElements, mockProducts } = await setup();

    const productRowDebugElements = getProductRowDebugElements();
    expect(productRowDebugElements.length).toBe(2);
    const productRow = productRowDebugElements[0].componentInstance as CartProductRowStub;
    expect(productRow.product()).toEqual({ ...mockProducts[0], quantity: 1 });

    const quantityDebugElements = getQuantityDebugElements();
    expect(quantityDebugElements.length).toBe(2);
    const quantity = quantityDebugElements[0].componentInstance as CartQuantityStub;
    expect(quantity.quantity()).toBe(1);
  });

  it('should display order summary', async () => {
    const { debugElement } = await setup();
    const orderSummaryDebugElement = debugElement.query(By.directive(CartOrderSummaryStub));
    expect(orderSummaryDebugElement).toBeTruthy();
    const orderSummary = orderSummaryDebugElement.componentInstance as CartOrderSummaryStub;
    expect(orderSummary.summary()).toEqual({
      subtotal: 50,
      tax: 2.5,
      total: 52.5
    });
  });

  it('should move all items from wishlist', async () => {
    const { getWishlistPreviewDebugElement, wishlistApiClientSpy, cartApiClientSpy } =
      await setup();
    const wishlistPreview = getWishlistPreviewDebugElement()
      .componentInstance as CartWishlistPreviewStub;

    wishlistPreview.allAdded.emit();

    expect(wishlistApiClientSpy.deleteAll).toHaveBeenCalled();
    expect(cartApiClientSpy.createMany).toHaveBeenCalledWith(['3', '4']);
  });

  it('should move item to wishlist and display snackbar on success', async () => {
    const { getProductRowDebugElements, cartApiClientSpy, wishlistApiClientSpy, snackbarSpy } =
      await setup();
    const productRow = getProductRowDebugElements()[0].componentInstance as CartProductRowStub;

    productRow.favorited.emit();

    expect(cartApiClientSpy.delete).toHaveBeenCalledWith('1');
    expect(wishlistApiClientSpy.create).toHaveBeenCalledWith('1');
    expect(snackbarSpy.showSuccess).toHaveBeenCalledWith('Product moved to wishlist');
  });

  it('should delete item and display snackbar on success', async () => {
    const { getProductRowDebugElements, cartApiClientSpy, snackbarSpy } = await setup();
    const productRow = getProductRowDebugElements()[0].componentInstance as CartProductRowStub;

    productRow.deleted.emit();

    expect(cartApiClientSpy.delete).toHaveBeenCalledWith('1');
    expect(snackbarSpy.showSuccess).toHaveBeenCalledWith('Product removed from cart');
  });
});
