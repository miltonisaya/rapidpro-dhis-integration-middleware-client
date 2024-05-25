import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LoginDialogComponent} from "../modules/login-dialog/login-dialog.component";
import {NotifierService} from "../modules/notification/notifier.service";
import {AuthService} from "../auth/auth.service";
import {LoaderService} from "../modules/loader/loader.service";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(
    private loaderService: LoaderService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.isLoading.next(true);
    return next.handle(request).pipe(
      finalize(
        () => {
          this.loaderService.isLoading.next(false);
        }
      )
    );
  }
}
