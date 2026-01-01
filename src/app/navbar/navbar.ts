import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';

import AuthDialog from '../auth/auth-dialog/auth-dialog';

@Component({
  selector: 'app-navbar',
  template: `
    <mat-toolbar class="shadow-md">
      <div class="container flex items-center justify-between gap-2">
        <a data-testid="navbar-brand" class="shrink-0 text-lg font-medium sm:text-xl" routerLink="/"
          >MiniStore</a
        >
        <div class="flex items-center gap-2">
          <a
            data-testid="navbar-wishlist-link"
            class="hidden! sm:flex!"
            routerLink="/wishlist"
            matIconButton
            aria-label="Wishlist"
          >
            <mat-icon>favorite</mat-icon>
          </a>
          <a data-testid="navbar-cart-link" routerLink="/cart" matIconButton aria-label="Cart">
            <mat-icon>shopping_cart</mat-icon>
          </a>
          <button
            data-testid="navbar-login-button"
            class="hidden! sm:flex!"
            matButton="filled"
            (click)="openAuthDialog()"
          >
            Sign In
          </button>
          <button
            data-testid="navbar-menu-button"
            class="sm:hidden!"
            matIconButton
            [matMenuTriggerFor]="menu"
            aria-label="Toggle menu"
          >
            <mat-icon>menu</mat-icon>
          </button>
        </div>
      </div>
    </mat-toolbar>

    <mat-menu #menu="matMenu">
      <a data-testid="menu-wishlist-link" routerLink="/wishlist" mat-menu-item>
        <mat-icon>favorite</mat-icon>
        <span>Wishlist</span>
      </a>
      <mat-divider />
      <button data-testid="menu-login-button" mat-menu-item>
        <mat-icon>login</mat-icon>
        <span>Sign In</span>
      </button>
    </mat-menu>
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
    MatDivider
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
  private readonly dialog = inject(MatDialog);

  protected openAuthDialog(): void {
    this.dialog.open(AuthDialog, { width: '400px' });
  }
}
