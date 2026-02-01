import { TestBed } from '@angular/core/testing';
import { MatIconHarness, MatIconTestingModule } from '@angular/material/icon/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

import { ToggleWishlistButton } from './toggle-wishlist-button';

describe(ToggleWishlistButton.name, () => {
  const setup = async () => {
    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: MATERIAL_ANIMATIONS,
          useValue: { animationsDisabled: true }
        }
      ]
    });
    const fixture = TestBed.createComponent(ToggleWishlistButton);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.componentRef.setInput('favorite', false);
    await fixture.whenStable();

    const getButton = () =>
      loader.getHarness(
        MatButtonHarness.with({
          selector: '[data-testid=toggle-wishlist-button]',
          variant: 'mini-fab'
        })
      );

    return { fixture, loader, getButton };
  };

  it('should display as unfavorite', async () => {
    const { getButton } = await setup();

    const button = await getButton();
    const buttonHost = await button.host();
    expect(await buttonHost.hasClass('text-red-500!'))
      .withContext('button class')
      .toBe(false);

    const icon = await button.getHarness(MatIconHarness);
    expect(await icon.getName())
      .withContext('button icon')
      .toBe('favorite_border');
  });

  it('should display as favorite', async () => {
    const { fixture, getButton } = await setup();
    fixture.componentRef.setInput('favorite', true);
    await fixture.whenStable();

    const button = await getButton();
    const buttonHost = await button.host();
    expect(await buttonHost.hasClass('text-red-500!'))
      .withContext('button class')
      .toBe(true);

    const icon = await button.getHarness(MatIconHarness);
    expect(await icon.getName())
      .withContext('button icon')
      .toBe('favorite');
  });

  it('should emit output event on click', async () => {
    const { fixture, getButton } = await setup();
    const toggledSpy = spyOn(fixture.componentInstance.toggled, 'emit');

    const button = await getButton();
    await button.click();

    expect(toggledSpy).toHaveBeenCalled();
  });
});
