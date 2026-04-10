import { ChangeDetectionStrategy, Component, inject, input, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { BackButton } from '../../back-button/back-button';
import { ProductApiClient } from '../product-api-client';
import { WishlistApiClient } from '../../wishlist/wishlist-api-client';
import { ProductMainInfo } from '../product-main-info/product-main-info';
import { Product } from '../../models/product';
import { Snackbar } from '../../snackbar/snackbar';
import { CartApiClient } from '../../cart/cart-api-client';
import { CategoryApiClient } from '../category-api-client';
import { ProductReviews } from '../product-reviews/product-reviews';
import { ReviewApiClient } from '../review-api-client';
import { Review } from '../../models/review';
import { ProductWriteReviewDialog } from '../product-write-review-dialog/product-write-review-dialog';

type ViewModel = {
  product: Product;
  reviews: Review[];
};

@Component({
  template: `
    <div class="container">
      @if (viewModel(); as vm) {
        <app-back-button
          class="mb-6"
          [navigateTo]="category() === 'all' ? '/products' : '/products/' + category()"
          >Back to Products</app-back-button
        >

        <div class="flex items-start gap-8 mb-8">
          <div>
            <img
              class="aspect-[500/450] object-cover rounded-lg"
              [src]="vm.product.imageUrl"
              width="500"
              height="450"
              [alt]="vm.product.name"
            />
          </div>

          <div class="flex-1">
            <app-product-main-info
              [product]="vm.product"
              (addedToCart)="addToCart(vm.product.id)"
              (toggledWishlist)="toggleWishlist(vm.product)"
            />
          </div>
        </div>

        <app-product-reviews
          class="block surface-box"
          [reviews]="vm.reviews"
          [rating]="vm.product.rating"
          (writeDialogOpened)="openWriteReviewDialog()"
        />
      }
    </div>
  `,
  imports: [BackButton, ProductMainInfo, ProductReviews],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductDetails {
  private readonly reviewApiClient = inject(ReviewApiClient);
  private readonly wishlistApiClient = inject(WishlistApiClient);
  private readonly cartApiClient = inject(CartApiClient);
  private readonly snackbar = inject(Snackbar);
  private readonly dialog = inject(MatDialog);

  protected readonly category = inject(CategoryApiClient).currentCategory;

  protected readonly id = input.required<string>();

  protected readonly viewModel: Signal<ViewModel | undefined>;

  constructor() {
    const productApiClient = inject(ProductApiClient);

    this.viewModel = toSignal(
      toObservable(this.id).pipe(
        switchMap((id) =>
          combineLatest([
            productApiClient.get(id),
            this.wishlistApiClient.wishlist$,
            this.reviewApiClient.list(id)
          ])
        ),
        map(([product, wishlist, reviews]) => ({
          product: { ...product, favorite: wishlist.has(product.id) },
          reviews
        }))
      )
    );
  }

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

  protected openWriteReviewDialog(): void {
    this.dialog.open(ProductWriteReviewDialog, {});
  }
}
