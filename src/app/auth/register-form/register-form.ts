import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-register-form',
  template: `
    <form (ngSubmit)="register()" #form="ngForm">
      <mat-form-field class="mb-2" appearance="outline">
        <input
          matInput
          type="text"
          name="name"
          placeholder="Enter your name"
          [(ngModel)]="userForm.name"
          required
          #name="ngModel"
        />
        <mat-icon matPrefix>person</mat-icon>

        @if (email.hasError('required')) {
          <mat-error>Name is <span class="font-medium">required</span></mat-error>
        }
      </mat-form-field>

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
            characters long
          </mat-error>
        }
      </mat-form-field>

      <button class="w-full" matButton="filled" type="submit">Sign Up</button>
    </form>
  `,
  imports: [FormsModule, MatButton, MatError, MatFormField, MatIcon, MatInput, MatPrefix],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterForm {
  protected readonly userForm = {
    name: signal(''),
    email: signal(''),
    password: signal('')
  };

  protected register(): void {
    // add logic
  }
}
