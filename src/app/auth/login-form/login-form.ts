import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatError, MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-login-form',
  template: `
    <form (ngSubmit)="login()" #form="ngForm">
      <mat-form-field class="mb-2" appearance="outline">
        <input
          matInput
          type="email"
          name="email"
          placeholder="Enter your email"
          [(ngModel)]="userForm.email"
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
          [(ngModel)]="userForm.password"
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
    </form>
  `,
  imports: [FormsModule, MatFormField, MatInput, MatIcon, MatPrefix, MatButton, MatError],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginForm {
  protected readonly userForm = {
    email: signal(''),
    password: signal('')
  };

  protected login(): void {
    // add logic
  }
}
