import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { switchMap } from 'rxjs';

import { ProductCard } from '../product-card/product-card';
import { ProductApiClient } from '../product-api-client';

export const CATEGORIES = ['all', 'electronics', 'clothing', 'accessories', 'home'] as const;

@Component({
  template: `
    <div class="p-5 md:p-8">
      <ul class="flex flex-wrap justify-center gap-3 mb-6">
        @for (cat of categories(); track cat) {
          <li>
            <a
              data-testid="category-link"
              [routerLink]="['/products', cat]"
              [matButton]="cat === category() ? 'filled' : 'outlined'"
            >
              {{ cat | titlecase }}
            </a>
          </li>
        }
      </ul>

      @if (products(); as products) {
        <ul class="fluid-grid">
          @for (product of products; track product.id) {
            <li>
              <app-product-card [product]="product" />
            </li>
          } @empty {
            <li>
              <p class="text-gray-500">No products found.</p>
            </li>
          }
        </ul>
      } @else {
        <div class="flex justify-center py-6">
          <mat-spinner [diameter]="50" />
        </div>
      }
    </div>
  `,
  imports: [ProductCard, MatButton, TitleCasePipe, RouterLink, MatProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductList {
  private readonly productApiClient = inject(ProductApiClient);

  protected readonly categories = signal(CATEGORIES);

  protected readonly category = input<string>();

  protected readonly products = toSignal(
    toObservable(this.category).pipe(
      switchMap((category) =>
        !category || category === 'all'
          ? this.productApiClient.list()
          : this.productApiClient.listByCategory(category)
      )
    )
  );
}
