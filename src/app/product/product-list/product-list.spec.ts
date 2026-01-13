import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, input, provideZonelessChangeDetection } from '@angular/core';
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

import ProductList from './product-list';

type SetupConfig = {
  listReturn$?: Observable<Product[]>;
  listByCategoryReturn$?: Observable<Product[]>;
};

@Component({
  selector: 'app-product-card',
  template: `<h3>{{ product().name }}</h3>`
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
        {
          provide: MATERIAL_ANIMATIONS,
          useValue: { animationsDisabled: true }
        },
        { provide: ProductApiClient, useValue: productApiClientSpy }
      ]
    });
    const harness = await RouterTestingHarness.create('/products');
    const debugElement = harness.routeDebugElement!;
    const loader = TestbedHarnessEnvironment.loader(harness.fixture);

    return { debugElement, loader, productApiClientSpy, mockProducts };
  };

  it('should display categories and highlight active one', async () => {
    const { loader } = await setup();

    const categoryLinks = await loader.getAllHarnesses(
      MatButtonHarness.with({ selector: '[data-testid=category-link]' })
    );
    expect(categoryLinks.length).withContext('category links').toBe(5);

    const allLinkHarness = categoryLinks[0];
    expect(await allLinkHarness.getAppearance())
      .withContext('active category link')
      .toBe('filled');
    expect(await allLinkHarness.getText())
      .withContext('active category link text')
      .toBe('All');

    const allLink = await allLinkHarness.host();
    expect(await allLink.getAttribute('href'))
      .withContext('active category link href')
      .toBe('/products');
    expect(await allLink.getAttribute('aria-current'))
      .withContext('active category link aria-current')
      .toBe('page');

    const electronicsLinkHarness = await loader.getHarness(
      MatButtonHarness.with({ text: 'Electronics' })
    );
    await electronicsLinkHarness.click();

    expect(await electronicsLinkHarness.getAppearance())
      .withContext('category link (clicked)')
      .toBe('filled');

    const electronicsLink = await electronicsLinkHarness.host();
    expect(await electronicsLink.getAttribute('aria-current'))
      .withContext('category link aria-current (clicked)')
      .toBe('page');

    expect(await allLinkHarness.getAppearance())
      .withContext('inactive category link')
      .toBe('outlined');
    expect(await allLink.getAttribute('aria-current'))
      .withContext('inactive category link aria-current')
      .toBeNull();
  });

  it('should display spinner when data is loading', async () => {
    const loadingSubject = new Subject<Product[]>();
    const { loader, mockProducts } = await setup({ listReturn$: loadingSubject });

    let spinner = await loader.hasHarness(MatProgressSpinnerHarness);
    expect(spinner).withContext('spinner (loading)').toBe(true);

    loadingSubject.next(mockProducts);

    spinner = await loader.hasHarness(MatProgressSpinnerHarness);
    expect(spinner).withContext('spinner (loaded)').toBe(false);
  });

  it('should display all products by default when data is loaded', async () => {
    const { debugElement, mockProducts } = await setup();

    const productCount = debugElement.query(By.css('[data-testid=product-count]'));
    expect(productCount).withContext('product count').toBeTruthy();
    expect(productCount.nativeElement.textContent)
      .withContext('product count text')
      .toContain(`${mockProducts.length} products found`);

    const productNames = debugElement.queryAll(By.directive(ProductCardStub));
    expect(productNames.length).withContext('product names').toBe(2);
    expect((productNames[0].componentInstance as ProductCardStub).product().name).toBe(
      mockProducts[0].name
    );
  });

  it('should filter products when selecting different category', async () => {
    const mockProducts = [
      createMockProduct({ name: 'Filtered product 1' }),
      createMockProduct({ id: '2', name: 'Filtered product 2' })
    ];
    const { debugElement, loader, productApiClientSpy } = await setup({
      listByCategoryReturn$: of(mockProducts)
    });

    const clothingLinkHarness = await loader.getHarness(
      MatButtonHarness.with({ text: 'Clothing' })
    );
    await clothingLinkHarness.click();

    expect(productApiClientSpy.listByCategory).toHaveBeenCalledOnceWith('clothing');

    const router = TestBed.inject(Router);
    expect(router.url).toBe('/products/clothing');

    const productNames = debugElement.queryAll(By.directive(ProductCardStub));
    expect(productNames.length).withContext('product names').toBe(2);
    expect((productNames[0].componentInstance as ProductCardStub).product().name).toBe(
      mockProducts[0].name
    );
  });
});
