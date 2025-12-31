import { Routes } from '@angular/router';

import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';

const AUTH_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sign-in'
  },
  {
    path: 'sign-in',
    component: SignIn
  },
  {
    path: 'sign-up',
    component: SignUp
  }
];

export default AUTH_ROUTES;
