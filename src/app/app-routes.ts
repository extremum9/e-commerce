import { Routes } from '@angular/router';

import { productCategoryMatcher } from './utils';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products'
  },
  {
    matcher: productCategoryMatcher,
    loadComponent: () => import('./product/product-list/product-list')
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./wishlist/wishlist')
  }
];
