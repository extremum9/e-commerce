import { TestBed } from '@angular/core/testing';
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
          provide: MatSnackBar,
          useValue: snackbarSpy
        }
      ]
    });
    const snackbar = TestBed.inject(Snackbar);

    return { snackbar, snackbarSpy };
  };

  it('should call MatSnackbar.open to open default snackbar', () => {
    const { snackbar, snackbarSpy } = setup();
    const message = 'Default';

    snackbar.showDefault(message);

    expect(snackbarSpy.open).toHaveBeenCalledOnceWith(message, 'Ok', {
      duration: 5000
    });
  });

  it('should call MatSnackbar.open to open success snackbar', () => {
    const { snackbar, snackbarSpy } = setup();
    const message = 'Success';

    snackbar.showSuccess(message);

    expect(snackbarSpy.open).toHaveBeenCalledOnceWith(message, '', {
      panelClass: 'snackbar-success',
      duration: 3000
    });
  });

  it('should call MatSnackbar.open to open error snackbar', () => {
    const { snackbar, snackbarSpy } = setup();
    const message = 'Error';

    snackbar.showError(message);

    expect(snackbarSpy.open).toHaveBeenCalledOnceWith(message, 'Close', {
      panelClass: 'snackbar-error',
      duration: 8000
    });
  });

  it('should call MatSnackbar.dismiss to dismiss snackbar', () => {
    const { snackbar, snackbarSpy } = setup();

    snackbar.dismiss();

    expect(snackbarSpy.dismiss).toHaveBeenCalled();
  });
});
