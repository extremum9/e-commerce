import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';

import { createMockProduct } from '../../testing-utils';

import { ProductCard } from './product-card';

describe(ProductCard.name, () => {
  const setup = () => {
    const mockProduct = createMockProduct();

    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    const fixture = TestBed.createComponent(ProductCard);
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();

    return { fixture, debugElement, loader, mockProduct };
  };

  it('should display image', () => {
    const { debugElement, mockProduct } = setup();
    const image = debugElement.query(By.css('[data-testid=product-image]'));
    expect(image).withContext('Image element').toBeTruthy();
    const imageElement: HTMLImageElement = image.nativeElement;
    expect(imageElement.getAttribute('src')).withContext('Image src').toBe(mockProduct.imageUrl);
    expect(imageElement.getAttribute('width')).withContext('Image width').toBe('400');
    expect(imageElement.getAttribute('height')).withContext('Image height').toBe('400');
    expect(imageElement.getAttribute('alt')).withContext('Image alt text').toBe(mockProduct.name);
  });

  it('should display name and description', () => {
    const { debugElement, mockProduct } = setup();

    const name = debugElement.query(By.css('[data-testid=product-name]'));
    expect(name).withContext('Name element').toBeTruthy();
    expect(name.nativeElement.textContent).withContext('Name text').toContain(mockProduct.name);

    const description = debugElement.query(By.css('[data-testid=product-description]'));
    expect(description).withContext('Description element').toBeTruthy();
    expect(description.nativeElement.textContent)
      .withContext('Description text')
      .toContain(mockProduct.description);
  });

  it('should display availability', () => {
    const { fixture, debugElement, mockProduct } = setup();
    const availability = debugElement.query(By.css('[data-testid=product-availability]'));
    expect(availability).withContext('Availability element').toBeTruthy();
    const availabilityElement: HTMLElement = availability.nativeElement;
    expect(availabilityElement.textContent)
      .withContext('Availability text when in stock')
      .toContain('In Stock');
    expect(availabilityElement.classList)
      .withContext('Availability appearance when in stock')
      .toContain('text-green-600');

    fixture.componentRef.setInput('product', { ...mockProduct, inStock: false });
    fixture.detectChanges();

    expect(availability.nativeElement.textContent)
      .withContext('Availability text when out stock')
      .toContain('Out of Stock');
    expect(availability.nativeElement.classList)
      .withContext('Availability appearance when out of stock')
      .toContain('text-red-700');
  });

  it('should display price and add-to-cart button', async () => {
    const { loader, debugElement, mockProduct } = setup();

    const price = debugElement.query(By.css('[data-testid=product-price]'));
    expect(price).withContext('Price element').toBeTruthy();
    expect(price.nativeElement.textContent)
      .withContext('Price text')
      .toContain(`$${mockProduct.price}`);

    const buttonHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=product-add-to-cart-button]' })
    );
    expect(await buttonHarness.getText())
      .withContext('Add-to-cart button text')
      .toContain('Add to Cart');

    const iconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await iconHarness.getName())
      .withContext('Add-to-cart button icon')
      .toBe('shopping_cart');
  });
});
