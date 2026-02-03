import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

export type ConfirmDialogData = {
  title: string;
  message: string;
  confirmText?: string;
};

@Component({
  template: `
    <h2 data-testid="confirm-dialog-title" mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p data-testid="confirm-dialog-message">{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button data-testid="confirm-dialog-cancel-button" matButton mat-dialog-close>Cancel</button>
      <button data-testid="confirm-dialog-confirm-button" matButton [mat-dialog-close]="true">
        {{ data.confirmText || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogContent, MatDialogTitle, MatDialogActions, MatButton, MatDialogClose],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialog {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
