import { inject, Injectable } from '@angular/core';
import { doc, Firestore, increment, setDoc } from '@angular/fire/firestore';
import { defer, Observable, of } from 'rxjs';

import { AuthApiClient } from '../auth/auth-api-client';

@Injectable({
  providedIn: 'root'
})
export class CartApiClient {
  private readonly firestore = inject(Firestore);

  private readonly user = inject(AuthApiClient).currentUser;

  public create(productId: string): Observable<void> {
    const user = this.user();
    if (!user) {
      return of(undefined);
    }

    const docRef = doc(this.firestore, `users/${user.uid}/cart/${productId}`);

    return defer(() => setDoc(docRef, { quantity: increment(1) }, { merge: true }));
  }
}
