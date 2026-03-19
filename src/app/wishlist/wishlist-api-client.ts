import { computed, inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  setDoc,
  writeBatch
} from '@angular/fire/firestore';
import { defer, from, map, Observable, of, shareReplay, startWith, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthApiClient } from '../auth/auth-api-client';
import { WishlistItem } from '../models/wishlist-item';

import { WishlistLocalStorage } from './wishlist-local-storage';

@Injectable({
  providedIn: 'root'
})
export class WishlistApiClient {
  private readonly firestore = inject(Firestore);
  private readonly authApiClient = inject(AuthApiClient);
  private readonly wishlistLocalStorage = inject(WishlistLocalStorage);

  private readonly user = this.authApiClient.currentUser;

  public readonly wishlist$: Observable<ReadonlySet<string>> = this.authApiClient.currentUser$.pipe(
    switchMap((user) => {
      if (!user) {
        return this.wishlistLocalStorage.refresh$.pipe(
          startWith(undefined),
          map(() => this.wishlistLocalStorage.get())
        );
      }

      const wishlistCollection = collection(this.firestore, `users/${user.uid}/wishlist`);

      return (
        collectionData(wishlistCollection, { idField: 'productId' }) as Observable<WishlistItem[]>
      ).pipe(map((items) => items.map((item) => item.productId)));
    }),
    map((productIds) => new Set(productIds)),
    shareReplay(1)
  );
  public readonly wishlist = toSignal(this.wishlist$);

  public readonly count = computed(() => this.wishlist()?.size);

  public create(productId: string): Observable<void> {
    return defer(() => {
      const user = this.user();
      if (!user) {
        this.wishlistLocalStorage.add(productId);

        return of(undefined);
      }

      const docRef = doc(this.firestore, `users/${user.uid}/wishlist/${productId}`);

      return setDoc(docRef, { productId });
    });
  }

  public delete(productId: string): Observable<void> {
    return defer(() => {
      const user = this.user();
      if (!user) {
        this.wishlistLocalStorage.remove(productId);

        return of(undefined);
      }

      const docRef = doc(this.firestore, `users/${user.uid}/wishlist/${productId}`);

      return deleteDoc(docRef);
    });
  }

  public deleteAll(): Observable<void> {
    return defer(() => {
      const user = this.user();
      if (!user) {
        this.wishlistLocalStorage.clear();

        return of(undefined);
      }

      const wishlistCollection = collection(this.firestore, `users/${user.uid}/wishlist`);

      return from(getDocs(wishlistCollection)).pipe(
        switchMap((snapshot) => {
          if (snapshot.empty) {
            return of(undefined);
          }

          const batch = writeBatch(this.firestore);
          snapshot.forEach((doc) => batch.delete(doc.ref));

          return batch.commit();
        })
      );
    });
  }
}
