import { computed, inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  increment,
  setDoc,
  writeBatch
} from '@angular/fire/firestore';
import { defer, from, map, Observable, of, switchMap } from 'rxjs';
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

  public readonly cart$: Observable<ReadonlyMap<string, number>> =
    this.authApiClient.currentUser$.pipe(
      switchMap(() => this.list()),
      map((items) => new Map(items.map(({ productId, quantity }) => [productId, quantity])))
    );
  public readonly cart = toSignal(this.cart$);

  public readonly count = computed(
    () =>
      this.cart() &&
      [...this.cart()!.values()].reduce((accumulator, quantity) => accumulator + quantity, 0)
  );

  public create(productId: string, quantity?: number): Observable<void> {
    const user = this.user();
    if (!user) {
      return of(undefined);
    }

    const docRef = doc(this.firestore, `users/${user.uid}/cart/${productId}`);

    return defer(() => setDoc(docRef, { quantity: quantity ?? increment(1) }, { merge: true }));
  }

  public createMany(productIds: string[]): Observable<void> {
    const user = this.user();
    if (!user) {
      return of(undefined);
    }

    const batch = writeBatch(this.firestore);
    productIds.forEach((productId) => {
      const docRef = doc(this.firestore, `users/${user.uid}/cart/${productId}`);
      batch.set(docRef, { productId, quantity: 1 }, { merge: true });
    });

    return from(batch.commit());
  }

  public delete(productId: string): Observable<void> {
    const user = this.user();
    if (!user) {
      return of(undefined);
    }

    const docRef = doc(this.firestore, `users/${user.uid}/cart/${productId}`);

    return defer(() => deleteDoc(docRef));
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
