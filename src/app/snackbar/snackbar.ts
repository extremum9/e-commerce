import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class Snackbar {
  private readonly snackbar = inject(MatSnackBar);

  public showDefault(message: string): void {
    this.snackbar.open(message, 'Ok', { duration: 5000 });
  }

  public showSuccess(message: string): void {
    this.snackbar.open(message, '', { panelClass: 'snackbar-success', duration: 3000 });
  }

  public showError(message: string): void {
    this.snackbar.open(message, '', { panelClass: 'snackbar-error', duration: 3000 });
  }

  public dismiss(): void {
    this.snackbar.dismiss();
  }
}
