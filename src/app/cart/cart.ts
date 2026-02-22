import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { filter, map, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { BackButton } from '../back-button/back-button';
import { CartProduct } from '../models/cart-product';
import { ProductApiClient } from '../product/product-api-client';
import { Snackbar } from '../snackbar/snackbar';
import { WishlistApiClient } from '../wishlist/wishlist-api-client';

import { CartApiClient } from './cart-api-client';
import { CartProductRow } from './cart-product-row/cart-product-row';
import { CartQuantity } from './cart-quantity/cart-quantity';
import { CartWishlistPreview } from './cart-wishlist-preview/cart-wishlist-preview';

type ViewModel = {
  products: CartProduct[];
  count: number;
  wishlistCount: number;
  subtotal: number;
  tax: number;
  total: number;
};

@Component({
  template: `
    <div class="container">
      @if (viewModel(); as vm) {
        @if (vm.products.length) {
          <app-back-button class="mb-6" navigateTo="/products">Continue Shopping</app-back-button>
          <h1 class="mb-4 text-3xl font-bold">Shopping Cart</h1>

          <app-cart-wishlist-preview class="block mb-6" [count]="vm.wishlistCount" />

          <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            <div class="surface-box">
              <h2 class="mb-4 text-2xl font-medium">Cart Items ({{ vm.count }})</h2>
              <div class="grid gap-y-6">
                @for (product of vm.products; track product.id) {
                  <app-cart-product-row
                    [product]="product"
                    (favorited)="moveToWishlist(product.id)"
                    (deleted)="delete(product.id)"
                  >
                    <app-cart-quantity
                      [quantity]="product.quantity"
                      (updated)="updateQuantity({ productId: product.id, quantity: $event })"
                    />
                  </app-cart-product-row>
                }
              </div>
            </div>

            <div class="surface-box">ORDER SUMMARY</div>
          </div>
        } @else {
          <div>EMPTY CART</div>
        }
      } @else {
        <div class="flex justify-center">
          <mat-spinner [diameter]="50" />
        </div>
      }
    </div>
  `,
  imports: [BackButton, MatProgressSpinner, CartProductRow, CartQuantity, CartWishlistPreview],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Cart {
  private readonly cartApiClient = inject(CartApiClient);
  private readonly productApiClient = inject(ProductApiClient);
  private readonly wishlistApiClient = inject(WishlistApiClient);
  private readonly snackbar = inject(Snackbar);

  private readonly products = toSignal(
    this.cartApiClient.cart$.pipe(
      filter(Boolean),
      switchMap((cart) => {
        if (!cart.length) {
          return of([]);
        }

        const productIds = cart.map((item) => item.productId);

        return this.productApiClient.listByIds(productIds).pipe(
          map((products) => {
            const cartMap = new Map(cart.map(({ productId, quantity }) => [productId, quantity]));

            return products.map((product) => ({
              ...product,
              quantity: cartMap.get(product.id)!
            }));
          })
        );
      })
    )
  );

  protected readonly viewModel: Signal<ViewModel | undefined> = computed(() => {
    const products = this.products();
    const count = this.cartApiClient.count();
    const wishlistCount = this.wishlistApiClient.count();
    if (!products || count === undefined || wishlistCount === undefined) {
      return;
    }

    const subtotal = products.reduce((acc, { price, quantity }) => acc + price * quantity, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    return { products, count, wishlistCount, subtotal, tax, total };
  });

  protected updateQuantity({ productId, quantity }: { productId: string; quantity: number }): void {
    this.cartApiClient.create(productId, quantity).subscribe();
  }

  protected moveToWishlist(productId: string): void {
    this.cartApiClient
      .delete(productId)
      .pipe(switchMap(() => this.wishlistApiClient.create(productId)))
      .subscribe(() => this.snackbar.showSuccess('Product moved to wishlist'));
  }

  protected delete(productId: string): void {
    this.cartApiClient
      .delete(productId)
      .subscribe(() => this.snackbar.showSuccess('Product removed from cart'));
  }
}
