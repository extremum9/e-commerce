import { inject, Injectable } from '@angular/core';
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
import { defer, from, map, Observable, of, startWith, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { AuthApiClient } from '../auth/auth-api-client';
import { WishlistItem } from '../models/wishlist-item';

import { WishlistLocalStorage } from './wishlist-local-storage';

@Injectable({
  providedIn: 'root'
})
export class WishlistApiClient {
  private readonly firestore = inject(Firestore);
  private readonly wishlistLocalStorage = inject(WishlistLocalStorage);

  private readonly user = inject(AuthApiClient).currentUser;
  private readonly user$ = toObservable(this.user);

  public readonly wishlistSet = toSignal(
    this.wishlistLocalStorage.change$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.list().pipe(
          map((items) => new Set(items.map((item) => item.productId)) as ReadonlySet<string>)
        )
      )
    )
  );

  public list(): Observable<WishlistItem[]> {
    return this.user$.pipe(
      switchMap((user) => {
        if (!user) {
          return of(this.wishlistLocalStorage.get());
        }

        const wishlistCollection = collection(this.firestore, `users/${user.uid}/wishlist`);

        return from(collectionData(wishlistCollection, { idField: 'id' })) as Observable<
          WishlistItem[]
        >;
      })
    );
  }

  public create(productId: string): Observable<void> {
    const user = this.user();

    return defer(() => {
      if (!user) {
        this.wishlistLocalStorage.add(productId);

        return of(undefined);
      }

      const docRef = doc(this.firestore, `users/${user.uid}/wishlist/${productId}`);

      return setDoc(docRef, { productId });
    });
  }

  public delete(productId: string): Observable<void> {
    const user = this.user();

    return defer(() => {
      if (!user) {
        this.wishlistLocalStorage.remove(productId);

        return of(undefined);
      }

      const docRef = doc(this.firestore, `users/${user.uid}/wishlist/${productId}`);

      return deleteDoc(docRef);
    });
  }

  public deleteAll(): Observable<void> {
    const user = this.user();

    return defer(() => {
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
          snapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });

          return from(batch.commit());
        })
      );
    });
  }
}
