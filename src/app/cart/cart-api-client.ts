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
import { defer, map, Observable, of, startWith, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthApiClient } from '../auth/auth-api-client';
import { CartItem } from '../models/cart-item';

import { CartLocalStorage } from './cart-local-storage';

@Injectable({
  providedIn: 'root'
})
export class CartApiClient {
  private readonly firestore = inject(Firestore);
  private readonly authApiClient = inject(AuthApiClient);
  private readonly cartLocalStorage = inject(CartLocalStorage);

  private readonly user = this.authApiClient.currentUser;

  public readonly cart$: Observable<ReadonlyMap<string, number>> =
    this.authApiClient.currentUser$.pipe(
      switchMap((user) => {
        if (!user) {
          return this.cartLocalStorage.change$.pipe(
            startWith(undefined),
            map(() => this.cartLocalStorage.get())
          );
        }

        const cartCollection = collection(this.firestore, `users/${user.uid}/cart`);

        return collectionData(cartCollection, { idField: 'productId' }) as Observable<CartItem[]>;
      }),
      map((items) => new Map(items.map(({ productId, quantity }) => [productId, quantity])))
    );
  public readonly cart = toSignal(this.cart$);

  public readonly count = computed(
    () =>
      this.cart() &&
      [...this.cart()!.values()].reduce((accumulator, quantity) => accumulator + quantity, 0)
  );

  public create(productId: string, quantity?: number): Observable<void> {
    return defer(() => {
      const user = this.user();
      if (!user) {
        this.cartLocalStorage.add(productId, quantity);

        return of(undefined);
      }

      const docRef = doc(this.firestore, `users/${user.uid}/cart/${productId}`);

      return setDoc(docRef, { quantity: quantity ?? increment(1) }, { merge: true });
    });
  }

  public createMany(productIds: string[]): Observable<void> {
    return defer(() => {
      const user = this.user();
      if (!user) {
        this.cartLocalStorage.addMany(productIds);

        return of(undefined);
      }

      const batch = writeBatch(this.firestore);
      productIds.forEach((productId) => {
        const docRef = doc(this.firestore, `users/${user.uid}/cart/${productId}`);
        batch.set(docRef, { quantity: 1 });
      });

      return batch.commit();
    });
  }

  public delete(productId: string): Observable<void> {
    return defer(() => {
      const user = this.user();
      if (!user) {
        this.cartLocalStorage.remove(productId);

        return of(undefined);
      }

      const docRef = doc(this.firestore, `users/${user.uid}/cart/${productId}`);

      return deleteDoc(docRef);
    });
  }
}
