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

  it('should display an image', () => {
    const { debugElement, mockProduct } = setup();
    const image = debugElement.query(By.css('[data-testid=product-image]'));
    expect(image).withContext('The image is missing').toBeTruthy();
    const imageElement: HTMLImageElement = image.nativeElement;
    expect(imageElement.getAttribute('src'))
      .withContext('The `src` attribute of the image is incorrect')
      .toBe(mockProduct.imageUrl);
    expect(imageElement.getAttribute('width'))
      .withContext('The `width` attribute of the image is incorrect')
      .toBe('400');
    expect(imageElement.getAttribute('height'))
      .withContext('The `height` attribute of the image is incorrect')
      .toBe('400');
    expect(imageElement.getAttribute('alt'))
      .withContext('The `alt` attribute of the image is incorrect')
      .toBe(mockProduct.name);
  });

  it('should display a name and description', () => {
    const { debugElement, mockProduct } = setup();

    const name = debugElement.query(By.css('[data-testid=product-name]'));
    expect(name).withContext('The name is missing').toBeTruthy();
    expect(name.nativeElement.textContent)
      .withContext('The name is incorrect')
      .toContain(mockProduct.name);

    const description = debugElement.query(By.css('[data-testid=product-description]'));
    expect(description).withContext('The description is missing').toBeTruthy();
    expect(description.nativeElement.textContent)
      .withContext('The description is incorrect')
      .toContain(mockProduct.description);
  });

  it('should display availability status', () => {
    const { fixture, debugElement, mockProduct } = setup();
    const availability = debugElement.query(By.css('[data-testid=product-availability]'));
    expect(availability).withContext('The availability status is missing').toBeTruthy();
    const availabilityElement: HTMLElement = availability.nativeElement;
    expect(availabilityElement.textContent)
      .withContext('The availability status is incorrect when the product is in stock')
      .toContain('In Stock');
    expect(availabilityElement.classList)
      .withContext('The availability status should be green when the product is in stock')
      .toContain('text-green-600');

    fixture.componentRef.setInput('product', { ...mockProduct, inStock: false });
    fixture.detectChanges();

    expect(availability.nativeElement.textContent)
      .withContext('The availability status is incorrect when the product out of stock')
      .toContain('Out of Stock');
    expect(availability.nativeElement.classList)
      .withContext('The availability status should be red when the product is out of stock')
      .toContain('text-red-700');
  });

  it('should display a price and an add-to-cart button', async () => {
    const { loader, debugElement, mockProduct } = setup();

    const price = debugElement.query(By.css('[data-testid=product-price]'));
    expect(price).withContext('The price is missing').toBeTruthy();
    expect(price.nativeElement.textContent)
      .withContext('The price is incorrect')
      .toContain(`$${mockProduct.price}`);

    const buttonHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=product-add-to-cart-button]' })
    );
    expect(await buttonHarness.getText())
      .withContext('The add-to-cart button should have a text')
      .toContain('Add to Cart');

    const iconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await iconHarness.getName())
      .withContext('The add-to-cart button should have an icon')
      .toBe('shopping_cart');
  });
});
