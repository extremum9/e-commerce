import { ChangeDetectionStrategy, Component, computed, inject, PendingTasks } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatBadge } from '@angular/material/badge';

import { AuthApiClient } from '../auth/auth-api-client';
import { WishlistApiClient } from '../wishlist/wishlist-api-client';
import { CartApiClient } from '../cart/cart-api-client';

@Component({
  selector: 'app-navbar',
  template: `
    <mat-toolbar class="shadow-md">
      <div class="container flex items-center justify-between gap-2 px-0">
        <a data-testid="navbar-brand" class="shrink-0 text-lg font-medium sm:text-xl" routerLink="/"
          >MiniStore</a
        >
        <div class="flex items-center gap-2">
          <a
            data-testid="navbar-wishlist-link"
            routerLink="/wishlist"
            matIconButton
            [matBadge]="wishlistCount()"
            [matBadgeHidden]="wishlistCount() === 0"
            aria-label="Wishlist"
          >
            <mat-icon>favorite</mat-icon>
          </a>
          <a
            data-testid="navbar-cart-link"
            routerLink="/cart"
            matIconButton
            [matBadge]="cartCount()"
            [matBadgeHidden]="cartCount() === 0"
            aria-label="Cart"
          >
            <mat-icon>shopping_cart</mat-icon>
          </a>
          @if (user(); as user) {
            <button
              data-testid="user-menu-button"
              matIconButton
              [matMenuTriggerFor]="userMenu"
              aria-label="Toggle user menu"
            >
              <img
                data-testid="user-profile-image"
                class="rounded-full"
                [src]="user.imageUrl || 'person.jpg'"
                alt="Profile image"
              />
            </button>

            <mat-menu #userMenu="matMenu" xPosition="before">
              <div class="flex flex-col min-w-[180px] px-3">
                <span data-testid="user-menu-name" class="text-sm font-medium">{{
                  user.name
                }}</span>
                <span data-testid="user-menu-email" class="text-xs text-gray-500">{{
                  user.email
                }}</span>
              </div>
              <mat-divider />
              <button
                data-testid="logout-button"
                class="!min-h-[32px]"
                mat-menu-item
                (click)="logout()"
              >
                <mat-icon>logout</mat-icon>
                Sign Out
              </button>
            </mat-menu>
          } @else {
            <button data-testid="navbar-login-button" matButton="filled" (click)="openAuthDialog()">
              Sign In
            </button>
          }
        </div>
      </div>
    </mat-toolbar>
  `,
  imports: [
    RouterLink,
    MatToolbar,
    MatIconButton,
    MatIcon,
    MatButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatDivider,
    MatBadge
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
  private readonly pendingTasks = inject(PendingTasks);
  private readonly authApiClient = inject(AuthApiClient);
  private readonly wishlistApiClient = inject(WishlistApiClient);
  private readonly cartApiClient = inject(CartApiClient);
  private readonly dialog = inject(MatDialog);

  protected readonly user = this.authApiClient.currentUser;

  protected readonly wishlistCount = computed(
    () => this.wishlistApiClient.wishlistSet()?.size ?? 0
  );
  protected readonly cartCount = this.cartApiClient.count;

  protected openAuthDialog(): void {
    this.pendingTasks.run(async () => {
      const { AuthDialog } = await import('../auth/auth-dialog/auth-dialog');
      this.dialog.open(AuthDialog, { width: '400px' });
    });
  }

  protected logout(): void {
    this.authApiClient.logout();
  }
}
