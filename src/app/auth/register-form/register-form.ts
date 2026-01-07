import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
  viewChild
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { AuthApiClient } from '../auth-api-client';
import { Snackbar } from '../../snackbar';

@Component({
  selector: 'app-register-form',
  template: `
    <form (ngSubmit)="register()" #ngForm="ngForm">
      <mat-form-field data-testid="register-form-name-field" class="mb-2" appearance="outline">
        <input
          data-testid="register-form-name-input"
          matInput
          type="text"
          name="name"
          placeholder="Enter your name"
          [(ngModel)]="form.name"
          required
          #name="ngModel"
        />
        <mat-icon matPrefix>person</mat-icon>

        @if (email.hasError('required')) {
          <mat-error>Name is <span class="font-medium">required</span></mat-error>
        }
      </mat-form-field>

      <mat-form-field data-testid="register-form-email-field" class="mb-2" appearance="outline">
        <input
          data-testid="register-form-email-input"
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

      <mat-form-field data-testid="register-form-password-field" class="mb-2" appearance="outline">
        <input
          data-testid="register-form-password-input"
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
            long
          </mat-error>
        }
      </mat-form-field>

      <button
        data-testid="register-form-submit-button"
        class="w-full"
        matButton="filled"
        type="submit"
        [disabled]="submitted()"
      >
        {{ submitted() ? 'Signing Up...' : 'Sign Up' }}
      </button>
    </form>
  `,
  imports: [FormsModule, MatButton, MatError, MatFormField, MatIcon, MatInput, MatPrefix],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterForm {
  private readonly authApiClient = inject(AuthApiClient);
  private readonly snackBar = inject(Snackbar);

  protected readonly form = {
    name: signal(''),
    email: signal(''),
    password: signal('')
  };

  protected readonly submitted = signal(false);

  public readonly dialogClosed = output();

  protected readonly ngForm = viewChild.required(NgForm);

  protected register(): void {
    if (this.ngForm().invalid) {
      return;
    }
    this.submitted.set(true);
    this.snackBar.dismiss();
    this.authApiClient.register(this.ngForm().value).subscribe({
      next: () => this.dialogClosed.emit(),
      error: () => {
        this.submitted.set(false);
        this.snackBar.showError('Try again with another email');
      }
    });
  }
}
