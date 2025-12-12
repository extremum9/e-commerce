import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar />
    <router-outlet />
  `,
  imports: [Navbar, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
