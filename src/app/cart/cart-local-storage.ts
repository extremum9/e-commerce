import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CartItem } from '../models/cart-item';

const CART_KEY_STORAGE = 'e-commerce-cart';

@Injectable({
  providedIn: 'root'
})
export class CartLocalStorage {
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

  private save(cart: CartItem[]): void {
    try {
      window.localStorage.setItem(CART_KEY_STORAGE, JSON.stringify(cart));
      this.change$.next();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving cart items to local storage:', error);
    }
  }
}
