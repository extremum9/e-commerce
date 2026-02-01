import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  Component,
  DebugElement,
  input,
  output,
  provideZonelessChangeDetection,
  signal
} from '@angular/core';
import { MatButtonHarness } from '@angular/material/button/testing';
import { By } from '@angular/platform-browser';
import { Observable, of, Subject } from 'rxjs';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';

import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';
import { productCategoryMatcher } from '../../utils';
import { ProductApiClient } from '../product-api-client';
import { createMockProduct } from '../../testing-utils';
import { WishlistApiClient } from '../../wishlist/wishlist-api-client';
import { ToggleWishlistButton } from '../toggle-wishlist-button/toggle-wishlist-button';

import ProductList from './product-list';

type SetupConfig = {
  listReturn$?: Observable<Product[]>;
  listByCategoryReturn$?: Observable<Product[]>;
};

@Component({
  selector: 'app-toggle-wishlist-button',
  template: ''
})
class ToggleWishlistButtonStub {
  favorite = input.required<boolean>();
  toggled = output();
}

@Component({
  selector: 'app-product-card',
  template: `
    <h3>{{ product().name }}</h3>
    <ng-content />
  `
})
class ProductCardStub {
  product = input.required<Product>();
}

describe(ProductList.name, () => {
  const setup = async (config: SetupConfig = {}) => {
    const mockProducts = [
      createMockProduct({ name: 'Product 1' }),
      createMockProduct({ id: '2', name: 'Product 2' })
    ];
    const productApiClientSpy = jasmine.createSpyObj<ProductApiClient>('ProductApiClient', [
      'list',
      'listByCategory'
    ]);
    productApiClientSpy.list.and.returnValue(config.listReturn$ ?? of(mockProducts));
    productApiClientSpy.listByCategory.and.returnValue(
      config.listByCategoryReturn$ ?? of(mockProducts)
    );

    const mockWishlistSet = signal(new Set(['2']));
    const wishlistApiClientSpy = jasmine.createSpyObj<WishlistApiClient>(
      'WishlistApiClient',
      ['create', 'delete'],
      {
        wishlistSet: mockWishlistSet
      }
    );
    wishlistApiClientSpy.create.and.returnValue(of(undefined));
    wishlistApiClientSpy.delete.and.returnValue(of(undefined));

    TestBed.overrideComponent(ProductList, {
      remove: {
        imports: [ProductCard, ToggleWishlistButton]
      },
      add: {
        imports: [ProductCardStub, ToggleWishlistButtonStub]
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
        {
          provide: MATERIAL_ANIMATIONS,
          useValue: { animationsDisabled: true }
        },
        { provide: ProductApiClient, useValue: productApiClientSpy },
        { provide: WishlistApiClient, useValue: wishlistApiClientSpy }
      ]
    });
    const harness = await RouterTestingHarness.create('/products');
    const debugElement = harness.routeDebugElement!;
    const loader = TestbedHarnessEnvironment.loader(harness.fixture);

    const hasSpinnerHarness = () => loader.hasHarness(MatProgressSpinnerHarness);
    const getProductCardDebugElements = () => debugElement.queryAll(By.directive(ProductCardStub));
    const getToggleWishlistButtonDebugElement = (productCard: DebugElement) =>
      productCard.query(By.directive(ToggleWishlistButtonStub));

    return {
      debugElement,
      loader,
      hasSpinnerHarness,
      getProductCardDebugElements,
      getToggleWishlistButtonDebugElement,
      productApiClientSpy,
      mockProducts,
      wishlistApiClientSpy
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

  it('should display spinner when data is loading', async () => {
    const loadingSubject = new Subject<Product[]>();
    const { hasSpinnerHarness, mockProducts } = await setup({ listReturn$: loadingSubject });

    expect(await hasSpinnerHarness()).toBe(true);

    loadingSubject.next(mockProducts);

    expect(await hasSpinnerHarness()).toBe(false);
  });

  it('should display all products by default when data is loaded', async () => {
    const {
      debugElement,
      getProductCardDebugElements,
      getToggleWishlistButtonDebugElement,
      mockProducts
    } = await setup();

    const productCountDebugElement = debugElement.query(By.css('[data-testid=product-count]'));
    expect(productCountDebugElement).toBeTruthy();
    expect(productCountDebugElement.nativeElement.textContent).toContain(
      `${mockProducts.length} products found`
    );

    const productCardDebugElements = getProductCardDebugElements();
    expect(productCardDebugElements.length).toBe(2);

    let productCardComponent: ProductCardStub = productCardDebugElements[0].componentInstance;
    expect(productCardComponent.product().name).toBe(mockProducts[0].name);
    expect(productCardComponent.product().favorite).toBe(false);

    let toggleWishlistButtonDebugElement = getToggleWishlistButtonDebugElement(
      productCardDebugElements[0]
    );
    expect(toggleWishlistButtonDebugElement).toBeTruthy();
    expect(
      (toggleWishlistButtonDebugElement.componentInstance as ToggleWishlistButtonStub).favorite()
    ).toBe(false);

    productCardComponent = productCardDebugElements[1].componentInstance;
    expect(productCardComponent.product().name).toBe(mockProducts[1].name);
    expect(productCardComponent.product().favorite).toBe(true);

    toggleWishlistButtonDebugElement = getToggleWishlistButtonDebugElement(
      productCardDebugElements[1]
    );
    expect(toggleWishlistButtonDebugElement).toBeTruthy();
    expect(
      (toggleWishlistButtonDebugElement.componentInstance as ToggleWishlistButtonStub).favorite()
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
    expect((productCardDebugElements[0].componentInstance as ProductCardStub).product().name).toBe(
      mockProducts[0].name
    );
  });

  it('should call WishlistApiClient.create if not in wishlist yet', async () => {
    const {
      getProductCardDebugElements,
      getToggleWishlistButtonDebugElement,
      mockProducts,
      wishlistApiClientSpy
    } = await setup();

    const productCardDebugElement = getProductCardDebugElements()[0];
    const toggleWishlistButtonComponent: ToggleWishlistButtonStub =
      getToggleWishlistButtonDebugElement(productCardDebugElement).componentInstance;

    toggleWishlistButtonComponent.toggled.emit();

    expect(wishlistApiClientSpy.create).toHaveBeenCalledOnceWith(mockProducts[0].id);
  });

  it('should call WishlistApiClient.delete if already in wishlist', async () => {
    const {
      getProductCardDebugElements,
      getToggleWishlistButtonDebugElement,
      mockProducts,
      wishlistApiClientSpy
    } = await setup();

    const productCardDebugElement = getProductCardDebugElements()[1];
    const toggleWishlistButtonComponent: ToggleWishlistButtonStub =
      getToggleWishlistButtonDebugElement(productCardDebugElement).componentInstance;

    toggleWishlistButtonComponent.toggled.emit();

    expect(wishlistApiClientSpy.delete).toHaveBeenCalledOnceWith(mockProducts[1].id);
  });
});
