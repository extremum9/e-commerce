import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';

import { Review } from '../../models/review';
import { ProductReview } from '../product-review/product-review';

@Component({
  selector: 'app-product-reviews',
  template: `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-medium">Reviews</h2>
      <button matButton="filled" type="button">Write a Review</button>
    </div>

    <div class="mb-6">RATING SUMMARY</div>

    <div class="flex flex-col gap-y-6">
      @for (review of reviews(); track review.id) {
        <app-product-review class="surface-box" [review]="review" />
      }
    </div>
  `,
  imports: [MatButton, ProductReview],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReviews {
  public readonly reviews = input.required<Review[]>();
}
