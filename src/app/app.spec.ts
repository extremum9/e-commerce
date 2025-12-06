import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

import { App } from './app';
import { Navbar } from './navbar/navbar';

describe(App.name, () => {
  const setup = () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    });
    const fixture = TestBed.createComponent(App);
    const debugElement = fixture.debugElement;
    fixture.detectChanges();

    return { fixture, debugElement };
  };

  it('should have a navbar', () => {
    const { debugElement } = setup();
    expect(debugElement.query(By.directive(Navbar))).toBeTruthy();
  });
});
