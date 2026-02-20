import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { filter, map, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { BackButton } from '../back-button/back-button';
import { CartProduct } from '../models/cart-product';
import { ProductApiClient } from '../product/product-api-client';

import { CartApiClient } from './cart-api-client';
import { CartProductRow } from './cart-product-row/cart-product-row';

type ViewModel = {
  products: CartProduct[];
  count: number;
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

          <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            <div class="surface-box">
              <h2 class="mb-4 text-2xl font-medium">Cart Items ({{ vm.count }})</h2>
              <div class="grid gap-y-6">
                @for (product of vm.products; track product.id) {
                  <app-cart-product-row [product]="product" />
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
  imports: [BackButton, MatProgressSpinner, CartProductRow],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Cart {
  private readonly cartApiClient = inject(CartApiClient);
  private readonly productApiClient = inject(ProductApiClient);

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
    if (!products || count === undefined) {
      return;
    }

    const subtotal = products.reduce((acc, { price, quantity }) => acc + price * quantity, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    return { products, count, subtotal, tax, total };
  });
}
