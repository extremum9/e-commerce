import { inject, Injectable } from '@angular/core';
import { forkJoin, from, map, Observable, of, Subject, tap } from 'rxjs';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

import { WishlistItem } from '../models/wishlist-item';

const WISHLIST_KEY = 'e-commerce-wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistLocalStorage {
  private readonly firestore = inject(Firestore);

  public readonly change$ = new Subject<void>();

  public get(): WishlistItem[] {
    try {
      return JSON.parse(window.localStorage.getItem(WISHLIST_KEY) || '[]');
    } catch {
      return [];
    }
  }

  public add(productId: string): void {
    const wishlist = this.get();
    if (wishlist.some((item) => item.productId === productId)) {
      return;
    }

    const updated = [...wishlist, { id: crypto.randomUUID(), productId }];

    this.save(updated);
  }

  public remove(productId: string): void {
    const wishlist = this.get();
    const filtered = wishlist.filter((item) => item.productId !== productId);

    this.save(filtered);
  }

  public syncToFirestore(userId: string): Observable<void> {
    const wishlist = this.get();
    if (!wishlist.length) {
      return of(undefined);
    }

    const batch$ = wishlist.map(({ productId }) => {
      const docRef = doc(this.firestore, `users/${userId}/wishlist/${productId}`);

      return from(setDoc(docRef, { productId }, { merge: true }));
    });

    return forkJoin(batch$).pipe(
      tap(() => this.clear()),
      map(() => undefined)
    );
  }

  private save(wishlist: WishlistItem[]): void {
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
      this.change$.next();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving wishlist data to local storage:', error);
    }
  }

  private clear(): void {
    window.localStorage.removeItem(WISHLIST_KEY);
  }
}
