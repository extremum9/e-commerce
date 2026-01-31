import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness, MatIconTestingModule } from '@angular/material/icon/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';

import { createMockProduct } from '../../testing-utils';

import { ProductCard } from './product-card';

@Component({
  template: `<app-product-card [product]="mockProduct()">test content</app-product-card>`,
  imports: [ProductCard]
})
class ProductCardTestHost {
  mockProduct = signal(createMockProduct());
}

describe(ProductCard.name, () => {
  const setup = async () => {
    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: MATERIAL_ANIMATIONS,
          useValue: { animationsDisabled: true }
        }
      ]
    });
    const fixture = TestBed.createComponent(ProductCardTestHost);
    const component = fixture.componentInstance;
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    const mockProduct = component.mockProduct;

    return { fixture, debugElement, loader, mockProduct };
  };

  it('should display product image', async () => {
    const { debugElement, mockProduct } = await setup();
    const image = debugElement.query(By.css('[data-testid=product-image]'));
    expect(image).withContext('image').toBeTruthy();
    const imageElement: HTMLImageElement = image.nativeElement;
    expect(imageElement.getAttribute('src')).withContext('image src').toBe(mockProduct().imageUrl);
    expect(imageElement.getAttribute('width')).withContext('image width').toBe('400');
    expect(imageElement.getAttribute('height')).withContext('image height').toBe('400');
    expect(imageElement.getAttribute('alt')).withContext('image alt text').toBe(mockProduct().name);
  });

  it('should display product name and description', async () => {
    const { debugElement, mockProduct } = await setup();

    const name = debugElement.query(By.css('[data-testid=product-name]'));
    expect(name).withContext('name').toBeTruthy();
    expect(name.nativeElement.textContent).withContext('name text').toContain(mockProduct().name);

    const description = debugElement.query(By.css('[data-testid=product-description]'));
    expect(description).withContext('description').toBeTruthy();
    expect(description.nativeElement.textContent)
      .withContext('description text')
      .toContain(mockProduct().description);
  });

  it('should display product availability', async () => {
    const { fixture, debugElement, mockProduct } = await setup();
    const availability = debugElement.query(By.css('[data-testid=product-availability]'));
    expect(availability).withContext('availability').toBeTruthy();
    const availabilityElement: HTMLElement = availability.nativeElement;
    expect(availabilityElement.textContent)
      .withContext('availability text (in stock)')
      .toContain('In Stock');
    expect(availabilityElement.classList)
      .withContext('availability (in stock)')
      .toContain('text-green-600');

    mockProduct.update((product) => ({ ...product, inStock: false }));
    await fixture.whenStable();

    expect(availability.nativeElement.textContent)
      .withContext('availability text (out of stock)')
      .toContain('Out of Stock');
    expect(availability.nativeElement.classList)
      .withContext('availability (out of stock)')
      .toContain('text-red-700');
  });

  it('should display product price and add-to-cart button', async () => {
    const { loader, debugElement, mockProduct } = await setup();

    const price = debugElement.query(By.css('[data-testid=product-price]'));
    expect(price).withContext('price').toBeTruthy();
    expect(price.nativeElement.textContent)
      .withContext('price text')
      .toContain(`$${mockProduct().price}`);

    const buttonHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=product-add-to-cart-button]' })
    );
    expect(await buttonHarness.getText())
      .withContext('add-to-cart button text')
      .toContain('Add to Cart');

    const iconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await iconHarness.getName())
      .withContext('add-to-cart button icon')
      .toBe('shopping_cart');
  });

  it('should project content', async () => {
    const { debugElement } = await setup();

    expect(debugElement.nativeElement.textContent).toContain('test content');
  });
});
