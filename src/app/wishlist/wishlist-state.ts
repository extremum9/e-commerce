import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { WishlistApiClient } from './wishlist-api-client';

@Injectable({
  providedIn: 'root'
})
export class WishlistState {
  private readonly wishlistApiClient = inject(WishlistApiClient);

  private readonly wishlist$ = this.wishlistApiClient
    .list()
    .pipe(map((items) => items.map((item) => item.productId)));

  public readonly wishlist = toSignal(this.wishlist$, { initialValue: [] });
}
