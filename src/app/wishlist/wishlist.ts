import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  template: `<h1>Wishlist</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Wishlist {}
