import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  template: `
    <mat-toolbar class="shadow-md">
      <div class="container flex items-center justify-between gap-2">
        <a class="flex items-center shrink-0 gap-1" routerLink="/">
          <img src="/logo.png" width="36" height="36" alt="Logo" />
          <span class="hidden font-medium md:inline-block">E-Commerce</span>
        </a>
        <div class="flex items-center gap-2">
          <a class="hidden! sm:flex!" routerLink="/wishlist" matIconButton aria-label="Wishlist">
            <mat-icon>favorite</mat-icon>
          </a>
          <a routerLink="/cart" matIconButton aria-label="Shopping cart">
            <mat-icon>shopping_cart</mat-icon>
          </a>
          <button class="hidden! sm:flex!" matButton="filled">Sign In</button>
          <button
            class="sm:hidden!"
            matIconButton
            [matMenuTriggerFor]="mobileMenu"
            aria-label="Toggle mobile menu"
          >
            <mat-icon>menu</mat-icon>
          </button>
        </div>
      </div>
    </mat-toolbar>

    <mat-menu #mobileMenu="matMenu">
      <a routerLink="/wishlist" mat-menu-item>
        <mat-icon>favorite</mat-icon>
        <span>Wishlist</span>
      </a>
      <mat-divider />
      <button mat-menu-item>
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
export class Navbar {}
