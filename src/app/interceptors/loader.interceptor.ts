import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../modules/loader/loader.service';
import { finalize } from 'rxjs/operators';

export const LoaderInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
) => {
  const loaderService = inject(LoaderService);

  loaderService.isLoading.next(true);
  return next(request).pipe(
    finalize(() => {
      loaderService.isLoading.next(false);
    }),
  );
};
