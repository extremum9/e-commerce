import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';

import { PRODUCTS } from '../data/products';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-products-list',
  template: `
    <div class="p-5 md:p-8">
      <ul class="flex flex-wrap justify-center gap-3 mb-6">
        @for (cat of categories(); track cat) {
          <li>
            <a
              [routerLink]="['/products', cat]"
              [matButton]="cat === category() ? 'filled' : 'outlined'"
            >
              {{ cat | titlecase }}
            </a>
          </li>
        }
      </ul>

      <ul class="fluid-grid">
        @for (product of products(); track product.id) {
          <li>
            <app-product-card [product]="product" />
          </li>
        }
      </ul>
    </div>
  `,
  imports: [ProductCard, MatButton, TitleCasePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductsList {
  protected readonly categories = signal(['all', 'electronics', 'clothing', 'accessories', 'home']);

  protected readonly category = input<string>();

  protected readonly products = computed(() => {
    const category = this.category()?.toLowerCase();

    return category === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === category);
  });
}
