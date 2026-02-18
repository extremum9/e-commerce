import { inject, Injectable } from '@angular/core';
import { concatMap, filter, from, map, Observable, switchMap } from 'rxjs';
import {
  Auth,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  user
} from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

import { LoginCredentials } from '../models/login-credentials';
import { RegisterCredentials } from '../models/register-credentials';
import { CurrentUser } from '../models/current-user';
import { WishlistLocalStorage } from '../wishlist/wishlist-local-storage';

@Injectable({
  providedIn: 'root'
})
export class AuthApiClient {
  private readonly auth = inject(Auth);

  public readonly currentUser$: Observable<CurrentUser | null> = user(this.auth).pipe(
    map((user) =>
      user
        ? {
            uid: user.uid,
            name: user.displayName ?? '',
            email: user.email ?? '',
            imageUrl: user.photoURL
          }
        : null
    )
  );
  public readonly currentUser = toSignal<CurrentUser | null | undefined>(this.currentUser$, {
    initialValue: undefined
  });

  constructor() {
    const wishlistLocalStorage = inject(WishlistLocalStorage);

    this.currentUser$
      .pipe(
        filter(Boolean),
        concatMap((user) => wishlistLocalStorage.syncToFirestore(user.uid))
      )
      .subscribe();
  }

  public login({ email, password, rememberMe }: LoginCredentials): Observable<void> {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;

    return from(this.auth.setPersistence(persistence)).pipe(
      switchMap(() =>
        from(signInWithEmailAndPassword(this.auth, email, password)).pipe(map(() => undefined))
      )
    );
  }

  public loginWithGoogle(): Observable<void> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(map(() => undefined));
  }

  public register({ name, email, password }: RegisterCredentials): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) =>
        from(updateProfile(user, { displayName: name })).pipe(switchMap(() => from(user.reload())))
      ),
      map(() => undefined)
    );
  }

  public resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  public logout(): Observable<void> {
    return from(this.auth.signOut());
  }
}
