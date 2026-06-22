import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { StarRating } from '../../star-rating/star-rating';
import { Review } from '../../models/review';

@Component({
  selector: 'app-product-review',
  template: `
    <div class="flex flex-col items-start gap-4 sm:flex-row">
      <img
        data-testid="review-author-image"
        class="w-10 h-10 rounded-full"
        [src]="review().author.imageUrl || 'person.jpg'"
        width="40"
        height="40"
        [alt]="review().author.name"
      />

      <div>
        <div data-testid="review-author-name" class="text-lg font-medium">
          {{ review().author.name }}
        </div>

        <div class="flex items-center mb-1">
          <app-star-rating [rating]="review().rating" />
          <div data-testid="review-creation-date" class="text-sm text-gray-500">
            {{ review().createdAt?.toDate() | date: 'MMM d, yyyy' }}
          </div>
        </div>

        <div data-testid="review-title" class="text-base mb-1 font-medium">
          {{ review().title }}
        </div>
        <div data-testid="review-body" class="text-sm text-gray-500">{{ review().body }}</div>
      </div>
    </div>
  `,
  imports: [StarRating, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReview {
  public readonly review = input.required<Review>();
}
