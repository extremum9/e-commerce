import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogContent } from '@angular/material/dialog';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

import { LoginForm } from '../login-form/login-form';
import { RegisterForm } from '../register-form/register-form';

@Component({
  template: `
    <mat-dialog-content>
      <mat-tab-group dynamicHeight>
        <mat-tab label="Sign In">
          <app-login-form class="block pt-8" />
        </mat-tab>

        <mat-tab label="Sign Up">
          <app-register-form class="block pt-8" />
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>
  `,
  imports: [MatDialogContent, MatTabGroup, MatTab, LoginForm, RegisterForm],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AuthDialog {}
