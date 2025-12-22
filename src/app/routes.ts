import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products/all'
  },
  {
    path: 'products/:category',
    loadComponent: () => import('./product-list/product-list')
  }
];
