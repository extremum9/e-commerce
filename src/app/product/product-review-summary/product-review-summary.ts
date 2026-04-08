import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';

import { StarRating } from '../../star-rating/star-rating';
import { Review } from '../../models/review';

type RatingStats = {
  star: number;
  count: number;
  percentage: number;
};

@Component({
  selector: 'app-product-review-summary',
  template: `
    <div class="flex items-center gap-8 mb-6 px-4 py-6 rounded-lg bg-gray-50">
      <div class="flex flex-col items-center w-1/2">
        <div class="mb-1 text-4xl font-medium text-gray-900">
          {{ rating() }}
        </div>
        <app-star-rating class="mb-2" [rating]="rating()" />
        <div class="text-sm text-gray-500">{{ total() }} reviews</div>
      </div>

      <div class="flex-1">
        @for (stat of stats(); track stat.star) {
          <div class="flex items-center gap-x-2">
            <span class="w-4 text-sm">{{ stat.star }}</span>
            <div class="flex-1 h-2 rounded-full bg-gray-200">
              <div
                class="h-2 rounded-full bg-yellow-400"
                [style.width.%]="stat.percentage"
                [title]="stat.count"
              ></div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  imports: [StarRating],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReviewSummary {
  public readonly reviews = input.required<Review[]>();
  public readonly rating = input.required<number>();

  protected readonly total = computed(() => this.reviews().length);

  protected readonly stats: Signal<RatingStats[]> = computed(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    this.reviews().forEach((review) => counts[review.rating]++);

    const total = this.total();

    return [5, 4, 3, 2, 1].map((star) => {
      const count = counts[star];

      return { star, count, percentage: (count / total) * 100 };
    });
  });
}
