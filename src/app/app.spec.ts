import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';

import { App } from './app';
import { Navbar } from './navbar/navbar';
import { AuthApiClient } from './auth/auth-api-client';
import { CurrentUser } from './models/current-user';

describe(App.name, () => {
  const setup = async () => {
    const currentUser = signal<CurrentUser | null | undefined>(null);
    const authApiClientSpy = jasmine.createSpyObj<AuthApiClient>('AuthApiClient', [], {
      currentUser
    });

    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
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

    const hasSpinner = () =>
      loader.hasHarness(
        MatProgressSpinnerHarness.with({ selector: '[data-testid=loading-app-spinner]' })
      );

    return { debugElement, hasSpinner, currentUser };
  };

  it('should display spinner if user is undefined', async () => {
    const { debugElement, hasSpinner, currentUser } = await setup();
    currentUser.set(undefined);

    const spinner = await hasSpinner();

    expect(spinner).withContext('spinner').toBe(true);
    expect(debugElement.query(By.directive(Navbar)))
      .withContext('Navbar')
      .toBeFalsy();
    expect(debugElement.query(By.directive(RouterOutlet)))
      .withContext('RouterOutlet')
      .toBeFalsy();
  });

  it('should display navbar along with router outlet if user is defined', async () => {
    const { debugElement, hasSpinner } = await setup();

    const spinner = await hasSpinner();

    expect(spinner).withContext('spinner').toBe(false);
    expect(debugElement.query(By.directive(Navbar)))
      .withContext('Navbar')
      .toBeTruthy();
    expect(debugElement.query(By.directive(RouterOutlet)))
      .withContext('RouterOutlet')
      .toBeTruthy();
  });
});
