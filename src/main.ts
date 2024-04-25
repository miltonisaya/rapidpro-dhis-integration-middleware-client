import { AppComponent } from './app/app.component';
import {bootstrapApplication, provideClientHydration} from '@angular/platform-browser';
import {provideRouter} from "@angular/router";
import {APP_ROUTES} from "./app/app.routes";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {AuthInterceptor} from "./app/auth/auth.interceptor";

bootstrapApplication(AppComponent, {
  providers:[
    provideRouter(APP_ROUTES),
    provideAnimations(),
    provideClientHydration(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
  ]
})
