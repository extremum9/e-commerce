import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { ProductCard } from '../product-card/product-card';
import { ProductApiClient } from '../product-api-client';
import { CategoryApiClient } from '../category-api-client';

@Component({
  template: `
    <div class="p-5 md:p-8">
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
              <app-product-card [product]="product" />
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
  private readonly categoryApiClient = inject(CategoryApiClient);
  private readonly productApiClient = inject(ProductApiClient);

  protected readonly categories = signal(this.categoryApiClient.list());

  protected readonly category = input.required({
    transform: (value?: string) => value?.toLowerCase().trim() || 'all'
  });

  protected readonly products = toSignal(
    toObservable(this.category).pipe(
      switchMap((category) =>
        category === 'all'
          ? this.productApiClient.list()
          : this.productApiClient.listByCategory(category)
      )
    )
  );
}
