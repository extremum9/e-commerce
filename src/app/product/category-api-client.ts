import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CategoryApiClient {
  private readonly categories = ['all', 'electronics', 'clothing', 'accessories', 'home'] as const;

  public list(): readonly string[] {
    return this.categories;
  }
}
