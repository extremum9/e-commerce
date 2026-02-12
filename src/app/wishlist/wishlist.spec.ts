import { TestBed } from '@angular/core/testing';
import { Component, input, provideZonelessChangeDetection, signal } from '@angular/core';
import { MatIconHarness, MatIconTestingModule } from '@angular/material/icon/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatButtonHarness } from '@angular/material/button/testing';

import { Snackbar } from '../snackbar/snackbar';
import { ProductApiClient } from '../product/product-api-client';
import { createMockProduct, provideDisabledAnimations } from '../testing-utils';
import { Product } from '../models/product';
import { ProductCard } from '../product/product-card/product-card';
import { BackButton } from '../back-button/back-button';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

import Wishlist from './wishlist';
import { WishlistApiClient } from './wishlist-api-client';
import { WishlistEmptyBlock } from './wishlist-empty-block/wishlist-empty-block';

type SetupConfig = {
  initialWishlistSet: Set<string>;
};

@Component({
  selector: 'app-product-card',
  template: `<ng-content />`
})
class ProductCardStub {
  product = input.required<Product>();
}
@Component({
  selector: 'app-back-button',
  template: `<ng-content />`
})
class BackButtonStub {
  navigateTo = input.required<string>();
}

@Component({
  selector: 'app-wishlist-empty-block',
  template: ''
})
class WishlistEmptyBlockStub {}

