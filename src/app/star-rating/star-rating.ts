import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="flex items-center gap-2">
      <div class="flex items-center">
        @for (starWidth of starWidths(); track $index) {
          <div class="relative">
            <mat-icon class="text-gray-300! align-middle">star</mat-icon>
            <div class="absolute top-0 left-0 h-full overflow-hidden" [style.width.%]="starWidth">
              <mat-icon class="text-yellow-400!">star</mat-icon>
            </div>
          </div>
        }
      </div>

      <span class="text-sm text-gray-500">
        <ng-content />
      </span>
    </div>
  `,
  host: {
    class: 'block'
  },
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarRating {
  public readonly rating = input.required<number>();

  protected readonly starWidths = computed(() =>
    [...Array(5)].map((_, index) => {
      const difference = this.rating() - index;
      if (difference >= 1) {
        return 100;
      } else if (difference <= 0) {
        return 0;
      }
      return difference * 100;
    })
  );
}
