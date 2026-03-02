import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { OrderSummary } from '../../models/order-summary';

@Component({
  selector: 'app-cart-order-summary',
  template: `
    <div class="surface-box">
      <h2 data-testid="cart-order-title" class="mb-4 text-2xl font-medium">Order Summary</h2>
      <div class="space-y-2 pb-4 border-b"></div>
      <div class="space-y-3 pt-4 text-lg">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span data-testid="cart-order-subtotal">{{ summary().subtotal | currency }}</span>
        </div>
        <div class="flex justify-between">
          <span>Tax</span>
          <span data-testid="cart-order-tax">{{ summary().tax | currency }}</span>
        </div>
        <div class="flex justify-between mt-3 pt-3 border-t text-lg font-bold">
          <span>Total</span>
          <span data-testid="cart-order-total">{{ summary().total | currency }}</span>
        </div>
      </div>
    </div>
  `,
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartOrderSummary {
  public readonly summary = input.required<OrderSummary>();
}
