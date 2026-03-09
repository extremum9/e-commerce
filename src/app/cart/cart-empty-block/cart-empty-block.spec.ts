import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { provideDisabledAnimations } from '../../testing-utils';

import { CartEmptyBlock } from './cart-empty-block';

describe(CartEmptyBlock.name, () => {
  const setup = async () => {
    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [provideZonelessChangeDetection(), provideDisabledAnimations()]
    });
    const fixture = TestBed.createComponent(CartEmptyBlock);
    await fixture.whenStable();

    return { fixture };
  };

  it('should display title', async () => {
    const { fixture } = await setup();
    const titleDebugElement = fixture.debugElement.query(By.css('[data-testid=cart-empty-title]'));

    expect(titleDebugElement).toBeTruthy();
    expect(titleDebugElement.nativeElement.textContent).toContain('Your cart is empty');
  });
});
