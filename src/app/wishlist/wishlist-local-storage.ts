import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { WishlistItem } from '../models/wishlist-item';

const WISHLIST_KEY = 'e-commerce-wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistLocalStorage {
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

  private save(wishlist: WishlistItem[]): void {
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
      this.change$.next();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving wishlist data to local storage:', error);
    }
  }
}
