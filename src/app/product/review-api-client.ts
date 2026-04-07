import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';

import { Review } from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewApiClient {
  private readonly firestore = inject(Firestore);

  public list(productId: string): Observable<Review[]> {
    const colRef = collection(this.firestore, `products/${productId}/reviews`);

    return collectionData(colRef, { idField: 'id' }) as Observable<Review[]>;
  }
}
