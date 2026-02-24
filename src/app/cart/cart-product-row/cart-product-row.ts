import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';

import { CartProduct } from '../../models/cart-product';

@Component({
  selector: 'app-cart-product-row',
  template: `
    <div class="grid grid-cols-[3fr_1fr_1fr] items-center gap-x-4 min-w-[40rem]">
      <div class="flex items-center gap-4">
        <img
          class="w-24 h-24 object-cover rounded-lg"
          [src]="product().imageUrl"
          width="24"
          height="24"
          [alt]="product().name"
        />
        <div>
          <h3 class="text-lg font-medium text-gray-900">{{ product().name }}</h3>
          <data class="text-lg text-gray-600" [value]="product().price"
            >{{ product().price | currency: 'USD' : 'symbol' : '1.0-2' }}
          </data>
        </div>
      </div>

      <ng-content select="app-cart-quantity" />

      <div class="flex flex-col items-end">
        <data class="text-lg font-medium text-right" [value]="total()">{{
          total() | currency
        }}</data>
        <div class="flex items-center -me-3">
          <button matIconButton type="button" (click)="favorited.emit()">
            <mat-icon>favorite_border</mat-icon>
          </button>
          <button class="danger" matIconButton type="button" (click)="deleted.emit()">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  imports: [MatIconButton, MatIcon, MatIconButton, MatIcon, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartProductRow {
  public readonly product = input.required<CartProduct>();

  public readonly favorited = output();
  public readonly deleted = output();

  protected readonly total = computed(() => this.product().price * this.product().quantity);
}
