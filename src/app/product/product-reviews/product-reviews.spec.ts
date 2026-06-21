import { Component, input, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';
import { MatButtonHarness } from '@angular/material/button/testing';

import { createMockReview, provideDisabledAnimations } from '../../testing-utils';
import { Review } from '../../models/review';
import { ProductReviewSummary } from '../product-review-summary/product-review-summary';
import { ProductReview } from '../product-review/product-review';

import { ProductReviews } from './product-reviews';

@Component({
  template: `<app-product-reviews
    [reviews]="mockReviews()"
    [rating]="mockRating()"
    (writeDialogOpened)="writeDialogOpened.set(true)"
  />`,
  imports: [ProductReviews]
})
class ProductReviewsTestHost {
  mockReviews = signal([
    createMockReview({ review: { title: 'Review 1' } }),
    createMockReview({ review: { id: '2', title: 'Review 2' } })
  ]);
  mockRating = signal(5);
  writeDialogOpened = signal(false);
}

@Component({
  selector: 'app-product-review-summary',
  template: ''
})
class ProductReviewSummaryStub {
  reviews = input.required<Review[]>();
  rating = input.required<number>();
}

@Component({
  selector: 'app-product-review',
  template: ''
})
class ProductReviewStub {
  review = input.required<Review>();
}

describe(ProductReviews.name, () => {
  const setup = async () => {
    TestBed.overrideComponent(ProductReviews, {
      remove: {
        imports: [ProductReviewSummary, ProductReview]
      },
      add: {
        imports: [ProductReviewSummaryStub, ProductReviewStub]
      }
    });
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideDisabledAnimations()]
    });
    const fixture = TestBed.createComponent(ProductReviewsTestHost);
    const component = fixture.componentInstance;
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    const mockReviews = component.mockReviews;

    const getWriteReviewButtonHarness = () =>
      loader.getHarness(MatButtonHarness.with({ selector: '[data-testid=write-review-button]' }));

    return { fixture, component, debugElement, loader, mockReviews, getWriteReviewButtonHarness };
  };

  it('should display title', async () => {
    const { debugElement } = await setup();
    const titleDebugElement = debugElement.query(By.css('[data-testid=product-reviews-title]'));

    expect(titleDebugElement).toBeTruthy();
    expect(titleDebugElement.nativeElement.textContent).toContain('Ratings and reviews');
  });

  it('should display write-review button', async () => {
    const { getWriteReviewButtonHarness } = await setup();
    const buttonHarness = await getWriteReviewButtonHarness();

    expect(await buttonHarness.getText()).toContain('Write a Review');
  });

  it('should display product review summary', async () => {
    const { debugElement, component, mockReviews } = await setup();
    const reviewSummaryDebugElement = debugElement.query(By.directive(ProductReviewSummaryStub));
    const reviewSummaryComponent: ProductReviewSummaryStub =
      reviewSummaryDebugElement.componentInstance;

    expect(reviewSummaryDebugElement).toBeTruthy();
    expect(reviewSummaryComponent.reviews()).toBe(mockReviews());
    expect(reviewSummaryComponent.rating()).toBe(component.mockRating());
  });

  it('should display reviews', async () => {
    const { debugElement, mockReviews } = await setup();
    const reviewDebugElements = debugElement.queryAll(By.directive(ProductReviewStub));

    expect(reviewDebugElements.length).toBe(2);
    expect((reviewDebugElements[0].componentInstance as ProductReviewStub).review()).toBe(
      mockReviews()[0]
    );
    expect((reviewDebugElements[1].componentInstance as ProductReviewStub).review()).toBe(
      mockReviews()[1]
    );
  });

  it('should emit output event when clicking write-review button', async () => {
    const { component, getWriteReviewButtonHarness } = await setup();
    const buttonHarness = await getWriteReviewButtonHarness();

    await buttonHarness.click();

    expect(component.writeDialogOpened()).toBe(true);
  });
});
