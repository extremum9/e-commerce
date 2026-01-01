import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatError, MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-login-form',
  template: `
    <form (ngSubmit)="login()">
      <mat-form-field class="mb-2" appearance="outline">
        <input
          matInput
          type="email"
          name="email"
          placeholder="Enter your email"
          [(ngModel)]="user.email"
          email
          required
          #email="ngModel"
        />
        <mat-icon matPrefix>email</mat-icon>

        @if (email.hasError('required')) {
          <mat-error>Email is <span class="font-medium">required</span></mat-error>
        }
        @if (email.hasError('email')) {
          <mat-error>Email is <span class="font-medium">invalid</span></mat-error>
        }
      </mat-form-field>

      <mat-form-field class="mb-2" appearance="outline">
        <input
          matInput
          type="password"
          name="password"
          placeholder="Enter your password"
          [(ngModel)]="user.password"
          minlength="6"
          required
          #password="ngModel"
        />
        <mat-icon matPrefix>lock</mat-icon>

        @if (password.hasError('required')) {
          <mat-error>Password is <span class="font-medium">required</span></mat-error>
        }
        @if (password.hasError('minlength')) {
          <mat-error
            >Password must be at least
            <span class="font-medium">{{ password.getError('minlength').requiredLength }}</span>
            characters long</mat-error
          >
        }
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
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatIcon,
    MatPrefix,
    MatButton,
    MatDivider,
    MatError
  ],
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
