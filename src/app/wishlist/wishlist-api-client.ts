import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  setDoc
} from '@angular/fire/firestore';
import { defer, from, Observable, of, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

import { AuthApiClient } from '../auth/auth-api-client';
import { WishlistItem } from '../models/wishlist-item';

@Injectable({
  providedIn: 'root'
})
export class WishlistApiClient {
  private readonly firestore = inject(Firestore);
  private readonly user = inject(AuthApiClient).currentUser;

  public list(): Observable<WishlistItem[]> {
    return toObservable(this.user).pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
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
    if (!user) {
      return of(undefined);
    }

    const docRef = doc(this.firestore, `users/${user.uid}/wishlist/${productId}`);

    return defer(() => setDoc(docRef, { productId }));
  }

  public delete(productId: string): Observable<void> {
    const user = this.user();
    if (!user) {
      return of(undefined);
    }

    const docRef = doc(this.firestore, `users/${user.uid}/wishlist/${productId}`);

    return defer(() => deleteDoc(docRef));
  }
}
