import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';

import { provideDisabledAnimations } from '../../testing-utils';

import { CartEmptyBlock } from './cart-empty-block';

describe(CartEmptyBlock.name, () => {
  const setup = async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([]), provideDisabledAnimations()]
    });
    const fixture = TestBed.createComponent(CartEmptyBlock);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    return { fixture, loader };
  };

  it('should display title', async () => {
    const { fixture } = await setup();
    const title = fixture.debugElement.query(By.css('[data-testid=cart-empty-title]'));

    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent).toContain('Your cart is empty');
  });
});
