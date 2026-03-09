import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-cart-wishlist-preview',
  template: `
    <div class="surface-box flex flex-wrap items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        <mat-icon class="shrink-0 text-red-500!">favorite_border</mat-icon>
        <div>
          <h2 data-testid="cart-wishlist-preview-title" class="text-xl font-medium">
            Wishlist ({{ count() }})
          </h2>
          <p data-testid="cart-wishlist-preview-description" class="text-sm text-gray-500">
            You have {{ count() }} items saved for later
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <a data-testid="cart-wishlist-preview-link" matButton routerLink="/wishlist">View All</a>

        @if (count()) {
          <button
            data-testid="cart-wishlist-preview-move-all-button"
            class="flex items-center gap-2"
            matButton="filled"
            type="button"
            (click)="allMoved.emit()"
          >
            <mat-icon>shopping_cart</mat-icon>
            Move All to Cart
          </button>
        }
      </div>
    </div>
  `,
  imports: [MatIcon, RouterLink, MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartWishlistPreview {
  public readonly count = input.required<number>();

  public readonly allMoved = output();
}
