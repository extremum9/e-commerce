import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';

import { provideDisabledAnimations } from '../../testing-utils';

import { CartWishlistPreview } from './cart-wishlist-preview';

describe(CartWishlistPreview.name, () => {
  const setup = async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideDisabledAnimations(), provideRouter([])]
    });
    const fixture = TestBed.createComponent(CartWishlistPreview);
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.componentRef.setInput('count', 1);
    await fixture.whenStable();

    return { fixture, debugElement, loader };
  };

  it('should display title and description', async () => {
    const { debugElement } = await setup();

    const title = debugElement.query(By.css('[data-testid=cart-wishlist-preview-title]'));
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent).toContain('Wishlist (1)');

    const description = debugElement.query(
      By.css('[data-testid=cart-wishlist-preview-description]')
    );
    expect(description).toBeTruthy();
    expect(description.nativeElement.textContent).toContain('You have 1 items saved for later');
  });

  it('should display view-all link', async () => {
    const { loader } = await setup();
    const linkHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=cart-wishlist-preview-view-all-link]' })
    );
    const linkHost = await linkHarness.host();

    expect(await linkHarness.getText()).toContain('View All');
    expect(await linkHost.getAttribute('href')).toBe('/wishlist');
  });

  it('should display add-all-to-cart button and emit output event on click, if not empty', async () => {
    const { fixture, loader } = await setup();
    const allAddedSpy = spyOn(fixture.componentInstance.allAdded, 'emit');

    const buttonHarness = await loader.getHarness(
      MatButtonHarness.with({
        selector: '[data-testid=cart-wishlist-preview-add-all-button]',
        appearance: 'filled'
      })
    );
    expect(await buttonHarness.getText()).toContain('Add All to Cart');

    const iconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await iconHarness.getName()).toBe('shopping_cart');

    await buttonHarness.click();

    expect(allAddedSpy).toHaveBeenCalled();

    fixture.componentRef.setInput('count', 0);

    expect(
      await loader.hasHarness(
        MatButtonHarness.with({ selector: '[data-testid=cart-wishlist-preview-add-all-button]' })
      )
    ).toBe(false);
  });
});
