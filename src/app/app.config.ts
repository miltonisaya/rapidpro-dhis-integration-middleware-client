import { ApplicationConfig } from '@angular/core';

import { provideClientHydration } from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./auth/auth.interceptor";
import {provideRouter} from "@angular/router";
import {APP_ROUTES} from "./app.routes";
import {provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(APP_ROUTES),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ]
};
