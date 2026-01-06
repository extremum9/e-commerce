import { TestBed } from '@angular/core/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideZonelessChangeDetection } from '@angular/core';

import { Snackbar } from './snackbar';

describe(Snackbar.name, () => {
  const setup = () => {
    const snackbarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open', 'dismiss']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: MATERIAL_ANIMATIONS,
          useValue: { animationsDisabled: true }
        },
        {
          provide: MatSnackBar,
          useValue: snackbarSpy
        }
      ]
    });
    const snackbar = TestBed.inject(Snackbar);

    return { snackbar, snackbarSpy };
  };

  it('should call the `MatSnackbar` service to open an error snackbar', () => {
    const { snackbar, snackbarSpy } = setup();
    const message = 'Error';

    snackbar.showError(message);

    expect(snackbarSpy.open).toHaveBeenCalledOnceWith(message, '', {
      panelClass: 'snackbar-error',
      duration: 3000
    });
  });

  it('should call the `MatSnackBar` service to dismiss a snackbar', () => {
    const { snackbar, snackbarSpy } = setup();

    snackbar.dismiss();

    expect(snackbarSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
