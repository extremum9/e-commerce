import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { App } from './app';
import { Navbar } from './navbar/navbar';
import { AuthApiClient } from './auth/auth-api-client';
import { CurrentUser } from './models/current-user';

describe(App.name, () => {
  const setup = () => {
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
    fixture.detectChanges();

    return { fixture, debugElement, currentUser };
  };

  it('should display nothing if the user is undefined', () => {
    const { fixture, debugElement, currentUser } = setup();
    currentUser.set(undefined);

    fixture.detectChanges();

    expect(debugElement.query(By.directive(Navbar))).toBeFalsy();
    expect(debugElement.query(By.directive(RouterOutlet))).toBeFalsy();
  });

  it('should display a navbar along with a router outlet if the user is defined', () => {
    const { debugElement } = setup();

    expect(debugElement.query(By.directive(Navbar))).toBeTruthy();
    expect(debugElement.query(By.directive(RouterOutlet))).toBeTruthy();
  });
});
