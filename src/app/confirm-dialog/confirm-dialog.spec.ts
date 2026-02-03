import { Component, inject, provideZonelessChangeDetection } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { ConfirmDialog, ConfirmDialogData } from './confirm-dialog';

@Component({
  template: ''
})
class ConfirmDialogTestHost {
  dialog = inject(MatDialog);

  open(data: ConfirmDialogData) {
    this.dialog.open(ConfirmDialog, { data });
  }
}

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

    TestBed.overrideComponent(ConfirmDialog, {
      add: {
        providers: [
          {
            provide: MatDialogRef,
            useValue: dialogRefSpy
          }
        ]
      }
    });
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: MATERIAL_ANIMATIONS,
          useValue: { animationsDisabled: true }
        }
      ]
    });
    const fixture = TestBed.createComponent(ConfirmDialogTestHost);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    fixture.componentInstance.open(mockDialogData);
    await fixture.whenStable();

    const dialogHarness = await rootLoader.getHarness(MatDialogHarness);

    return { dialogHarness, mockDialogData, dialogRefSpy };
  };

  it('should display title, message and actions', async () => {
    const { dialogHarness, mockDialogData } = await setup();

    expect(await dialogHarness.getTitleText()).toBe(mockDialogData.title);
    expect(await dialogHarness.getContentText()).toBe(mockDialogData.message);
    expect(await dialogHarness.getActionsText()).toContain('Cancel');
    expect(await dialogHarness.getActionsText()).toContain('Confirm');
  });

  it('should display custom actions text if provided', async () => {
    const confirmText = 'Delete';
    const { dialogHarness } = await setup({ confirmText });

    expect(await dialogHarness.getActionsText()).toContain(confirmText);
  });

  it('should emit nothing when clicking the cancel button', async () => {
    const { dialogHarness, dialogRefSpy } = await setup();

    const cancelButtonHarness = await dialogHarness.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=confirm-dialog-cancel-button]' })
    );
    await cancelButtonHarness.click();

    expect(dialogRefSpy.close).toHaveBeenCalledWith('');
  });

  it('should emit `true` when clicking the confirm button', async () => {
    const { dialogHarness, dialogRefSpy } = await setup();

    const confirmButtonHarness = await dialogHarness.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=confirm-dialog-confirm-button]' })
    );
    await confirmButtonHarness.click();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
