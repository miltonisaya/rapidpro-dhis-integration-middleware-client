import {HttpInterceptorFn} from '@angular/common/http';
import {AuthService} from "./auth.service";
import {inject} from "@angular/core";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const authToken: string = authService.getToken();

  let authReq: any;
  if (authToken) {
    // Clone the request and add the authorization header
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  }

  console.log("Auth Request =>", authReq);
  // Pass the cloned request with the updated header to the next handler
  return next(authReq);
};
