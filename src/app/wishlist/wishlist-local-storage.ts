import { inject, Injectable } from '@angular/core';
import { defer, from, Observable, of, Subject, tap } from 'rxjs';
import { doc, Firestore, writeBatch } from '@angular/fire/firestore';

const WISHLIST_STORAGE_KEY = 'e-commerce-wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistLocalStorage {
  private readonly firestore = inject(Firestore);

  public readonly refresh$ = new Subject<void>();

  public get(): string[] {
    try {
      return JSON.parse(window.localStorage.getItem(WISHLIST_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  public add(productId: string): void {
    const wishlist = this.get();
    if (wishlist.some((id) => id === productId)) {
      return;
    }

    this.save([...wishlist, productId]);
  }

  public remove(productId: string): void {
    const wishlist = this.get();
    const filtered = wishlist.filter((id) => id !== productId);

    this.save(filtered);
  }

  public clear(): void {
    window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
    this.refresh$.next();
  }

  public syncToFirestore(userId: string): Observable<void> {
    return defer(() => {
      const wishlist = this.get();
      if (!wishlist.length) {
        return of(undefined);
      }

      const batch = writeBatch(this.firestore);
      wishlist.forEach((productId) => {
        const docRef = doc(this.firestore, `users/${userId}/wishlist/${productId}`);
        batch.set(docRef, { productId }, { merge: true });
      });

      return from(batch.commit()).pipe(tap(() => this.clear()));
    });
  }

  private save(wishlist: string[]): void {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      this.refresh$.next();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving wishlist items to local storage:', error);
    }
  }
}
