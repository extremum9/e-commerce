import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, input, provideZonelessChangeDetection } from '@angular/core';
import { MatButtonHarness } from '@angular/material/button/testing';
import { By } from '@angular/platform-browser';

import { Product } from '../models/product';
import { ProductCard } from '../product-card/product-card';

import ProductsList from './products-list';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'app-product-card',
  template: `<h3>{{ product().name }}</h3>`
})
class ProductCardStub {
  public readonly product = input.required<Product>();
}

describe(ProductsList.name, () => {
  const setup = async () => {
    TestBed.overrideComponent(ProductsList, {
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
          [{ path: 'products/:category', component: ProductsList }],
          withComponentInputBinding()
        )
      ]
    });
    const harness = await RouterTestingHarness.create('/products/all');
    const debugElement = harness.routeDebugElement!;
    const loader = TestbedHarnessEnvironment.loader(harness.fixture);

    return { debugElement, loader };
  };

  it('should display categories', async () => {
    const { loader } = await setup();

    const categoryLinkHarnesses = await loader.getAllHarnesses(
      MatButtonHarness.with({ selector: '[data-testid=category-link]' })
    );
    expect(categoryLinkHarnesses.length).withContext('You should display 5 categories').toBe(5);

    const activeCategoryLinkHarness = categoryLinkHarnesses[0];
    expect(await activeCategoryLinkHarness.getAppearance())
      .withContext('The active category link should be filled')
      .toBe('filled');
    expect(await activeCategoryLinkHarness.getText())
      .withContext('The active category link should be `All`')
      .toBe('All');

    const activeCategoryLink = await activeCategoryLinkHarness.host();
    expect(await activeCategoryLink.getAttribute('href'))
      .withContext('The `href` attribute of the active category link is incorrect')
      .toBe('/products/all');
  });

  it('should display all products by default', async () => {
    const { debugElement } = await setup();
    const productNames = debugElement.queryAll(By.directive(ProductCardStub));
    expect(productNames.length)
      .withContext('You should have 20 `ProductCard` components displayed')
      .toBe(20);
    expect((productNames[0].componentInstance as ProductCardStub).product().name).toBe(
      'Noise-Cancelling Wireless Headphones'
    );
  });

  it('should filter products when clicking a category', async () => {
    const { debugElement, loader } = await setup();

    const clothingLinkHarness = await loader.getHarness(
      MatButtonHarness.with({ text: 'Clothing' })
    );
    await clothingLinkHarness.click();

    expect(await clothingLinkHarness.getAppearance())
      .withContext('The clicked category link should become filled')
      .toBe('filled');

    const router = TestBed.inject(Router);
    expect(router.url).toBe('/products/clothing');

    const productNames = debugElement.queryAll(By.directive(ProductCardStub));
    expect(productNames.length)
      .withContext('You should have 5 `ProductCard` components displayed')
      .toBe(5);
    expect((productNames[0].componentInstance as ProductCardStub).product().name).toBe(
      'Classic Cotton Crew Neck T-Shirt'
    );
  });
});
