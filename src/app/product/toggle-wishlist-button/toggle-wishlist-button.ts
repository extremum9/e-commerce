import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';

@Component({
  selector: 'app-toggle-wishlist-button',
  template: `
    <button [class.text-red-500!]="favorite()" matMiniFab type="button" (click)="toggled.emit()">
      <mat-icon>{{ favorite() ? 'favorite' : 'favorite_border' }}</mat-icon>
    </button>
  `,
  imports: [MatIcon, MatMiniFabButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleWishlistButton {
  public readonly favorite = input<boolean>();

  public readonly toggled = output();
}
