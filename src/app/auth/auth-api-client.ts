import { inject, Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthApiClient {
  private readonly auth = inject(Auth);

  public login(credentials: { email: string; password: string }): Observable<void> {
    return from(
      signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)
    ).pipe(map(() => undefined));
  }
}
