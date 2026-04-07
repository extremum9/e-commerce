import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { StarRating } from '../../star-rating/star-rating';
import { Review } from '../../models/review';

@Component({
  selector: 'app-product-review',
  template: `
    <div class="flex items-start gap-4">
      <img
        class="w-10 h-10 rounded-full"
        [src]="review().author.imageUrl || 'person.jpg'"
        [alt]="review().author.name"
      />

      <div>
        <div class="text-lg font-medium">{{ review().author.name }}</div>

        <div class="flex items-center mb-1">
          <app-star-rating [rating]="review().rating" />
          <div class="text-sm text-gray-500">
            {{ review().createdAt.toDate() | date: 'MMM d, yyyy' }}
          </div>
        </div>

        <div class="text-base mb-1 font-medium">{{ review().title }}</div>
        <div class="text-sm text-gray-500">{{ review().body }}</div>
      </div>
    </div>
  `,
  imports: [StarRating, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReview {
  public readonly review = input.required<Review>();
}
