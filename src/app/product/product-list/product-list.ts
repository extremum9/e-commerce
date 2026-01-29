import { ChangeDetectionStrategy, Component, inject, input, Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, filter, map, switchMap } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { ProductCard } from '../product-card/product-card';
import { ProductApiClient } from '../product-api-client';
import { CategoryApiClient } from '../category-api-client';
import { WishlistApiClient } from '../../wishlist/wishlist-api-client';
import { Product } from '../../models/product';

@Component({
  template: `
    <div class="px-5 md:px-8">
      <ul class="flex flex-wrap justify-center gap-3 mb-6">
        @for (cat of categories(); track cat) {
          <li>
            <a
              data-testid="category-link"
              [routerLink]="cat === 'all' ? ['/products'] : ['/products', cat]"
              [matButton]="cat === category() ? 'filled' : 'outlined'"
              [attr.aria-current]="cat === category() ? 'page' : null"
            >
              {{ cat | titlecase }}
            </a>
          </li>
        }
      </ul>

      @if (products(); as products) {
        <p data-testid="product-count" class="mb-6 text-base text-gray-600">
          {{ products.length }} products found
        </p>
        <ul class="fluid-grid">
          @for (product of products; track product.id) {
            <li>
              <app-product-card [product]="product" (toggledWishlist)="toggleWishlist(product)" />
            </li>
          }
        </ul>
      } @else {
        <div class="flex justify-center py-6">
          <mat-spinner data-testid="loading-product-list-spinner" [diameter]="50" />
        </div>
      }
    </div>
  `,
  imports: [ProductCard, MatButton, TitleCasePipe, RouterLink, MatProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductList {
  private readonly wishlistApiClient = inject(WishlistApiClient);

  protected readonly categories = signal(inject(CategoryApiClient).list());

  protected readonly category = input.required({
    transform: (value?: string) => value?.toLowerCase().trim() || 'all'
  });

  protected readonly products: Signal<Product[] | undefined>;

  constructor() {
    const productApiClient = inject(ProductApiClient);

    const products$ = toObservable(this.category).pipe(
      switchMap((cat) =>
        cat === 'all' ? productApiClient.list() : productApiClient.listByCategory(cat)
      )
    );
    const wishlistSet$ = toObservable(this.wishlistApiClient.wishlistSet).pipe(filter(Boolean));

    this.products = toSignal(
      combineLatest([products$, wishlistSet$]).pipe(
        map(([products, wishlistSet]) =>
          products.map((product) => ({ ...product, favorite: wishlistSet.has(product.id) }))
        )
      )
    );
  }

  protected toggleWishlist(product: Product): void {
    if (product.favorite) {
      this.wishlistApiClient.delete(product.id).subscribe();
    } else {
      this.wishlistApiClient.create(product.id).subscribe();
    }
  }
}
