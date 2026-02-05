import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, input, provideZonelessChangeDetection, signal } from '@angular/core';
import { MatButtonHarness } from '@angular/material/button/testing';
import { By } from '@angular/platform-browser';
import { Observable, of, Subject } from 'rxjs';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';
import { productCategoryMatcher } from '../../utils';
import { ProductApiClient } from '../product-api-client';
import { createMockProduct, provideDisabledAnimations } from '../../testing-utils';
import { WishlistApiClient } from '../../wishlist/wishlist-api-client';
import { ToggleWishlistButton } from '../toggle-wishlist-button/toggle-wishlist-button';
import { Snackbar } from '../../snackbar/snackbar';

import ProductList from './product-list';

type SetupConfig = {
  listReturn$: Observable<Product[]>;
  listByCategoryReturn$: Observable<Product[]>;
};

@Component({
  selector: 'app-product-card',
  template: `<ng-content />`
})
class ProductCardStub {
  product = input.required<Product>();
}

describe(ProductList.name, () => {
  const setup = async (config: Partial<SetupConfig> = {}) => {
    const mockProducts = [
      createMockProduct({ name: 'Product 1' }),
      createMockProduct({ id: '2', name: 'Product 2' })
    ];

    const { listReturn$, listByCategoryReturn$ }: SetupConfig = {
      listReturn$: of(mockProducts),
      listByCategoryReturn$: of(mockProducts),
      ...config
    };

    const productApiClientSpy = jasmine.createSpyObj<ProductApiClient>('ProductApiClient', [
      'list',
      'listByCategory'
    ]);
    productApiClientSpy.list.and.returnValue(listReturn$);
    productApiClientSpy.listByCategory.and.returnValue(listByCategoryReturn$);

    const wishlistSet = signal(new Set(['2']));
    const wishlistApiClientSpy = jasmine.createSpyObj<WishlistApiClient>(
      'WishlistApiClient',
      ['create', 'delete'],
      {
        wishlistSet
      }
    );
    wishlistApiClientSpy.create.and.returnValue(of(undefined));
    wishlistApiClientSpy.delete.and.returnValue(of(undefined));

    const snackbarSpy = jasmine.createSpyObj<Snackbar>('Snackbar', ['showSuccess']);

    TestBed.overrideComponent(ProductList, {
      remove: {
        imports: [ProductCard]
      },
      add: {
        imports: [ProductCardStub]
      }
    });
    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(
          [{ matcher: productCategoryMatcher, component: ProductList }],
          withComponentInputBinding()
        ),
        provideDisabledAnimations(),
        { provide: ProductApiClient, useValue: productApiClientSpy },
        { provide: WishlistApiClient, useValue: wishlistApiClientSpy },
        { provide: Snackbar, useValue: snackbarSpy }
      ]
    });
    const harness = await RouterTestingHarness.create('/products');
    const debugElement = harness.routeDebugElement!;
    const loader = TestbedHarnessEnvironment.loader(harness.fixture);

    const hasSpinnerHarness = () =>
      loader.hasHarness(
        MatProgressSpinnerHarness.with({ selector: '[data-testid=loading-product-list-spinner]' })
      );
    const getProductCardDebugElements = () => debugElement.queryAll(By.directive(ProductCardStub));
    const getToggleWishlistButtonDebugElements = () =>
      debugElement.queryAll(By.directive(ToggleWishlistButton));

    return {
      debugElement,
      loader,
      hasSpinnerHarness,
      getProductCardDebugElements,
      getToggleWishlistButtonDebugElements,
      productApiClientSpy,
      mockProducts,
      wishlistApiClientSpy,
      snackbarSpy
    };
  };

  it('should display categories and highlight active one', async () => {
    const { loader } = await setup();

    const categoryLinkHarnesses = await loader.getAllHarnesses(
      MatButtonHarness.with({ selector: '[data-testid=category-link]' })
    );
    expect(categoryLinkHarnesses.length).toBe(5);

    const allLinkHarness = categoryLinkHarnesses[0];
    expect(await allLinkHarness.getAppearance()).toBe('filled');
    expect(await allLinkHarness.getText()).toBe('All');

    const allLinkHost = await allLinkHarness.host();
    expect(await allLinkHost.getAttribute('href')).toBe('/products');
    expect(await allLinkHost.getAttribute('aria-current')).toBe('page');

    const electronicsLinkHarness = await loader.getHarness(
      MatButtonHarness.with({ text: 'Electronics' })
    );
    await electronicsLinkHarness.click();

    expect(await electronicsLinkHarness.getAppearance()).toBe('filled');

    const electronicsLinkHost = await electronicsLinkHarness.host();
    expect(await electronicsLinkHost.getAttribute('aria-current')).toBe('page');

    expect(await allLinkHarness.getAppearance()).toBe('outlined');
    expect(await allLinkHost.getAttribute('aria-current')).toBeNull();
  });

  describe('Loading state', () => {
    it('should display spinner', async () => {
      const products$ = new Subject<Product[]>();
      const { hasSpinnerHarness, mockProducts } = await setup({ listReturn$: products$ });

      expect(await hasSpinnerHarness()).toBe(true);
      products$.next(mockProducts);
      expect(await hasSpinnerHarness()).toBe(false);
    });
  });

  describe('Loaded state', () => {
    it('should display all product cards by default with toggle-wishlist buttons', async () => {
      const {
        debugElement,
        getProductCardDebugElements,
        getToggleWishlistButtonDebugElements,
        mockProducts
      } = await setup();

      const productCountDebugElement = debugElement.query(By.css('[data-testid=product-count]'));
      expect(productCountDebugElement).toBeTruthy();
      expect(productCountDebugElement.nativeElement.textContent).toContain('2 products found');

      const productCardDebugElements = getProductCardDebugElements();
      expect(productCardDebugElements.length).toBe(2);

      let productCardComponent: ProductCardStub = productCardDebugElements[0].componentInstance;
      expect(productCardComponent.product().name).toBe(mockProducts[0].name);
      expect(productCardComponent.product().favorite).toBe(false);
      productCardComponent = productCardDebugElements[1].componentInstance;
      expect(productCardComponent.product().name).toBe(mockProducts[1].name);
      expect(productCardComponent.product().favorite).toBe(true);

      const toggleWishlistButtonDebugElements = getToggleWishlistButtonDebugElements();
      expect(toggleWishlistButtonDebugElements.length).toBe(2);
      expect(toggleWishlistButtonDebugElements[0]).toBeTruthy();
      expect(
        (toggleWishlistButtonDebugElements[0].componentInstance as ToggleWishlistButton).favorite()
      ).toBe(false);
      expect(
        (toggleWishlistButtonDebugElements[1].componentInstance as ToggleWishlistButton).favorite()
      ).toBe(true);
    });

    it('should filter products when selecting different category', async () => {
      const mockProducts = [
        createMockProduct({ name: 'Filtered product 1' }),
        createMockProduct({ id: '2', name: 'Filtered product 2' })
      ];
      const { loader, getProductCardDebugElements, productApiClientSpy } = await setup({
        listByCategoryReturn$: of(mockProducts)
      });

      const clothingLinkHarness = await loader.getHarness(
        MatButtonHarness.with({ text: 'Clothing' })
      );
      await clothingLinkHarness.click();

      expect(productApiClientSpy.listByCategory).toHaveBeenCalledOnceWith('clothing');

      const router = TestBed.inject(Router);
      expect(router.url).toBe('/products/clothing');

      const productCardDebugElements = getProductCardDebugElements();
      expect(productCardDebugElements.length).toBe(2);
      expect(
        (productCardDebugElements[0].componentInstance as ProductCardStub).product().name
      ).toBe(mockProducts[0].name);
    });

    it('should call WishlistApiClient.create if not in wishlist yet, and display success snackbar on success', async () => {
      const {
        getToggleWishlistButtonDebugElements,
        mockProducts,
        wishlistApiClientSpy,
        snackbarSpy
      } = await setup();

      const toggleWishlistButtonComponent: ToggleWishlistButton =
        getToggleWishlistButtonDebugElements()[0].componentInstance;

      toggleWishlistButtonComponent.toggled.emit();

      expect(wishlistApiClientSpy.create).toHaveBeenCalledOnceWith(mockProducts[0].id);
      expect(snackbarSpy.showSuccess).toHaveBeenCalledOnceWith('Product added to wishlist');
    });

    it('should call WishlistApiClient.delete if already in wishlist, and display success snackbar on success', async () => {
      const {
        getToggleWishlistButtonDebugElements,
        mockProducts,
        wishlistApiClientSpy,
        snackbarSpy
      } = await setup();

      const toggleWishlistButtonComponent: ToggleWishlistButton =
        getToggleWishlistButtonDebugElements()[1].componentInstance;

      toggleWishlistButtonComponent.toggled.emit();

      expect(wishlistApiClientSpy.delete).toHaveBeenCalledOnceWith(mockProducts[1].id);
      expect(snackbarSpy.showSuccess).toHaveBeenCalledOnceWith('Product removed from wishlist');
    });
  });
});
