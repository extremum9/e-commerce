import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';

import { App } from './app';
import { Navbar } from './navbar/navbar';
import { AuthApiClient } from './auth/auth-api-client';
import { CurrentUser } from './models/current-user';
import { provideDisabledAnimations } from './testing-utils';

@Component({
  selector: 'app-navbar',
  template: ''
})
class NavbarStub {}

describe(App.name, () => {
  const setup = async () => {
    const currentUser = signal<CurrentUser | null | undefined>(null);
    const authApiClientSpy = jasmine.createSpyObj<AuthApiClient>('AuthApiClient', [], {
      currentUser
    });

    TestBed.overrideComponent(App, {
      remove: {
        imports: [Navbar]
      },
      add: {
        imports: [NavbarStub]
      }
    });
    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideDisabledAnimations(),
        {
          provide: AuthApiClient,
          useValue: authApiClientSpy
        }
      ]
    });
    const fixture = TestBed.createComponent(App);
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    const hasSpinnerHarness = () =>
      loader.hasHarness(
        MatProgressSpinnerHarness.with({ selector: '[data-testid=loading-app-spinner]' })
      );

    return { debugElement, hasSpinnerHarness, currentUser };
  };

  describe('User is undefined', () => {
    it('should display spinner', async () => {
      const { debugElement, hasSpinnerHarness, currentUser } = await setup();
      currentUser.set(undefined);

      expect(await hasSpinnerHarness()).toBe(true);
      expect(debugElement.query(By.directive(NavbarStub))).toBeFalsy();
      expect(debugElement.query(By.directive(RouterOutlet))).toBeFalsy();
      currentUser.set(null);
      expect(await hasSpinnerHarness()).toBe(false);
    });
  });

  describe('User is defined', () => {
    it('should display navbar', async () => {
      const { debugElement } = await setup();
      expect(debugElement.query(By.directive(NavbarStub))).toBeTruthy();
    });

    it('should have router outlet', async () => {
      const { debugElement } = await setup();
      expect(debugElement.query(By.directive(RouterOutlet))).toBeTruthy();
    });
  });
});
