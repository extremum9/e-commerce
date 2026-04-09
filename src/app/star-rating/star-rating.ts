import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="flex items-center gap-2">
      <div class="flex items-center">
        @for (starWidth of starWidths(); track $index) {
          <div class="relative">
            <mat-icon class="text-lg! text-gray-300! align-middle" [inline]="true">star</mat-icon>
            <mat-icon
              class="absolute top-0 left-0 text-lg! text-yellow-400!"
              [style.width.%]="starWidth"
              [inline]="true"
              >star</mat-icon
            >
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
      return 50;
    })
  );
}
