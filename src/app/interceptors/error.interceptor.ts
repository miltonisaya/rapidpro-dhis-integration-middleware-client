import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LoginDialogComponent} from "../modules/login-dialog/login-dialog.component";
import {NotifierService} from "../modules/notification/notifier.service";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthService,
    public dialog: MatDialog,
    public notifier: NotifierService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.signOut();
        this.openLoginDialog()
        this.notifier.showNotification('Your token has expired','OK','error');
        location.reload();
      }

      if(err.status === 403){
        this.notifier.showNotification("You are not authorized to access this resource",'OK','error');
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }

  openLoginDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(LoginDialogComponent, dialogConfig)
      .afterClosed().subscribe(() => {
      console.log("Dialog closed ...")
    });
  }
}
