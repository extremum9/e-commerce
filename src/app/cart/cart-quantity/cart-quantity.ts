import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cart-quantity',
  template: `
    <div class="flex items-center gap-3">
      <button
        matIconButton
        type="button"
        [disabled]="quantity() === 1"
        (click)="updated.emit(quantity() - 1)"
      >
        <mat-icon>remove</mat-icon>
      </button>
      <span class="px-3">{{ quantity() }}</span>
      <button matIconButton type="button" (click)="updated.emit(quantity() + 1)">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  imports: [MatIconButton, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartQuantity {
  public readonly quantity = input.required<number>();

  public readonly updated = output<number>();
}
