import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginDialogComponent } from '../modules/login-dialog/login-dialog.component';
import { NotifierService } from '../modules/notification/notifier.service';
import { AuthService } from '../auth/auth.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService = inject(AuthService);
  const dialog = inject(MatDialog);
  const notifier = inject(NotifierService);

  const openLoginDialog = (): void => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialog.open(LoginDialogComponent, dialogConfig).afterClosed().subscribe(() => {
      console.log('Login dialog closed');
    });
  };

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        // authenticationService.signOut();
        openLoginDialog();
        notifier.showNotification('Your token has expired', 'OK', 'error');
      } else if (err.status === 403) {
        notifier.showNotification('You are not authorized to access this resource', 'OK', 'error');
      }

      const error = err.error?.message || err.message || err.statusText || 'An unknown error occurred';
      return throwError(error);
    })
  );
};
