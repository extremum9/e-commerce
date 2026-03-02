import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cart-empty-block',
  template: `
    <div class="surface-box flex flex-col items-center py-12! text-center sm:py-20!">
      <div class="flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-gray-100">
        <mat-icon class="scale-150 text-gray-400">shopping_cart</mat-icon>
      </div>
      <h2 data-testid="cart-empty-title" class="mb-3 text-2xl font-bold text-gray-900">
        Your cart is empty
      </h2>
      <p class="text-gray-600">Looks like you haven't added anything to your cart yet.</p>
    </div>
  `,
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartEmptyBlock {}
