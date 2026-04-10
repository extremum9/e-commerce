import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';

import { Review } from '../../models/review';
import { ProductReview } from '../product-review/product-review';
import { ProductReviewSummary } from '../product-review-summary/product-review-summary';

@Component({
  selector: 'app-product-reviews',
  template: `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-medium">Reviews</h2>
      <button matButton="filled" type="button" (click)="writeDialogOpened.emit()">
        Write a Review
      </button>
    </div>

    <app-product-review-summary class="block mb-6" [reviews]="reviews()" [rating]="rating()" />

    <div class="flex flex-col gap-y-6">
      @for (review of reviews(); track review.id) {
        <app-product-review class="surface-box" [review]="review" />
      }
    </div>
  `,
  imports: [MatButton, ProductReview, ProductReviewSummary],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReviews {
  public readonly reviews = input.required<Review[]>();
  public readonly rating = input.required<number>();

  public readonly writeDialogOpened = output();
}
