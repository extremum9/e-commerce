import { TestBed } from '@angular/core/testing';
import { MatIconHarness, MatIconTestingModule } from '@angular/material/icon/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

import { provideDisabledAnimations } from '../../testing-utils';

import { ToggleWishlistButton } from './toggle-wishlist-button';

describe(ToggleWishlistButton.name, () => {
  const setup = async () => {
    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [provideZonelessChangeDetection(), provideDisabledAnimations()]
    });
    const fixture = TestBed.createComponent(ToggleWishlistButton);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.componentRef.setInput('favorite', false);
    await fixture.whenStable();

    const getButtonHarness = () =>
      loader.getHarness(
        MatButtonHarness.with({
          selector: '[data-testid=toggle-wishlist-button]',
          variant: 'mini-fab'
        })
      );

    return { fixture, loader, getButtonHarness };
  };

  it('should display as unfavorite', async () => {
    const { getButtonHarness } = await setup();

    const buttonHarness = await getButtonHarness();
    const buttonHost = await buttonHarness.host();
    expect(await buttonHost.hasClass('text-red-500!')).toBe(false);

    const iconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await iconHarness.getName()).toBe('favorite_border');
  });

  it('should display as favorite', async () => {
    const { fixture, getButtonHarness } = await setup();
    fixture.componentRef.setInput('favorite', true);
    await fixture.whenStable();

    const buttonHarness = await getButtonHarness();
    const buttonHost = await buttonHarness.host();
    expect(await buttonHost.hasClass('text-red-500!')).toBe(true);

    const iconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await iconHarness.getName()).toBe('favorite');
  });

  it('should emit output event on click', async () => {
    const { fixture, getButtonHarness } = await setup();
    const toggledSpy = spyOn(fixture.componentInstance.toggled, 'emit');

    const buttonHarness = await getButtonHarness();
    await buttonHarness.click();

    expect(toggledSpy).toHaveBeenCalled();
  });
});
