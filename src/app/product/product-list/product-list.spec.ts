import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, input, provideZonelessChangeDetection } from '@angular/core';
import { MatButtonHarness } from '@angular/material/button/testing';
import { By } from '@angular/platform-browser';
import { Observable, of, Subject } from 'rxjs';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';

import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';
import { productCategoryMatcher } from '../../utils';
import { ProductApiClient } from '../product-api-client';
import { createMockProduct } from '../../mocks';

import ProductList from './product-list';

type SetupConfig = {
  listReturn$?: Observable<Product[]>;
  listByCategoryReturn$?: Observable<Product[]>;
};

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'app-product-card',
  template: `<h3>{{ product().name }}</h3>`
})
class ProductCardStub {
  public readonly product = input.required<Product>();
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
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(
          [{ matcher: productCategoryMatcher, component: ProductList }],
          withComponentInputBinding()
        ),
        { provide: ProductApiClient, useValue: productApiClientSpy }
      ]
    });
    const harness = await RouterTestingHarness.create('/products');
    const debugElement = harness.routeDebugElement!;
    const loader = TestbedHarnessEnvironment.loader(harness.fixture);

    return { debugElement, loader, productApiClientSpy, mockProducts };
  };

  it('should display categories and highlight the active one', async () => {
    const { loader } = await setup();

    const categoryLinks = await loader.getAllHarnesses(
      MatButtonHarness.with({ selector: '[data-testid=category-link]' })
    );
    expect(categoryLinks.length).withContext('You should display 5 categories').toBe(5);

    const allLinkHarness = categoryLinks[0];
    expect(await allLinkHarness.getAppearance())
      .withContext('The active category link should be filled')
      .toBe('filled');
    expect(await allLinkHarness.getText())
      .withContext('The active category link should have a text`')
      .toBe('All');

    const allLink = await allLinkHarness.host();
    expect(await allLink.getAttribute('href'))
      .withContext('The `href` attribute of the active category link is incorrect')
      .toBe('/products');
    expect(await allLink.getAttribute('aria-current'))
      .withContext('The `aria-current` attribute of the active category link is incorrect')
      .toBe('page');

    const electronicsLinkHarness = await loader.getHarness(
      MatButtonHarness.with({ text: 'Electronics' })
    );
    await electronicsLinkHarness.click();

    expect(await electronicsLinkHarness.getAppearance())
      .withContext('The clicked category link should become filled')
      .toBe('filled');

    const electronicsLink = await electronicsLinkHarness.host();
    expect(await electronicsLink.getAttribute('aria-current'))
      .withContext('The `aria-current` attribute of the clicked category link is incorrect')
      .toBe('page');

    expect(await allLinkHarness.getAppearance())
      .withContext('Inactive category links should be outlined')
      .toBe('outlined');
    expect(await allLink.getAttribute('aria-current'))
      .withContext('Inactive category links should NOT have an `aria-current` attribute')
      .toBeNull();
  });

  it('should display a spinner when data is loading', async () => {
    const loadingSubject = new Subject<Product[]>();
    const { loader, mockProducts } = await setup({ listReturn$: loadingSubject });

    let spinner = await loader.hasHarness(MatProgressSpinnerHarness);
    expect(spinner).toBe(true);

    loadingSubject.next(mockProducts);

    spinner = await loader.hasHarness(MatProgressSpinnerHarness);
    expect(spinner).toBe(false);
  });

  it('should display all products by default when data is loaded', async () => {
    const { debugElement, mockProducts } = await setup();

    const productCount = debugElement.query(By.css('[data-testid=product-count]'));
    expect(productCount).withContext('The product count is missing').toBeTruthy();
    expect(productCount.nativeElement.textContent)
      .withContext('The product count is incorrect')
      .toContain(`${mockProducts.length} products found`);

    const productNames = debugElement.queryAll(By.directive(ProductCardStub));
    expect(productNames.length)
      .withContext('You should have 2 `ProductCard` components displayed')
      .toBe(2);
    expect((productNames[0].componentInstance as ProductCardStub).product().name).toBe(
      mockProducts[0].name
    );
  });

  it('should filter products when selecting a different category', async () => {
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
    expect(productNames.length)
      .withContext('You should have 2 `ProductCard` components displayed')
      .toBe(2);
    expect((productNames[0].componentInstance as ProductCardStub).product().name).toBe(
      mockProducts[0].name
    );
  });
});
