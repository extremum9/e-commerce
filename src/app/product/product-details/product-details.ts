import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { combineLatest, map, switchMap } from 'rxjs';

import { BackButton } from '../../back-button/back-button';
import { ProductApiClient } from '../product-api-client';
import { ToggleWishlistButton } from '../toggle-wishlist-button/toggle-wishlist-button';
import { WishlistApiClient } from '../../wishlist/wishlist-api-client';

@Component({
  template: `
    <div class="container">
      <app-back-button class="mb-6" navigateTo="/products">Back to Products</app-back-button>
      @if (product(); as product) {
        <div class="flex items-start gap-8 mb-8">
          <img
            class="object-cover rounded-lg"
            [src]="product.imageUrl"
            width="500"
            height="550"
            [alt]="product.name"
          />

          <div class="flex-1">
            <span class="inline-block mb-2 px-2 py-1 text-xs rounded-xl bg-gray-100">{{
              product.category | titlecase
            }}</span>
            <h1 class="mb-3 text-2xl font-medium">{{ product.name }}</h1>
            <div>STAR RATING</div>
            <data class="mb-4 text-3xl font-medium" [value]="product.price">{{
              product.price | currency
            }}</data>
            <div>STOCK STATUS</div>
            <h2 class="mb-2 font-medium">Description</h2>
            <p class="pb-4 border-b border-gray-200 text-gray-600">{{ product.description }}</p>

            <div class="flex gap-4 py-4 border-b border-gray-200">
              <button
                class="w-2/3 flex items-center gap-2"
                matButton="filled"
                type="button"
                [disabled]="!product.inStock"
              >
                <mat-icon>shopping_cart</mat-icon>
                {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
              </button>
              <app-toggle-wishlist-button [favorite]="product.favorite" />
            </div>

            <div class="flex flex-col gap-2 pt-6 text-xs text-gray-700">
              <div class="flex items-center gap-3">
                <mat-icon class="small">local_shipping</mat-icon>
                <span>Free shipping on orders over $50</span>
              </div>
              <div class="flex items-center gap-3">
                <mat-icon class="small">autorenew</mat-icon>
                <span>30-day return policy</span>
              </div>
              <div class="flex items-center gap-3">
                <mat-icon class="small">shield</mat-icon>
                <span>2-year warranty included</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  imports: [BackButton, TitleCasePipe, CurrencyPipe, MatButton, MatIcon, ToggleWishlistButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductDetails {
  private readonly productApiClient = inject(ProductApiClient);
  private readonly wishlistApiClient = inject(WishlistApiClient);

  protected readonly id = input.required<string>();

  protected readonly product = toSignal(
    toObservable(this.id).pipe(
      switchMap(() =>
        combineLatest([this.productApiClient.get(this.id()), this.wishlistApiClient.wishlist$])
      ),
      map(([product, wishlist]) => ({ ...product, favorite: wishlist.has(product.id) }))
    )
  );
}
