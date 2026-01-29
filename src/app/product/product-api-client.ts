import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  documentId,
  Firestore,
  orderBy,
  query,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductApiClient {
  private readonly productsCollection = collection(inject(Firestore), 'products');

  public list(): Observable<Product[]> {
    return collectionData(query(this.productsCollection, orderBy('inStock', 'desc')), {
      idField: 'id'
    }) as Observable<Product[]>;
  }

  public listByCategory(category: string): Observable<Product[]> {
    return collectionData(
      query(this.productsCollection, where('category', '==', category), orderBy('inStock', 'desc')),
      {
        idField: 'id'
      }
    ) as Observable<Product[]>;
  }

  public listByIds(ids: string[]): Observable<Product[]> {
    return collectionData(query(this.productsCollection, where(documentId(), 'in', ids)), {
      idField: 'id'
    }) as Observable<Product[]>;
  }
}
