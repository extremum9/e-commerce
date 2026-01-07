import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
  viewChild
} from '@angular/core';
import { MatError, MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

import { AuthApiClient } from '../auth-api-client';
import { Snackbar } from '../../snackbar';

@Component({
  selector: 'app-login-form',
  template: `
    <form (ngSubmit)="login()" #ngForm="ngForm">
      <mat-form-field data-testid="login-form-email-field" class="mb-2" appearance="outline">
        <input
          data-testid="login-form-email-input"
          matInput
          type="email"
          name="email"
          placeholder="Enter your email"
          [(ngModel)]="form.email"
          email
          required
          #email="ngModel"
        />
        <mat-icon matPrefix>email</mat-icon>

        @if (email.hasError('required')) {
          <mat-error>Email is <span class="font-medium">required</span></mat-error>
        } @else if (email.hasError('email')) {
          <mat-error>Email is <span class="font-medium">invalid</span></mat-error>
        }
      </mat-form-field>

      <mat-form-field data-testid="login-form-password-field" class="mb-2" appearance="outline">
        <input
          data-testid="login-form-password-input"
          matInput
          type="password"
          name="password"
          placeholder="Enter your password"
          [(ngModel)]="form.password"
          minlength="6"
          required
          #password="ngModel"
        />
        <mat-icon matPrefix>lock</mat-icon>

        @if (password.hasError('required')) {
          <mat-error>Password is <span class="font-medium">required</span></mat-error>
        } @else if (password.hasError('minlength')) {
          <mat-error
            >Password must be at least
            <span class="font-medium"
              >{{ password.getError('minlength').requiredLength }} characters</span
            >
            long</mat-error
          >
        }
      </mat-form-field>

      <button
        data-testid="login-form-submit-button"
        class="w-full"
        matButton="filled"
        type="submit"
        [disabled]="submitted()"
      >
        {{ submitted() ? 'Signing In...' : 'Sign In' }}
      </button>
    </form>
  `,
  imports: [FormsModule, MatFormField, MatInput, MatIcon, MatPrefix, MatButton, MatError],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginForm {
  private readonly authApiClient = inject(AuthApiClient);
  private readonly snackBar = inject(Snackbar);

  protected readonly form = {
    email: signal(''),
    password: signal('')
  };

  protected readonly submitted = signal(false);

  public readonly dialogClosed = output();

  protected readonly ngForm = viewChild.required(NgForm);

  protected login(): void {
    if (this.ngForm().invalid) {
      return;
    }
    this.submitted.set(true);
    this.snackBar.dismiss();
    this.authApiClient.login(this.ngForm().value).subscribe({
      next: () => this.dialogClosed.emit(),
      error: () => {
        this.submitted.set(false);
        this.snackBar.showError('The email or password is incorrect');
      }
    });
  }
}
