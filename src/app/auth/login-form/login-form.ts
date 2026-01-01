import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-login-form',
  template: `
    <form (ngSubmit)="login()">
      <mat-form-field appearance="outline">
        <input
          matInput
          type="email"
          name="email"
          placeholder="Enter your email"
          [(ngModel)]="user.email"
          email
          required
        />
        <mat-icon matPrefix>email</mat-icon>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <input
          matInput
          type="password"
          name="password"
          placeholder="Enter your password"
          [(ngModel)]="user.password"
          minlength="6"
          required
        />
        <mat-icon matPrefix>lock</mat-icon>
      </mat-form-field>

      <button class="w-full" matButton="filled" type="submit">Sign In</button>

      <div class="flex items-center my-4">
        <mat-divider class="grow" />
        <span class="px-2 text-gray-700">Or</span>
        <mat-divider class="grow" />
      </div>

      <button class="w-full" matButton="outlined" type="button">
        Sign In with Google
        <mat-icon svgIcon="google" />
      </button>
    </form>
  `,
  imports: [FormsModule, MatFormField, MatInput, MatIcon, MatPrefix, MatButton, MatDivider],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginForm {
  protected readonly user = {
    email: signal(''),
    password: signal('')
  };

  protected login(): void {
    // add logic
  }
}
