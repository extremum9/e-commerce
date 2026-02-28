import { inject, Injectable } from '@angular/core';
import { defer, from, Observable, of, Subject, tap } from 'rxjs';
import { doc, Firestore, writeBatch } from '@angular/fire/firestore';

import { CartItem } from '../models/cart-item';

const CART_KEY_STORAGE = 'e-commerce-cart';

@Injectable({
  providedIn: 'root'
})
export class CartLocalStorage {
  private readonly firestore = inject(Firestore);

  public readonly change$ = new Subject<void>();

  public get(): CartItem[] {
    try {
      return JSON.parse(window.localStorage.getItem(CART_KEY_STORAGE) || '[]');
    } catch {
      return [];
    }
  }

  public add(productId: string, quantity?: number): void {
    const cart = this.get();
    const existingItem = cart.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity = quantity ?? existingItem.quantity + 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }
    this.save(cart);
  }

  public addMany(productIds: string[]): void {
    const cart = this.get();
    productIds.forEach((productId) => {
      if (!cart.some((item) => item.productId === productId)) {
        cart.push({ productId, quantity: 1 });
      }
    });
    this.save(cart);
  }

  public remove(productId: string): void {
    const cart = this.get();
    const filtered = cart.filter((item) => item.productId !== productId);

    this.save(filtered);
  }

  public syncToFirestore(userId: string): Observable<void> {
    return defer(() => {
      const cart = this.get();
      if (!cart.length) {
        return of(undefined);
      }

      const batch = writeBatch(this.firestore);
      cart.forEach(({ productId, quantity }) => {
        const docRef = doc(this.firestore, `users/${userId}/cart/${productId}`);
        batch.set(docRef, { quantity });
      });

      return from(batch.commit()).pipe(tap(() => this.clear()));
    });
  }

  private save(cart: CartItem[]): void {
    try {
      window.localStorage.setItem(CART_KEY_STORAGE, JSON.stringify(cart));
      this.change$.next();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving cart items to local storage:', error);
    }
  }

  private clear(): void {
    window.localStorage.removeItem(CART_KEY_STORAGE);
  }
}
