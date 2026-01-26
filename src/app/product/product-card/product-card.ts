import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { Product } from '../../models/product';
import { WishlistState } from '../../wishlist/wishlist-state';

@Component({
  selector: 'app-product-card',
  template: `
    <article
      data-testid="product-card"
      class="group flex flex-col relative h-full overflow-hidden rounded-xl bg-white shadow-lg transition-[translate,box-shadow] duration-200 ease-in-out hover:-translate-y-1 hover:shadow-xl"
    >
      <img
        data-testid="product-image"
        class="w-full object-cover aspect-square rounded-t-xl"
        [src]="product().imageUrl"
        width="400"
        height="400"
        [alt]="product().name"
      />

      <button
        class="absolute! top-3 right-3 transition-opacity duration-200! group-hover:opacity-100 focus:opacity-100"
        [class.text-red-500!]="inWishlist()"
        matMiniFab
        type="button"
        (click)="toggleWishlist(product().id)"
      >
        <mat-icon>{{ inWishlist() ? 'favorite' : 'favorite_border' }}</mat-icon>
      </button>

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
  imports: [MatButton, MatIcon, MatMiniFabButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCard {
  private readonly wishlistState = inject(WishlistState);

  public readonly product = input.required<Product>();
  public readonly toggledWishlist = output<{ productId: string; inWishlist: boolean }>();

  protected readonly inWishlist = computed(() =>
    this.wishlistState.wishlist().includes(this.product().id)
  );

  protected toggleWishlist(productId: string): void {
    this.toggledWishlist.emit({ productId, inWishlist: this.inWishlist() });
  }
}
