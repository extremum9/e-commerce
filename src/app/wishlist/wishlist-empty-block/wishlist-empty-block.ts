import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist-empty-block',
  template: `
    <div class="flex flex-col items-center py-16 text-center">
      <div class="flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-gray-100">
        <mat-icon class="scale-150 text-gray-400">favorite_border</mat-icon>
      </div>
      <h2 class="mb-3 text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
      <p class="mb-8 text-gray-600">Save products by tapping the heart icon.</p>
      <a matButton="filled" routerLink="/products">Start Shopping</a>
    </div>
  `,
  imports: [MatButton, MatIcon, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishlistEmptyBlock {}
