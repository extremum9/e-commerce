import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CategoryApiClient {
  private readonly categories = ['all', 'electronics', 'clothing', 'accessories', 'home'] as const;

  public readonly currentCategory = signal('all');

  public list(): readonly string[] {
    return this.categories;
  }
}
