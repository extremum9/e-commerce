import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';

import { createMockOrderSummary, provideDisabledAnimations } from '../../testing-utils';

import { CartOrderSummary } from './cart-order-summary';

describe(CartOrderSummary.name, () => {
  const setup = async () => {
    const mockOrderSummary = createMockOrderSummary();

    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideDisabledAnimations()]
    });
    const fixture = TestBed.createComponent(CartOrderSummary);
    const debugElement = fixture.debugElement;
    fixture.componentRef.setInput('summary', mockOrderSummary);
    await fixture.whenStable();

    const currencyPipe = new CurrencyPipe('en-US');

    return { debugElement, currencyPipe, mockOrderSummary };
  };

  it('should display title', async () => {
    const { debugElement } = await setup();
    const titleDebugElement = debugElement.query(By.css('[data-testid=cart-order-title]'));

    expect(titleDebugElement).toBeTruthy();
    expect(titleDebugElement.nativeElement.textContent).toContain('Order Summary');
  });

  it('should display subtotal', async () => {
    const { debugElement, currencyPipe, mockOrderSummary } = await setup();
    const formattedSubtotal = currencyPipe.transform(mockOrderSummary.subtotal);
    const subtotalDebugElement = debugElement.query(By.css('[data-testid=cart-order-subtotal]'));

    expect(subtotalDebugElement).toBeTruthy();
    expect(subtotalDebugElement.nativeElement.textContent).toContain(formattedSubtotal);
  });

  it('should display tax', async () => {
    const { debugElement, currencyPipe, mockOrderSummary } = await setup();
    const formattedTax = currencyPipe.transform(mockOrderSummary.tax);
    const taxDebugElement = debugElement.query(By.css('[data-testid=cart-order-tax]'));

    expect(taxDebugElement).toBeTruthy();
    expect(taxDebugElement.nativeElement.textContent).toContain(formattedTax);
  });

  it('should display total', async () => {
    const { debugElement, currencyPipe, mockOrderSummary } = await setup();
    const formattedTotal = currencyPipe.transform(mockOrderSummary.total);
    const totalDebugElement = debugElement.query(By.css('[data-testid=cart-order-total]'));

    expect(totalDebugElement).toBeTruthy();
    expect(totalDebugElement.nativeElement.textContent).toContain(formattedTotal);
  });
});
