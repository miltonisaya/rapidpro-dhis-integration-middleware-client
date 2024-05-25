import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs";
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";

export function AuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService:AuthService = inject(AuthService);
  const token = authService.getToken();
  console.log("Intercepting request with token ...");
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  } else {
    return next(req);
  }
}
