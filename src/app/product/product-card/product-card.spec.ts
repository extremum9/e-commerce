import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';

import { ProductCard } from './product-card';

describe(ProductCard.name, () => {
  const setup = () => {
    const fakeProduct = {
      id: '1',
      name: 'Noise-Cancelling Wireless Headphones',
      description:
        'Experience immersive sound with active noise cancellation and 30-hour battery life.',
      category: 'electronics',
      price: 249.99,
      imageUrl: 'https://placehold.co/600x400/png?text=Headphones',
      rating: 4.8,
      reviewCount: 12,
      inStock: true,
      favorite: false
    };

    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    const fixture = TestBed.createComponent(ProductCard);
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.componentRef.setInput('product', fakeProduct);
    fixture.detectChanges();

    return { fixture, debugElement, loader, fakeProduct };
  };

  it('should display an image', () => {
    const { debugElement, fakeProduct } = setup();
    const image = debugElement.query(By.css('[data-testid=product-image]'));
    expect(image).withContext('No image for the product').toBeTruthy();
    const imageElement: HTMLImageElement = image.nativeElement;
    expect(imageElement.getAttribute('src'))
      .withContext('The `src` attribute of the image is incorrect')
      .toBe(fakeProduct.imageUrl);
    expect(imageElement.getAttribute('width'))
      .withContext('The `width` attribute of the image is incorrect')
      .toBe('400');
    expect(imageElement.getAttribute('height'))
      .withContext('The `height` attribute of the image is incorrect')
      .toBe('400');
    expect(imageElement.getAttribute('alt'))
      .withContext('The `alt` attribute of the image is incorrect')
      .toBe(fakeProduct.name);
  });

  it('should display a name and description', () => {
    const { debugElement, fakeProduct } = setup();

    const name = debugElement.query(By.css('[data-testid=product-name]'));
    expect(name).withContext('No name for the product').toBeTruthy();
    expect(name.nativeElement.textContent)
      .withContext('The name of the product is incorrect')
      .toContain(fakeProduct.name);

    const description = debugElement.query(By.css('[data-testid=product-description]'));
    expect(description).withContext('No description for the product').toBeTruthy();
    expect(description.nativeElement.textContent)
      .withContext('The description of the product is incorrect')
      .toContain(fakeProduct.description);
  });

  it('should display availability status', () => {
    const { fixture, debugElement, fakeProduct } = setup();
    const availability = debugElement.query(By.css('[data-testid=product-availability]'));
    expect(availability).withContext('No availability status for the product').toBeTruthy();
    const availabilityElement: HTMLElement = availability.nativeElement;
    expect(availabilityElement.textContent)
      .withContext('The text of the availability status is incorrect when in stock')
      .toContain('In Stock');
    expect(availabilityElement.classList)
      .withContext('The availability status should appear green when in stock')
      .toContain('text-green-600');

    fixture.componentRef.setInput('product', { ...fakeProduct, inStock: false });
    fixture.detectChanges();

    expect(availability.nativeElement.textContent)
      .withContext('The text of the availability status is incorrect when out of stock')
      .toContain('Out of Stock');
    expect(availability.nativeElement.classList)
      .withContext('The availability status should appear red when out of stock')
      .toContain('text-red-700');
  });

  it('should display a price and an add-to-cart button', async () => {
    const { loader, debugElement, fakeProduct } = setup();

    const price = debugElement.query(By.css('[data-testid=product-price]'));
    expect(price).withContext('No price for the product').toBeTruthy();
    expect(price.nativeElement.textContent)
      .withContext('The price of the product is incorrect')
      .toContain(`$${fakeProduct.price}`);

    const buttonHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=product-add-to-cart-button]' })
    );
    expect(await buttonHarness.getText())
      .withContext('The text of the add-to-cart button is incorrect')
      .toContain('Add to Cart');

    const iconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await iconHarness.getName())
      .withContext('The add-to-cart button should have an icon')
      .toBe('shopping_cart');
  });
});
