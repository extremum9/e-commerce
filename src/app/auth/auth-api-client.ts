import { inject, Injectable } from '@angular/core';
import { from, map, Observable, tap } from 'rxjs';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from '@angular/fire/auth';

import { LoginCredentials, RegisterCredentials } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthApiClient {
  private readonly auth = inject(Auth);

  public login({ email, password }: LoginCredentials): Observable<void> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(map(() => undefined));
  }

  public register({ name, email, password }: RegisterCredentials): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      tap((response) => updateProfile(response.user, { displayName: name })),
      map(() => undefined)
    );
  }
}
