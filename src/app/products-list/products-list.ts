import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-products-list',
  template: `<h1>Products list</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductsList {}
