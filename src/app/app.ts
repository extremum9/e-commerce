import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  template: `<h1>Welcome to {{ title() }}!</h1>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('e-commerce');
}
