import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

import { LoginForm } from '../login-form/login-form';
import { RegisterForm } from '../register-form/register-form';

@Component({
  template: `
    <mat-dialog-content>
      <mat-tab-group dynamicHeight>
        <mat-tab label="Sign In">
          <app-login-form class="block pt-8" (dialogClosed)="close()" />
        </mat-tab>

        <mat-tab label="Sign Up">
          <app-register-form class="block pt-8" />
        </mat-tab>
      </mat-tab-group>

      <div class="flex items-center my-4">
        <mat-divider class="grow" />
        <span class="px-2 text-gray-700">Or</span>
        <mat-divider class="grow" />
      </div>

      <button class="w-full" matButton="outlined" type="button">
        Continue with Google
        <mat-icon svgIcon="google" />
      </button>
    </mat-dialog-content>
  `,
  imports: [
    MatDialogContent,
    MatTabGroup,
    MatTab,
    LoginForm,
    RegisterForm,
    MatButton,
    MatDivider,
    MatIcon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AuthDialog {
  private readonly dialogRef = inject(MatDialogRef);

  protected close(): void {
    this.dialogRef.close();
  }
}
