import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { Product } from '../../models/product';
import { ToggleWishlistButton } from '../toggle-wishlist-button/toggle-wishlist-button';
import { StarRating } from '../../star-rating/star-rating';

@Component({
  selector: 'app-product-main-info',
  template: `
    <span class="inline-block mb-2 px-2 py-1 text-xs rounded-xl bg-gray-100">{{
      product().category | titlecase
    }}</span>
    <h1 class="mb-3 text-2xl font-medium">{{ product().name }}</h1>
    <app-star-rating class="mb-3" [rating]="4.5">
      {{ product().rating }} ({{ product().reviewCount }} reviews)
    </app-star-rating>
    <data class="block mb-4 text-3xl font-medium" [value]="product().price"
      >{{ product().price | currency: 'USD' : 'symbol' : '1.0-2' }}
    </data>
    <h2 class="mb-2 font-medium">Description</h2>
    <p class="mb-4 text-gray-600">{{ product().description }}</p>

    <div class="flex gap-4 pb-4 border-b border-gray-200">
      <button
        class="w-2/3"
        matButton="filled"
        type="button"
        [disabled]="!product().inStock"
        (click)="addedToCart.emit()"
      >
        <mat-icon>shopping_cart</mat-icon>
        {{ product().inStock ? 'Add to Cart' : 'Out of Stock' }}
      </button>
      <app-toggle-wishlist-button
        [favorite]="product().favorite"
        (toggled)="toggledWishlist.emit()"
      />
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
  `,
  imports: [CurrencyPipe, MatButton, MatIcon, TitleCasePipe, ToggleWishlistButton, StarRating],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductMainInfo {
  public readonly product = input.required<Product>();

  public readonly addedToCart = output();
  public readonly toggledWishlist = output();
}
