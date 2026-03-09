import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { provideDisabledAnimations } from '../../testing-utils';

import { WishlistEmptyBlock } from './wishlist-empty-block';

describe(WishlistEmptyBlock.name, () => {
  const setup = async () => {
    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [provideZonelessChangeDetection(), provideRouter([]), provideDisabledAnimations()]
    });
    const fixture = TestBed.createComponent(WishlistEmptyBlock);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    return { fixture, loader };
  };

  it('should display title', async () => {
    const { fixture } = await setup();
    const titleDebugElement = fixture.debugElement.query(
      By.css('[data-testid=wishlist-empty-title]')
    );

    expect(titleDebugElement).toBeTruthy();
    expect(titleDebugElement.nativeElement.textContent).toContain('Your wishlist is empty');
  });

  it('should display link pointing to /products', async () => {
    const { loader } = await setup();
    const linkHarness = await loader.getHarness(
      MatButtonHarness.with({
        selector: '[data-testid=wishlist-empty-link]',
        appearance: 'filled'
      })
    );

    expect(await linkHarness.getText()).toContain('Start Shopping');
    expect(await (await linkHarness.host()).getAttribute('href')).toBe('/products');
  });
});
