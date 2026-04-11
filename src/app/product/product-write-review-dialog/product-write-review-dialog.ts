import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

import { ReviewApiClient } from '../review-api-client';
import { Snackbar } from '../../snackbar/snackbar';

type WriteReviewDialogData = {
  productId: string;
};

type RatingOption = {
  label: string;
  value: number;
};

@Component({
  template: `
    <h2 mat-dialog-title>Write a review</h2>

    <mat-dialog-content>
      <form id="reviewForm" (ngSubmit)="submit()" #ngForm="ngForm">
        <mat-form-field appearance="outline">
          <mat-select name="rating" [(ngModel)]="form.rating" required>
            @for (ratingOption of ratingOptions(); track ratingOption.value) {
              <mat-option [value]="ratingOption.value">{{ ratingOption.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field class="mb-2" appearance="outline">
          <input
            matInput
            type="text"
            name="title"
            placeholder="Summarize your review"
            [(ngModel)]="form.title"
            required
            #title="ngModel"
          />

          @if (title.hasError('required')) {
            <mat-error>Title is <span class="font-medium">required</span></mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <textarea
            matInput
            name="body"
            [(ngModel)]="form.body"
            placeholder="Tell others about your experience with this product"
            rows="4"
            required
            #body="ngModel"
          ></textarea>

          @if (body.hasError('required')) {
            <mat-error>Body is <span class="font-medium">required</span></mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button matButton mat-dialog-close>Cancel</button>
      <button form="reviewForm" matButton type="submit" [disabled]="submitted()" cdkFocusInitial>
        {{ submitted() ? 'Submitting...' : 'Submit' }}
      </button>
    </mat-dialog-actions>
  `,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    MatError
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductWriteReviewDialog {
  private readonly data = inject<WriteReviewDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly reviewApiClient = inject(ReviewApiClient);
  private readonly snackbar = inject(Snackbar);

  protected readonly ratingOptions = signal<RatingOption[]>([
    { label: '5 Stars - Excellent', value: 5 },
    { label: '4 Stars - Good', value: 4 },
    { label: '3 Stars - Average', value: 3 },
    { label: '2 Stars - Poor', value: 2 },
    { label: '1 Star - Terrible', value: 1 }
  ]);

  protected readonly form = {
    title: signal(''),
    body: signal(''),
    rating: signal(5)
  };

  protected readonly submitted = signal(false);

  protected readonly ngForm = viewChild.required(NgForm);

  protected submit(): void {
    if (this.ngForm().invalid) {
      return;
    }
    this.submitted.set(true);
    this.snackbar.dismiss();
    this.reviewApiClient
      .create({
        productId: this.data.productId,
        title: this.form.title(),
        body: this.form.body(),
        rating: this.form.rating()
      })
      .subscribe({
        next: () => this.dialogRef.close(),
        error: () => {
          this.submitted.set(false);
          this.snackbar.showError('Could not create a review');
        }
      });
  }
}
