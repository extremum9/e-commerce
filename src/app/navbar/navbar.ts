import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  template: `
    <mat-toolbar class="shadow-md">
      <div class="container flex items-center justify-between mx-auto">
        <a class="font-medium" routerLink="/">E-Commerce</a>
        <div class="flex items-center gap-2">
          <button matIconButton aria-label="Wishlist">
            <mat-icon>favorite</mat-icon>
          </button>
          <button matIconButton aria-label="Shopping cart">
            <mat-icon>shopping_cart</mat-icon>
          </button>
          <button matButton>Sign In</button>
          <button matButton="filled">Sign Up</button>
        </div>
      </div>
    </mat-toolbar>
  `,
  imports: [RouterLink, MatToolbar, MatIconButton, MatIcon, MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {}
