import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-register-form',
  template: `<h1>RegisterForm works!</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterForm {}
