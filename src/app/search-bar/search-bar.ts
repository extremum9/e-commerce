import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';

import { CategoryApiClient } from '../product/category-api-client';

@Component({
  selector: 'app-search-bar',
  template: `
    <search
      class="flex items-center gap-x-2 max-w-200 min-h-12 mx-auto px-4 border border-gray-200 rounded-lg bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-200"
    >
      <mat-icon class="text-gray-400">search</mat-icon>
      <input
        class="flex-1 outline-none text-gray-700 text-sm bg-transparent placeholder-gray-400"
        type="search"
        placeholder="Search products..."
        [formControl]="input"
      />
      <button class="small" matIconButton type="button">
        <mat-icon>close</mat-icon>
      </button>
    </search>
  `,
  imports: [MatIcon, MatIconButton, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBar {
  private readonly router = inject(Router);
  private readonly categoryApiClient = inject(CategoryApiClient);

  protected readonly input = inject(NonNullableFormBuilder).control('');

  constructor() {
    this.input.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((term) => {
      const trimmed = term.toLowerCase().trim();
      const category = this.categoryApiClient.currentCategory();

      this.router.navigate([`/products/${category === 'all' ? '' : category}`], {
        queryParams: trimmed ? { search: trimmed } : {}
      });
    });
  }
}
