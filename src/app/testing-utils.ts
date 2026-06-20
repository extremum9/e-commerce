import { Provider } from '@angular/core';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { Timestamp } from '@angular/fire/firestore';

import { Product } from './models/product';
import { CurrentUser } from './models/current-user';
import { OrderSummary } from './models/order-summary';
import { Review } from './models/review';

export const provideDisabledAnimations = (): Provider => ({
  provide: MATERIAL_ANIMATIONS,
  useValue: { animationsDisabled: true }
});

export const createMockUser = (user: Partial<CurrentUser> = {}): CurrentUser => ({
  uid: '1',
  name: 'test name',
  email: 'test@mail.com',
  imageUrl: 'https://placehold.co/20x20/png',
  ...user
});

export const createMockProduct = (product: Partial<Product> = {}): Product => ({
  id: '1',
  name: 'test name',
  description: 'test description',
  category: 'test-category',
  price: 99.99,
  imageUrl: 'https://placehold.co/400x400/png',
  rating: 4.5,
  reviewCount: 10,
  inStock: true,
  favorite: false,
  ...product
});

export const createMockOrderSummary = (summary: Partial<OrderSummary> = {}): OrderSummary => ({
  subtotal: 1000,
  tax: 100.5,
  total: 1100.5,
  ...summary
});

export const createMockReview = (
  { review, author }: { review?: Partial<Review>; author?: Partial<CurrentUser> } = {
    review: {},
    author: {}
  }
): Review => ({
  id: '1',
  title: 'test title',
  body: 'test body',
  rating: 5,
  createdAt: Timestamp.now(),
  author: createMockUser(author),
  ...review
});
