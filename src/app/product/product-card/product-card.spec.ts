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
    const imageDebugElement = debugElement.query(By.css('[data-testid=product-image]'));
    expect(imageDebugElement).toBeTruthy();
    const imageElement: HTMLImageElement = imageDebugElement.nativeElement;
    expect(imageElement.getAttribute('src')).toBe(mockProduct().imageUrl);
    expect(imageElement.getAttribute('width')).toBe('400');
    expect(imageElement.getAttribute('height')).toBe('400');
    expect(imageElement.getAttribute('alt')).toBe(mockProduct().name);
  });

  it('should display product name and description', async () => {
    const { debugElement, mockProduct } = await setup();

    const nameDebugElement = debugElement.query(By.css('[data-testid=product-name]'));
    expect(nameDebugElement).toBeTruthy();
    expect(nameDebugElement.nativeElement.textContent).toContain(mockProduct().name);

    const descriptionDebugElement = debugElement.query(By.css('[data-testid=product-description]'));
    expect(descriptionDebugElement).toBeTruthy();
    expect(descriptionDebugElement.nativeElement.textContent).toContain(mockProduct().description);
  });

  it('should display product availability', async () => {
    const { fixture, debugElement, mockProduct } = await setup();
    const availabilityDebugElement = debugElement.query(
      By.css('[data-testid=product-availability]')
    );
    expect(availabilityDebugElement).toBeTruthy();
    const availabilityElement: HTMLElement = availabilityDebugElement.nativeElement;
    expect(availabilityElement.textContent).toContain('In Stock');
    expect(availabilityElement.classList).toContain('text-green-600');

    mockProduct.update((product) => ({ ...product, inStock: false }));
    await fixture.whenStable();

    expect(availabilityElement.textContent).toContain('Out of Stock');
    expect(availabilityElement.classList).toContain('text-red-700');
  });

  it('should display product price and add-to-cart button', async () => {
    const { loader, debugElement, mockProduct } = await setup();

    const priceDebugElement = debugElement.query(By.css('[data-testid=product-price]'));
    expect(priceDebugElement).toBeTruthy();
    expect(priceDebugElement.nativeElement.textContent).toContain(`$${mockProduct().price}`);

    const buttonHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=product-add-to-cart-button]' })
    );
    expect(await buttonHarness.getText()).toContain('Add to Cart');

    const iconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await iconHarness.getName()).toBe('shopping_cart');
  });

  it('should project content', async () => {
    const { debugElement } = await setup();

    expect(debugElement.nativeElement.textContent).toContain('test content');
  });
});
