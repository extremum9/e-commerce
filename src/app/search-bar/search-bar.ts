import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

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
      />
      <button class="small" matIconButton type="button">
        <mat-icon>close</mat-icon>
      </button>
    </search>
  `,
  imports: [MatIcon, MatIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBar {}
