import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  template: `
    <mat-toolbar class="shadow-md">
      <div class="flex items-center justify-between gap-2 w-full max-w-[80rem] mx-auto">
        <a class="flex items-center gap-1" routerLink="/">
          <img src="/logo.png" width="36" height="36" alt="Logo" />
          <span class="hidden font-medium md:inline-block">E-Commerce</span>
        </a>

        <div class="flex items-center gap-2">
          <button class="hidden! md:flex!" matIconButton aria-label="Wishlist">
            <mat-icon>favorite</mat-icon>
          </button>
          <button matIconButton aria-label="Shopping cart">
            <mat-icon>shopping_cart</mat-icon>
          </button>
          <button matButton="filled">Sign In</button>
        </div>
      </div>
    </mat-toolbar>
  `,
  imports: [RouterLink, MatToolbar, MatIconButton, MatIcon, MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {}
