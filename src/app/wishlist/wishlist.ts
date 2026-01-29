import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, of, switchMap } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { Product } from '../models/product';
import { ProductApiClient } from '../product/product-api-client';
import { ProductCard } from '../product/product-card/product-card';

import { WishlistApiClient } from './wishlist-api-client';
import { WishlistEmptyBlock } from './wishlist-empty-block/wishlist-empty-block';

@Component({
  template: `
    <div class="container">
      @if (products(); as products) {
        @if (products.length) {
          <div class="flex items-center justify-between gap-x-2 mb-6">
            <h1 class="text-2xl font-medium">My Wishlist</h1>
            <p class="text-xl text-gray-500">{{ products.length }} items</p>
          </div>

          <ul class="fluid-grid">
            @for (product of products; track product.id) {
              <li>
                <app-product-card [product]="product">
                  <button
                    class="absolute! top-3 right-3"
                    matMiniFab
                    type="button"
                    (click)="remove(product.id)"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </app-product-card>
              </li>
            }
          </ul>
        } @else {
          <app-wishlist-empty-block />
        }
      } @else {
        <div class="flex justify-center">
          <mat-spinner [diameter]="50" />
        </div>
      }
    </div>
  `,
  imports: [MatProgressSpinner, ProductCard, MatMiniFabButton, MatIcon, WishlistEmptyBlock],
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
