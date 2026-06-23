import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  documentId,
  Firestore,
  orderBy,
  query,
  QueryConstraint,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductApiClient {
  private readonly productsCollection = collection(inject(Firestore), 'products');

  public list(category = 'all'): Observable<Product[]> {
    const constraints: QueryConstraint[] = [orderBy('inStock', 'desc')];
    if (category !== 'all') {
      constraints.push(where('category', '==', category));
    }

    return collectionData(query(this.productsCollection, ...constraints), {
      idField: 'id'
    }) as Observable<Product[]>;
  }

  public listByIds(ids: string[]): Observable<Product[]> {
    return collectionData(query(this.productsCollection, where(documentId(), 'in', ids)), {
      idField: 'id'
    }) as Observable<Product[]>;
  }

  public get(id: string): Observable<Product> {
    return docData(doc(this.productsCollection, id), { idField: 'id' }) as Observable<Product>;
  }
}
