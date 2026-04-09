import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { collection, collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';

import { Review } from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewApiClient {
  private readonly firestore = inject(Firestore);

  public list(productId: string): Observable<Review[]> {
    const colRef = collection(this.firestore, `products/${productId}/reviews`);

    return collectionData(query(colRef, orderBy('createdAt', 'desc')), {
      idField: 'id'
    }) as Observable<Review[]>;
  }
}
