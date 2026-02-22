import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-cart-wishlist-preview',
  template: `
    <div class="surface-box flex items-center justify-between">
      <div class="flex items-center gap-3">
        <mat-icon class="text-red-500!">favorite_border</mat-icon>
        <div>
          <h2 class="text-xl font-bold">Wishlist ({{ count() }})</h2>
          <p class="text-sm text-gray-500">You have {{ count() }} items saved for later</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <a matButton routerLink="/wishlist">View All</a>
        <button class="flex items-center gap-2" matButton="filled">
          <mat-icon>shopping_cart</mat-icon>
          Add All to Cart
        </button>
      </div>
    </div>
  `,
  imports: [MatIcon, RouterLink, MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartWishlistPreview {
  public readonly count = input.required<number>();
}
