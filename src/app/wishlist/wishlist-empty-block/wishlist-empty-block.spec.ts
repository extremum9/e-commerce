import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { provideRouter } from '@angular/router';

import { WishlistEmptyBlock } from './wishlist-empty-block';

describe(WishlistEmptyBlock.name, () => {
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
    const fixture = TestBed.createComponent(WishlistEmptyBlock);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    return { loader };
  };

  it('should display link pointing to /products', async () => {
    const { loader } = await setup();
    const linkHarness = await loader.getHarness(
      MatButtonHarness.with({
        selector: '[data-testid=wishlist-empty-cta-link]',
        appearance: 'filled'
      })
    );

    expect(await linkHarness.getText()).toContain('Start Shopping');
    expect(await (await linkHarness.host()).getAttribute('href')).toBe('/products');
  });
});
