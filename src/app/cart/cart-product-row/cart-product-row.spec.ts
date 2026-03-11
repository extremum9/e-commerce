import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness, MatIconTestingModule } from '@angular/material/icon/testing';

import { createMockProduct, provideDisabledAnimations } from '../../testing-utils';

import { CartProductRow } from './cart-product-row';

@Component({
  selector: 'app-cart-quantity',
  template: ''
})
class CartQuantityStub {}

@Component({
  template: `
    <app-cart-product-row
      [product]="mockProduct()"
      (movedToWishlist)="movedToWishlist.set(true)"
      (deleted)="deleted.set(true)"
    >
      <app-cart-quantity />
    </app-cart-product-row>
  `,
  imports: [CartProductRow, CartQuantityStub]
})
class CartProductRowTestHost {
  mockProduct = signal({ ...createMockProduct(), quantity: 2 });
  movedToWishlist = signal(false);
  deleted = signal(false);
}

describe(CartProductRow.name, () => {
  const setup = async () => {
    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [provideZonelessChangeDetection(), provideDisabledAnimations()]
    });
    const fixture = TestBed.createComponent(CartProductRowTestHost);
    const component = fixture.componentInstance;
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    const mockProduct = component.mockProduct;

    const currencyPipe = new CurrencyPipe('en-US');

    const getMoveToWishlistButtonHarness = () =>
      loader.getHarness(
        MatButtonHarness.with({ selector: '[data-testid=cart-product-move-to-wishlist-button]' })
      );
    const getDeleteButtonHarness = () =>
      loader.getHarness(
        MatButtonHarness.with({ selector: '[data-testid=cart-product-delete-button]' })
      );

    return {
      component,
      debugElement,
      loader,
      currencyPipe,
      mockProduct,
      getMoveToWishlistButtonHarness,
      getDeleteButtonHarness
    };
  };

  it('should display product image, name and price', async () => {
    const { debugElement, currencyPipe, mockProduct } = await setup();

    const imageDebugElement = debugElement.query(By.css('[data-testid=cart-product-image]'));
    expect(imageDebugElement).toBeTruthy();
    const imageElement = imageDebugElement.nativeElement;
    expect(imageElement.getAttribute('src')).toBe(mockProduct().imageUrl);
    expect(imageElement.getAttribute('width')).toBe('24');
    expect(imageElement.getAttribute('height')).toBe('24');
    expect(imageElement.getAttribute('alt')).toBe(mockProduct().name);

    const nameDebugElement = debugElement.query(By.css('[data-testid=cart-product-name]'));
    expect(nameDebugElement).toBeTruthy();
    expect(nameDebugElement.nativeElement.textContent).toContain(mockProduct().name);

    const priceDebugElement = debugElement.query(By.css('[data-testid=cart-product-price]'));
    expect(priceDebugElement).toBeTruthy();
    expect(priceDebugElement.nativeElement.getAttribute('value')).toBe(`${mockProduct().price}`);
    expect(priceDebugElement.nativeElement.textContent).toContain(
      currencyPipe.transform(mockProduct().price, 'USD', 'symbol', '1.0-2')
    );
  });

  it('should display product total', async () => {
    const { debugElement, currencyPipe, mockProduct } = await setup();
    const total = mockProduct().price * mockProduct().quantity;
    const totalDebugElement = debugElement.query(By.css('[data-testid=cart-product-total]'));

    expect(totalDebugElement).toBeTruthy();
    expect(totalDebugElement.nativeElement.getAttribute('value')).toBe(`${total}`);
    expect(totalDebugElement.nativeElement.textContent).toContain(currencyPipe.transform(total));
  });

  it('should project content', async () => {
    const { debugElement } = await setup();

    expect(debugElement.query(By.directive(CartQuantityStub))).toBeTruthy();
  });

  it('should display move-to-wishlist button and emit output event on click', async () => {
    const { component, getMoveToWishlistButtonHarness } = await setup();
    const buttonHarness = await getMoveToWishlistButtonHarness();
    const buttonIconHarness = await buttonHarness.getHarness(MatIconHarness);

    expect(await buttonIconHarness.getName()).toBe('favorite_border');

    await buttonHarness.click();

    expect(component.movedToWishlist()).toBe(true);
  });

  it('should display delete button and emit output event on click', async () => {
    const { component, getDeleteButtonHarness } = await setup();
    const buttonHarness = await getDeleteButtonHarness();
    const buttonIconHarness = await buttonHarness.getHarness(MatIconHarness);

    expect(await buttonIconHarness.getName()).toBe('delete');

    await buttonHarness.click();

    expect(component.deleted()).toBe(true);
  });
});
