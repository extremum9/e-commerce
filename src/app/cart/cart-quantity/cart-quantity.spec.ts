import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { By } from '@angular/platform-browser';

import { provideDisabledAnimations } from '../../testing-utils';

import { CartQuantity } from './cart-quantity';

describe(CartQuantity.name, () => {
  const setup = async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideDisabledAnimations()]
    });
    const fixture = TestBed.createComponent(CartQuantity);
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.componentRef.setInput('quantity', 2);
    await fixture.whenStable();

    const getDecrementButtonHarness = () =>
      loader.getHarness(
        MatButtonHarness.with({ selector: '[data-testid=cart-quantity-decrement-button]' })
      );
    const getIncrementButtonHarness = () =>
      loader.getHarness(
        MatButtonHarness.with({ selector: '[data-testid=cart-quantity-increment-button]' })
      );

    return { fixture, debugElement, loader, getDecrementButtonHarness, getIncrementButtonHarness };
  };

  it('should display decrement button and disable it if quantity is 1', async () => {
    const { fixture, getDecrementButtonHarness } = await setup();
    const buttonHarness = await getDecrementButtonHarness();
    const buttonIconHarness = await buttonHarness.getHarness(MatIconHarness);

    expect(await buttonHarness.isDisabled()).toBe(false);
    expect(await buttonIconHarness.getName()).toBe('remove');

    fixture.componentRef.setInput('quantity', 1);

    expect(await buttonHarness.isDisabled()).toBe(true);
  });

  it('should display increment button', async () => {
    const { getIncrementButtonHarness } = await setup();
    const buttonHarness = await getIncrementButtonHarness();
    const buttonIconHarness = await buttonHarness.getHarness(MatIconHarness);

    expect(await buttonIconHarness.getName()).toBe('add');
  });

  it('should  display quantity', async () => {
    const { debugElement } = await setup();
    const quantityDebugElement = debugElement.query(By.css('[data-testid=cart-quantity]'));

    expect(quantityDebugElement).toBeTruthy();
    expect(quantityDebugElement.nativeElement.textContent).toContain('2');
  });

  it('should emit output event on increment/decrement', async () => {
    const { fixture, getDecrementButtonHarness, getIncrementButtonHarness } = await setup();
    const updatedSpy = spyOn(fixture.componentInstance.updated, 'emit');

    const incrementButtonHarness = await getIncrementButtonHarness();
    await incrementButtonHarness.click();

    expect(updatedSpy).toHaveBeenCalledWith(3);

    const decrementButtonHarness = await getDecrementButtonHarness();
    await decrementButtonHarness.click();

    expect(updatedSpy).toHaveBeenCalledWith(1);
  });
});
