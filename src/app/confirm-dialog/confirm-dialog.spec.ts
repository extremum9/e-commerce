import { provideZonelessChangeDetection } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';
import { MatButtonHarness } from '@angular/material/button/testing';

import { ConfirmDialog, ConfirmDialogData } from './confirm-dialog';

describe(ConfirmDialog.name, () => {
  const setup = async (mockData: Partial<ConfirmDialogData> = {}) => {
    const mockDialogData: ConfirmDialogData = {
      title: 'test title',
      message: 'test message',
      ...mockData
    };

    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<ConfirmDialog>>('MatDialogRef', [
      'close'
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: MATERIAL_ANIMATIONS,
          useValue: { animationsDisabled: true }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockDialogData
        },
        {
          provide: MatDialogRef,
          useValue: dialogRefSpy
        }
      ]
    });
    const fixture = TestBed.createComponent(ConfirmDialog);
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    const getCancelButtonHarness = () =>
      loader.getHarness(
        MatButtonHarness.with({ selector: '[data-testid=confirm-dialog-cancel-button]' })
      );
    const getConfirmButtonHarness = () =>
      loader.getHarness(
        MatButtonHarness.with({ selector: '[data-testid=confirm-dialog-confirm-button]' })
      );

    return {
      debugElement,
      getCancelButtonHarness,
      getConfirmButtonHarness,
      mockDialogData,
      dialogRefSpy
    };
  };

  it('should display title, message and actions', async () => {
    const { debugElement, getCancelButtonHarness, getConfirmButtonHarness, mockDialogData } =
      await setup();

    const titleDebugElement = debugElement.query(By.css('[data-testid=confirm-dialog-title]'));
    expect(titleDebugElement).toBeTruthy();
    expect(titleDebugElement.nativeElement.textContent).toContain(mockDialogData.title);

    const messageDebugElement = debugElement.query(By.css('[data-testid=confirm-dialog-message]'));
    expect(messageDebugElement).toBeTruthy();
    expect(messageDebugElement.nativeElement.textContent).toContain(mockDialogData.message);

    const cancelButtonHarness = await getCancelButtonHarness();
    expect(await cancelButtonHarness.getText()).toContain('Cancel');

    const confirmButtonHarness = await getConfirmButtonHarness();
    expect(await confirmButtonHarness.getText()).toContain('Confirm');
  });

  it('should display custom actions text if provided', async () => {
    const confirmText = 'Delete';
    const { getConfirmButtonHarness } = await setup({ confirmText });
    const confirmButtonHarness = await getConfirmButtonHarness();

    expect(await confirmButtonHarness.getText()).toContain(confirmText);
  });

  it('should emit nothing when clicking the cancel button', async () => {
    const { getCancelButtonHarness, dialogRefSpy } = await setup();
    const cancelButtonHarness = await getCancelButtonHarness();
    await cancelButtonHarness.click();

    expect(dialogRefSpy.close).toHaveBeenCalledWith('');
  });

  it('should emit `true` when clicking the confirm button', async () => {
    const { getConfirmButtonHarness, dialogRefSpy } = await setup();
    const confirmButtonHarness = await getConfirmButtonHarness();
    await confirmButtonHarness.click();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
