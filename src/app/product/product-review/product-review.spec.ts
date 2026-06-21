import { Component, input, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

import { createMockReview, provideDisabledAnimations } from '../../testing-utils';
import { StarRating } from '../../star-rating/star-rating';

import { ProductReview } from './product-review';

@Component({
  template: `<app-product-review [review]="mockReview()" />`,
  imports: [ProductReview]
})
class ProductReviewTestHost {
  mockReview = signal(createMockReview());
}

@Component({
  selector: 'app-star-rating',
  template: ''
})
class StarRatingStub {
  rating = input.required<number>();
}

describe(ProductReview.name, () => {
  const setup = async () => {
    TestBed.overrideComponent(ProductReview, {
      remove: {
        imports: [StarRating]
      },
      add: {
        imports: [StarRatingStub]
      }
    });
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideDisabledAnimations()]
    });
    const fixture = TestBed.createComponent(ProductReviewTestHost);
    const debugElement = fixture.debugElement;
    await fixture.whenStable();

    const mockReview = fixture.componentInstance.mockReview;

    return { fixture, debugElement, mockReview };
  };

  it('should display review author image', async () => {
    const { debugElement, mockReview } = await setup();
    const imageDebugElement = debugElement.query(By.css('[data-testid=review-author-image]'));
    expect(imageDebugElement).toBeTruthy();
    const imageElement: HTMLImageElement = imageDebugElement.nativeElement;
    expect(imageElement.getAttribute('src')).toBe(mockReview().author.imageUrl);
    expect(imageElement.getAttribute('width')).toBe('40');
    expect(imageElement.getAttribute('height')).toBe('40');
    expect(imageElement.getAttribute('alt')).toBe(mockReview().author.name);
  });

  it('should display review author name', async () => {
    const { debugElement, mockReview } = await setup();
    const nameDebugElement = debugElement.query(By.css('[data-testid=review-author-name]'));

    expect(nameDebugElement).toBeTruthy();
    expect(nameDebugElement.nativeElement.textContent).toContain(mockReview().author.name);
  });

  it('should display star rating', async () => {
    const { debugElement, mockReview } = await setup();
    const starRatingDebugElement = debugElement.query(By.directive(StarRatingStub));

    expect(starRatingDebugElement).toBeTruthy();
    expect((starRatingDebugElement.componentInstance as StarRatingStub).rating()).toBe(
      mockReview().rating
    );
  });

  it('should display review creation date', async () => {
    const { debugElement, mockReview } = await setup();
    const dateDebugElement = debugElement.query(By.css('[data-testid=review-creation-date]'));
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(mockReview().createdAt?.toDate(), 'MMM d, yyyy');

    expect(dateDebugElement).toBeTruthy();
    expect(dateDebugElement.nativeElement.textContent).toContain(formattedDate);
  });

  it('should display review title', async () => {
    const { debugElement, mockReview } = await setup();
    const titleDebugElement = debugElement.query(By.css('[data-testid=review-title]'));

    expect(titleDebugElement).toBeTruthy();
    expect(titleDebugElement.nativeElement.textContent).toContain(mockReview().title);
  });

  it('should display review body', async () => {
    const { debugElement, mockReview } = await setup();
    const bodyDebugElement = debugElement.query(By.css('[data-testid=review-body]'));

    expect(bodyDebugElement).toBeTruthy();
    expect(bodyDebugElement.nativeElement.textContent).toContain(mockReview().body);
  });
});
