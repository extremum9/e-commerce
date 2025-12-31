import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  template: `
    <h1>AuthDialog works!</h1>
    <router-outlet />
  `,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AuthDialog {}
