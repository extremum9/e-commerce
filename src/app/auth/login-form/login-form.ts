import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-login-form',
  template: `<h1>LoginForm works!</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginForm {}
