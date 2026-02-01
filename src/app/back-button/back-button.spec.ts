import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';

import { BackButton } from './back-button';

@Component({
  template: `<app-back-button [navigateTo]="navigateTo()">test</app-back-button>`,
  imports: [BackButton]
})
class BackButtonTestHost {
  navigateTo = signal('/test');
}

describe(BackButton.name, () => {
  const setup = async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: MATERIAL_ANIMATIONS,
          useValue: { animationsDisabled: true }
        }
      ]
    });
    const fixture = TestBed.createComponent(BackButtonTestHost);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    return { fixture, loader };
  };

  it('should display button with icon', async () => {
    const { fixture, loader } = await setup();

    const buttonHarness = await loader.getHarness(
      MatButtonHarness.with({
        selector: '[data-testid=back-button]',
        appearance: 'text'
      })
    );
    const buttonHost = await buttonHarness.host();
    expect(await buttonHost.getAttribute('href')).toBe(fixture.componentInstance.navigateTo());

    const iconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await iconHarness.getName()).toBe('arrow_back');
  });

  it('should project content', async () => {
    const { fixture } = await setup();

    expect(fixture.debugElement.nativeElement.textContent).toContain('test');
  });
});
