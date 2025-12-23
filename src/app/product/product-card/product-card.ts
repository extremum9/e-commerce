import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  template: `
    <article
      data-testid="product-card"
      class="flex flex-col h-full overflow-hidden rounded-xl bg-white shadow-lg transition-[translate,box-shadow] duration-200 ease-in-out hover:-translate-y-1 hover:shadow-xl"
    >
      <img
        data-testid="product-image"
        class="w-full object-cover aspect-square rounded-t-xl"
        [src]="product().imageUrl"
        width="400"
        height="400"
        [alt]="product().name"
      />
      <div class="flex flex-col flex-1 p-5">
        <h3 data-testid="product-name" class="mb-2 leading-tight text-lg font-medium text-gray-900">
          {{ product().name }}
        </h3>
        <p
          data-testid="product-description"
          class="flex-1 mb-4 leading-relaxed text-sm text-gray-600"
        >
          {{ product().description }}
        </p>
        <span
          data-testid="product-availability"
          class="mb-4 text-sm font-medium"
          [class.text-green-600]="product().inStock"
          [class.text-red-700]="!product().inStock"
          >{{ product().inStock ? 'In Stock' : 'Out of Stock' }}</span
        >
        <div class="flex items-center justify-between gap-2">
          <span data-testid="product-price" class="text-2xl font-bold break-all text-gray-900"
            >\${{ product().price }}</span
          >
          <button data-testid="product-add-to-cart-button" matButton="filled" class="shrink-0">
            <mat-icon>shopping_cart</mat-icon>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  `,
  imports: [MatButton, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCard {
  public readonly product = input.required<Product>();
}
