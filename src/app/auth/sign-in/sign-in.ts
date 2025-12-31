import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  template: `<h1>SignIn works!</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignIn {}
