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
import { ToggleWishlistButton } from '../toggle-wishlist-button/toggle-wishlist-button';
import { Snackbar } from '../../snackbar/snackbar';

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
              <app-product-card [product]="product">
                <app-toggle-wishlist-button
                  class="absolute! top-3 right-3"
                  [favorite]="product.favorite"
                  (toggled)="toggleWishlist(product)"
                />
              </app-product-card>
            </li>
          }
        </ul>
      } @else {
        <div class="flex justify-center">
          <mat-spinner data-testid="loading-product-list-spinner" [diameter]="50" />
        </div>
      }
    </div>
  `,
  imports: [
    ProductCard,
    MatButton,
    TitleCasePipe,
    RouterLink,
    MatProgressSpinner,
    ToggleWishlistButton
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductList {
  private readonly wishlistApiClient = inject(WishlistApiClient);
  private readonly snackbar = inject(Snackbar);

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
      this.wishlistApiClient
        .delete(product.id)
        .subscribe(() => this.snackbar.showSuccess('Product removed from wishlist'));
    } else {
      this.wishlistApiClient
        .create(product.id)
        .subscribe(() => this.snackbar.showSuccess('Product added to wishlist'));
    }
  }
}
