import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { Navbar } from './navbar/navbar';
import { AuthApiClient } from './auth/auth-api-client';

@Component({
  selector: 'app-root',
  template: `
    @if (user() !== undefined) {
      <app-navbar />
      <router-outlet />
    }
  `,
  imports: [Navbar, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly user = inject(AuthApiClient).currentUser;

  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIcon('google', sanitizer.bypassSecurityTrustResourceUrl('google-logo.svg'));
  }
}
