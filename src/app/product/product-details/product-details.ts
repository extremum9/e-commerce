import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, switchMap } from 'rxjs';

import { BackButton } from '../../back-button/back-button';
import { ProductApiClient } from '../product-api-client';
import { WishlistApiClient } from '../../wishlist/wishlist-api-client';
import { ProductMainInfo } from '../product-main-info/product-main-info';
import { Product } from '../../models/product';
import { Snackbar } from '../../snackbar/snackbar';
import { CartApiClient } from '../../cart/cart-api-client';
import { CategoryApiClient } from '../category-api-client';

@Component({
  template: `
    <div class="container">
      @if (product(); as product) {
        <app-back-button
          class="mb-6"
          [navigateTo]="category() === 'all' ? '/products' : '/products/' + category()"
          >Back to Products</app-back-button
        >

        <div class="flex items-start gap-8 mb-8">
          <div>
            <img
              class="aspect-[500/450] object-cover rounded-lg"
              [src]="product.imageUrl"
              width="500"
              height="450"
              [alt]="product.name"
            />
          </div>

          <div class="flex-1">
            <app-product-main-info
              [product]="product"
              (addedToCart)="addToCart(product.id)"
              (toggledWishlist)="toggleWishlist(product)"
            />
          </div>
        </div>
      }
    </div>
  `,
  imports: [BackButton, ProductMainInfo],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductDetails {
  private readonly productApiClient = inject(ProductApiClient);
  private readonly wishlistApiClient = inject(WishlistApiClient);
  private readonly cartApiClient = inject(CartApiClient);
  private readonly snackbar = inject(Snackbar);

  protected readonly category = inject(CategoryApiClient).currentCategory;

  protected readonly id = input.required<string>();

  protected readonly product = toSignal(
    toObservable(this.id).pipe(
      switchMap(() =>
        combineLatest([this.productApiClient.get(this.id()), this.wishlistApiClient.wishlist$])
      ),
      map(([product, wishlist]) => ({
        ...product,
        favorite: wishlist.has(product.id)
      }))
    )
  );

  protected addToCart(productId: string): void {
    this.cartApiClient
      .create(productId)
      .subscribe(() => this.snackbar.showSuccess('Product added to cart'));
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
