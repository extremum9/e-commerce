import { inject, Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from '@angular/fire/firestore';

import { Review } from '../models/review';
import { AuthApiClient } from '../auth/auth-api-client';

@Injectable({
  providedIn: 'root'
})
export class ReviewApiClient {
  private readonly firestore = inject(Firestore);
  private readonly user = inject(AuthApiClient).currentUser;

  public list(productId: string): Observable<Review[]> {
    const colRef = collection(this.firestore, `products/${productId}/reviews`);

    return collectionData(query(colRef, orderBy('createdAt', 'desc')), {
      idField: 'id'
    }) as Observable<Review[]>;
  }

  public create({
    productId,
    title,
    body,
    rating
  }: {
    productId: string;
    title: string;
    body: string;
    rating: number;
  }): Observable<void> {
    return defer(() => {
      const user = this.user();
      if (!user) {
        throw new Error('User is not authenticated');
      }

      const colRef = collection(this.firestore, `products/${productId}/reviews`);

      return setDoc(doc(colRef), {
        title,
        body,
        rating,
        createdAt: serverTimestamp(),
        author: {
          uid: user.uid,
          name: user.name,
          imageUrl: user.imageUrl
        }
      });
    });
  }
}
