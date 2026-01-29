import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, of, switchMap } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { Product } from '../models/product';
import { ProductApiClient } from '../product/product-api-client';
import { ProductCard } from '../product/product-card/product-card';

import { WishlistApiClient } from './wishlist-api-client';

@Component({
  template: `
    <div class="container">
      @if (products(); as products) {
        <ul class="fluid-grid">
          @for (product of products; track product.id) {
            <li>
              <app-product-card [product]="product" (toggledWishlist)="remove(product.id)" />
            </li>
          }
        </ul>
      } @else {
        <div class="flex justify-center">
          <mat-spinner [diameter]="50" />
        </div>
      }
    </div>
  `,
  imports: [MatProgressSpinner, ProductCard],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Wishlist {
  private readonly wishlistApiClient = inject(WishlistApiClient);

  protected readonly products: Signal<Product[] | undefined>;

  constructor() {
    const productApiClient = inject(ProductApiClient);

    this.products = toSignal(
      toObservable(this.wishlistApiClient.wishlistSet).pipe(
        filter(Boolean),
        switchMap((ids) => {
          if (!ids.size) {
            return of([]);
          }

          return productApiClient
            .listByIds([...ids])
            .pipe(map((products) => products.map((product) => ({ ...product, favorite: true }))));
        })
      )
    );
  }

  protected remove(productId: string): void {
    this.wishlistApiClient.delete(productId).subscribe();
  }
}
