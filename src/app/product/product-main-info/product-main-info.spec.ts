import { Component, input, output, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatIconHarness, MatIconTestingModule } from '@angular/material/icon/testing';
import { By } from '@angular/platform-browser';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { MatButtonHarness } from '@angular/material/button/testing';

import { createMockProduct, provideDisabledAnimations } from '../../testing-utils';
import { StarRating } from '../../star-rating/star-rating';
import { ToggleWishlistButton } from '../toggle-wishlist-button/toggle-wishlist-button';

import { ProductMainInfo } from './product-main-info';

@Component({
  template: `<app-product-main-info
    [product]="mockProduct()"
    (addedToCart)="addedToCart.set(true)"
    (toggledWishlist)="toggledWishlist.set(true)"
  />`,
  imports: [ProductMainInfo]
})
class ProductMainInfoTestHost {
  mockProduct = signal(createMockProduct());
  addedToCart = signal(false);
  toggledWishlist = signal(false);
}

@Component({
  selector: 'app-star-rating',
  template: '<ng-content />'
})
class StarRatingStub {
  rating = input.required<number>();
}

@Component({
  selector: 'app-toggle-wishlist-button',
  template: ''
})
class ToggleWishlistButtonStub {
  favorite = input.required<boolean>();
  toggled = output();
}

describe(ProductMainInfo.name, () => {
  const setup = async () => {
    TestBed.overrideComponent(ProductMainInfo, {
      remove: {
        imports: [StarRating, ToggleWishlistButton]
      },
      add: {
        imports: [StarRatingStub, ToggleWishlistButtonStub]
      }
    });
    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [provideZonelessChangeDetection(), provideDisabledAnimations()]
    });
    const fixture = TestBed.createComponent(ProductMainInfoTestHost);
    const component = fixture.componentInstance;
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    const mockProduct = component.mockProduct;

    const getToggleWishlistButtonDebugElement = () =>
      debugElement.query(By.directive(ToggleWishlistButtonStub));
    const getAddToCartButtonHarness = () =>
      loader.getHarness(
        MatButtonHarness.with({ selector: '[data-testid=product-add-to-cart-button]' })
      );

    return {
      fixture,
      component,
      debugElement,
      loader,
      mockProduct,
      getToggleWishlistButtonDebugElement,
      getAddToCartButtonHarness
    };
  };

  it('should display product category', async () => {
    const { debugElement, mockProduct } = await setup();
    const categoryDebugElement = debugElement.query(By.css('[data-testid=product-category]'));
    const formattedCategory = new TitleCasePipe().transform(mockProduct().category);

    expect(categoryDebugElement).toBeTruthy();
    expect(categoryDebugElement.nativeElement.textContent).toContain(formattedCategory);
  });

  it('should display product name', async () => {
    const { debugElement, mockProduct } = await setup();
    const nameDebugElement = debugElement.query(By.css('[data-testid=product-name]'));

    expect(nameDebugElement).toBeTruthy();
    expect(nameDebugElement.nativeElement.textContent).toContain(mockProduct().name);
  });

  it('should display star rating', async () => {
    const { debugElement, mockProduct } = await setup();
    const starRatingDebugElement = debugElement.query(By.directive(StarRatingStub));

    expect(starRatingDebugElement).toBeTruthy();
    expect((starRatingDebugElement.componentInstance as StarRatingStub).rating()).toBe(
      mockProduct().rating
    );
  });

  it('should display product price', async () => {
    const { debugElement, mockProduct } = await setup();
    const priceDebugElement = debugElement.query(By.css('[data-testid=product-price]'));
    const formattedPrice = new CurrencyPipe('en-US').transform(mockProduct().price);

    expect(priceDebugElement).toBeTruthy();
    expect(priceDebugElement.nativeElement.getAttribute('value')).toBe(`${mockProduct().price}`);
    expect(priceDebugElement.nativeElement.textContent).toContain(formattedPrice);
  });

  it('should display product description', async () => {
    const { debugElement, mockProduct } = await setup();

    const descriptionTitleDebugElement = debugElement.query(
      By.css('[data-testid=product-description-title]')
    );
    expect(descriptionTitleDebugElement).toBeTruthy();
    expect(descriptionTitleDebugElement.nativeElement.textContent).toContain('Description');

    const descriptionDebugElement = debugElement.query(By.css('[data-testid=product-description]'));
    expect(descriptionDebugElement).toBeTruthy();
    expect(descriptionDebugElement.nativeElement.textContent).toContain(mockProduct().description);
  });

  it('should display add-to-cart button', async () => {
    const { mockProduct, getAddToCartButtonHarness } = await setup();

    const buttonHarness = await getAddToCartButtonHarness();
    expect(await buttonHarness.isDisabled()).toBe(false);
    expect(await buttonHarness.getText()).toContain('Add to Cart');

    const iconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await iconHarness.getName()).toBe('shopping_cart');

    mockProduct.update((product) => ({ ...product, inStock: false }));

    expect(await buttonHarness.isDisabled()).toBe(true);
    expect(await buttonHarness.getText()).toContain('Out of Stock');
  });

  it('should display toggle-wishlist button', async () => {
    const { getToggleWishlistButtonDebugElement, mockProduct } = await setup();
    const buttonDebugElement = getToggleWishlistButtonDebugElement();

    expect(buttonDebugElement).toBeTruthy();
    expect((buttonDebugElement.componentInstance as ToggleWishlistButtonStub).favorite()).toBe(
      mockProduct().favorite
    );
  });

  it('should emit output event when clicking add-to-cart button', async () => {
    const { component, getAddToCartButtonHarness } = await setup();
    const buttonHarness = await getAddToCartButtonHarness();

    await buttonHarness.click();

    expect(component.addedToCart()).toBe(true);
  });

  it('should emit output event when clicking toggle-wishlist button', async () => {
    const { component, getToggleWishlistButtonDebugElement } = await setup();
    const buttonDebugElement = getToggleWishlistButtonDebugElement();
    const buttonComponent: ToggleWishlistButtonStub = buttonDebugElement.componentInstance;

    buttonComponent.toggled.emit();

    expect(component.toggledWishlist()).toBe(true);
  });
});
