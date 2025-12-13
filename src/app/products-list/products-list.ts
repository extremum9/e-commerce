import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { PRODUCTS } from '../data/products';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-products-list',
  template: `
    <div class="p-5">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">{{ category() }}</h2>
      </div>

      <ul class="fluid-grid">
        @for (product of products(); track product.id) {
          <li>
            <app-product-card [product]="product" />
          </li>
        }
      </ul>
    </div>
  `,
  imports: [ProductCard],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductsList {
  protected readonly category = input<string>();

  protected readonly products = computed(() => {
    const category = this.category();

    return category === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === category);
  });
}
