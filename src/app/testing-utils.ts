import { Provider } from '@angular/core';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';

import { Product } from './models/product';
import { CurrentUser } from './models/current-user';

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
