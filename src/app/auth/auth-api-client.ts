import { inject, Injectable } from '@angular/core';
import { from, map, Observable, tap } from 'rxjs';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

import { LoginCredentials } from '../models/login-credentials';
import { RegisterCredentials } from '../models/register-credentials';
import { CurrentUser } from '../models/current-user';

@Injectable({
  providedIn: 'root'
})
export class AuthApiClient {
  private readonly auth = inject(Auth);

  private readonly user$ = authState(this.auth).pipe(
    map((user) =>
      user ? { name: user.displayName!, email: user.email!, imageUrl: user.photoURL } : null
    )
  );
  public readonly currentUser = toSignal<CurrentUser | null>(this.user$, { initialValue: null });

  public login({ email, password }: LoginCredentials): Observable<void> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(map(() => undefined));
  }

  public loginWithGoogle(): Observable<void> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(map(() => undefined));
  }

  public register({ name, email, password }: RegisterCredentials): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      tap((response) => updateProfile(response.user, { displayName: name })),
      map(() => undefined)
    );
  }
}
