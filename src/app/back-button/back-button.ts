import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-back-button',
  template: `
    <a class="-ms-2" matButton="text" [routerLink]="navigateTo()">
      <mat-icon>arrow_back</mat-icon>
      <ng-content />
    </a>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  imports: [MatButton, MatIcon, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackButton {
  public readonly navigateTo = input.required<string>();
}
