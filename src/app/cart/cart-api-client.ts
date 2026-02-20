import { computed, inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  increment,
  setDoc
} from '@angular/fire/firestore';
import { defer, Observable, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthApiClient } from '../auth/auth-api-client';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartApiClient {
  private readonly firestore = inject(Firestore);
  private readonly authApiClient = inject(AuthApiClient);

  private readonly user = this.authApiClient.currentUser;

  public readonly cart$ = this.authApiClient.currentUser$.pipe(switchMap(() => this.list()));
  public readonly cart = toSignal(this.cart$);

  public readonly count = computed(() =>
    this.cart()?.reduce((acc, item) => acc + item.quantity, 0)
  );

  public create(productId: string): Observable<void> {
    const user = this.user();
    if (!user) {
      return of(undefined);
    }

    const docRef = doc(this.firestore, `users/${user.uid}/cart/${productId}`);

    return defer(() => setDoc(docRef, { quantity: increment(1) }, { merge: true }));
  }

  private list(): Observable<CartItem[]> {
    const user = this.user();
    if (!user) {
      return of([]);
    }

    const cartCollection = collection(this.firestore, `users/${user.uid}/cart`);

    return collectionData(cartCollection, { idField: 'productId' }) as Observable<CartItem[]>;
  }
}
