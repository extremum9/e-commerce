import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
  viewChild
} from '@angular/core';
import { MatError, MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';

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
          [type]="passwordVisible() ? 'text' : 'password'"
          name="password"
          placeholder="Enter your password"
          [(ngModel)]="form.password"
          minlength="6"
          required
          #password="ngModel"
        />
        <mat-icon matPrefix>lock</mat-icon>
        <button
          data-testid="password-visibility-toggle-button"
          class="mr-2"
          matIconButton
          matSuffix
          type="button"
          aria-label="Toggle password visibility"
          [attr.aria-pressed]="passwordVisible()"
          (click)="passwordVisible.set(!passwordVisible())"
        >
          <mat-icon>{{ passwordVisible() ? 'visibility' : 'visibility_off' }}</mat-icon>
        </button>

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

      <div class="flex justify-between items-center gap-2 -mt-2 mb-4">
        <mat-checkbox
          data-testid="login-form-remember-me-checkbox"
          name="rememberMe"
          [(ngModel)]="form.rememberMe"
          >Remember me</mat-checkbox
        >

        @if (passwordResetLoading()) {
          <mat-spinner data-testid="loading-reset-password-spinner" class="mr-2" [diameter]="20" />
        } @else {
          <button
            data-testid="reset-password-button"
            matButton
            type="button"
            (click)="resetPassword()"
          >
            Forgot password?
          </button>
        }
      </div>

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
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatIcon,
    MatPrefix,
    MatButton,
    MatError,
    MatSuffix,
    MatIconButton,
    MatCheckbox,
    MatProgressSpinner
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginForm {
  private readonly authApiClient = inject(AuthApiClient);
  private readonly snackbar = inject(Snackbar);

  protected readonly form = {
    email: signal(''),
    password: signal(''),
    rememberMe: signal(false)
  };

  protected readonly passwordVisible = signal(false);
  protected readonly passwordResetLoading = signal(false);
  protected readonly submitted = signal(false);

  public readonly dialogClosed = output();

  protected readonly ngForm = viewChild.required(NgForm);

  protected resetPassword(): void {
    const email = this.form.email();
    if (!email) {
      return this.snackbar.showError('Please enter your email address');
    }
    this.passwordResetLoading.set(true);
    this.authApiClient
      .resetPassword(email)
      .pipe(finalize(() => this.passwordResetLoading.set(false)))
      .subscribe({
        next: () => this.snackbar.showDefault(`A password reset link has been sent to ${email}`),
        error: () => this.snackbar.showError('Could not send reset email')
      });
  }

  protected login(): void {
    if (this.ngForm().invalid) {
      return;
    }
    this.submitted.set(true);
    this.snackbar.dismiss();
    this.authApiClient
      .login({
        email: this.form.email(),
        password: this.form.password(),
        rememberMe: this.form.rememberMe()
      })
      .subscribe({
        next: () => this.dialogClosed.emit(),
        error: () => {
          this.submitted.set(false);
          this.snackbar.showError('The email or password is incorrect');
        }
      });
  }
}
