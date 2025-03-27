import { ApplicationConfig } from '@angular/core';

import { provideClientHydration } from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideRouter} from "@angular/router";
import {APP_ROUTES} from "./app.routes";
import {provideAnimations} from "@angular/platform-browser/animations";
import {AuthInterceptor} from "./auth/authInterceptor";
import {LoaderInterceptor} from "./interceptors/loader.interceptor";
import {errorInterceptor} from "./interceptors/error.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(APP_ROUTES),
    provideAnimations(),
    provideHttpClient(withInterceptors([AuthInterceptor,LoaderInterceptor, errorInterceptor]))
  ]
};