describe(Wishlist.name, () => {
  const setup = async (config: Partial<SetupConfig> = {}) => {
    const { initialWishlistSet }: SetupConfig = {
      initialWishlistSet: new Set(['1', '2']),
      ...config
    };

    const wishlistSet = signal<Set<string> | undefined>(initialWishlistSet);
    const wishlistApiClientSpy = jasmine.createSpyObj<WishlistApiClient>(
      'WishlistApiClient',
      ['delete', 'deleteAll'],
      {
        wishlistSet
      }
    );
    wishlistApiClientSpy.delete.and.returnValue(of(undefined));
    wishlistApiClientSpy.deleteAll.and.returnValue(of(undefined));

    const mockProducts = [
      createMockProduct({ name: 'test product 1' }),
      createMockProduct({ id: '2', name: 'test product 2' })
    ];
    const productApiClientSpy = jasmine.createSpyObj<ProductApiClient>('ProductApiClient', [
      'listByIds'
    ]);
    productApiClientSpy.listByIds.and.returnValue(of(mockProducts));

    const dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    const snackbarSpy = jasmine.createSpyObj<Snackbar>('Snackbar', ['showSuccess']);

    TestBed.overrideComponent(Wishlist, {
      remove: {
        imports: [ProductCard, BackButton, WishlistEmptyBlock]
      },
      add: {
        imports: [ProductCardStub, BackButtonStub, WishlistEmptyBlockStub]
      }
    });
    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        provideDisabledAnimations(),
        {
          provide: WishlistApiClient,
          useValue: wishlistApiClientSpy
        },
        {
          provide: ProductApiClient,
          useValue: productApiClientSpy
        },
        {
          provide: MatDialog,
          useValue: dialogSpy
        },
        {
          provide: Snackbar,
          useValue: snackbarSpy
        }
      ]
    });
    const fixture = TestBed.createComponent(Wishlist);
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    const hasSpinnerHarness = () =>
      loader.hasHarness(
        MatProgressSpinnerHarness.with({ selector: '[data-testid=loading-wishlist-spinner]' })
      );
    const getDeleteFromWishlistButtonHarnesses = () =>
      loader.getAllHarnesses(
        MatButtonHarness.with({
          selector: '[data-testid=delete-from-wishlist-button]',
          variant: 'mini-fab'
        })
      );
    const getClearWishlistButtonHarness = () =>
      loader.getHarness(
        MatButtonHarness.with({
          selector: '[data-testid=clear-wishlist-button]',
          appearance: 'outlined'
        })
      );

    return {
      fixture,
      debugElement,
      loader,
      hasSpinnerHarness,
      getDeleteFromWishlistButtonHarnesses,
      getClearWishlistButtonHarness,
      wishlistSet,
      wishlistApiClientSpy,
      mockProducts,
      productApiClientSpy,
      dialogSpy,
      dialogRefSpy,
      snackbarSpy
    };
  };

  describe('Loading state', () => {
    it('should display spinner', async () => {
      const { hasSpinnerHarness, wishlistSet } = await setup({ initialWishlistSet: undefined });

      expect(await hasSpinnerHarness()).toBe(true);
      wishlistSet.set(new Set([]));
      expect(await hasSpinnerHarness()).toBe(false);
    });
  });

  describe('Loaded state', () => {
    describe('Wishlist is empty', () => {
      it('should display empty block', async () => {
        const { fixture, debugElement, wishlistSet } = await setup({
          initialWishlistSet: new Set([])
        });

        expect(debugElement.query(By.directive(WishlistEmptyBlockStub))).toBeTruthy();
        wishlistSet.set(new Set(['1']));
        await fixture.whenStable();
        expect(debugElement.query(By.directive(WishlistEmptyBlockStub))).toBeFalsy();
      });
    });

    describe('Wishlist has items', () => {
      it('should display back button', async () => {
        const { debugElement } = await setup();
        const backButtonDebugElement = debugElement.query(By.directive(BackButtonStub));

        expect(backButtonDebugElement).toBeTruthy();
        expect(backButtonDebugElement.nativeElement.textContent).toContain('Continue Shopping');
        expect((backButtonDebugElement.componentInstance as BackButtonStub).navigateTo()).toBe(
          '/products'
        );
      });

      it('should display title and count', async () => {
        const { debugElement } = await setup();

        const titleDebugElement = debugElement.query(By.css('[data-testid=wishlist-title]'));
        expect(titleDebugElement).toBeTruthy();
        expect(titleDebugElement.nativeElement.textContent).toContain('My Wishlist');

        const wishlistCountDebugElement = debugElement.query(
          By.css('[data-testid=wishlist-count]')
        );
        expect(wishlistCountDebugElement).toBeTruthy();
        expect(wishlistCountDebugElement.nativeElement.textContent).toContain('2 items');
      });

      it('should display product cards', async () => {
        const { debugElement, getDeleteFromWishlistButtonHarnesses, mockProducts } = await setup();
        const productCardDebugElements = debugElement.queryAll(By.directive(ProductCardStub));

        expect(productCardDebugElements.length).toBe(2);
        expect(
          (productCardDebugElements[0].componentInstance as ProductCardStub).product().name
        ).toBe(mockProducts[0].name);

        const deleteFromWishlistButtonHarnesses = await getDeleteFromWishlistButtonHarnesses();
        expect(deleteFromWishlistButtonHarnesses.length).toBe(2);

        const deleteFromWishlistButtonIconHarness =
          await deleteFromWishlistButtonHarnesses[0].getHarness(MatIconHarness);
        expect(await deleteFromWishlistButtonIconHarness.getName()).toBe('delete');
      });

      it('should call WishlistApiClient.delete and display success snackbar on success', async () => {
        const {
          getDeleteFromWishlistButtonHarnesses,
          wishlistApiClientSpy,
          mockProducts,
          snackbarSpy
        } = await setup();

        const deleteButtonHarness = await getDeleteFromWishlistButtonHarnesses();
        await deleteButtonHarness[0].click();

        expect(wishlistApiClientSpy.delete).toHaveBeenCalledWith(mockProducts[0].id);
        expect(snackbarSpy.showSuccess).toHaveBeenCalledWith('Product removed from wishlist');
      });

      it('should display button to clear wishlist', async () => {
        const { getClearWishlistButtonHarness } = await setup();
        const clearButtonHarness = await getClearWishlistButtonHarness();

        expect(await clearButtonHarness.getText()).toContain('Clear Wishlist');
      });

      it('should call MatDialog.open and open confirmation dialog', async () => {
        const { getClearWishlistButtonHarness, dialogSpy, dialogRefSpy } = await setup();
        dialogRefSpy.afterClosed.and.returnValue(of(true));
        dialogSpy.open.and.returnValue(dialogRefSpy);

        const clearButtonHarness = await getClearWishlistButtonHarness();
        await clearButtonHarness.click();

        expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialog, {
          data: {
            title: 'Clear Wishlist',
            message: 'Are you sure you want to delete all items?',
            confirmText: 'Clear'
          }
        });
      });

      it('should NOT call WishlistApiClient.deleteAll if not confirmed', async () => {
        const { getClearWishlistButtonHarness, wishlistApiClientSpy, dialogSpy, dialogRefSpy } =
          await setup();
        dialogRefSpy.afterClosed.and.returnValue(of(undefined));
        dialogSpy.open.and.returnValue(dialogRefSpy);

        const clearButtonHarness = await getClearWishlistButtonHarness();
        await clearButtonHarness.click();

        expect(wishlistApiClientSpy.deleteAll).not.toHaveBeenCalled();
      });

      it('should call WishlistApiClient.deleteAll if confirmed', async () => {
        const { getClearWishlistButtonHarness, wishlistApiClientSpy, dialogSpy, dialogRefSpy } =
          await setup();
        dialogRefSpy.afterClosed.and.returnValue(of(true));
        dialogSpy.open.and.returnValue(dialogRefSpy);

        const clearButtonHarness = await getClearWishlistButtonHarness();
        await clearButtonHarness.click();

        expect(wishlistApiClientSpy.deleteAll).toHaveBeenCalled();
      });
    });
  });
});
