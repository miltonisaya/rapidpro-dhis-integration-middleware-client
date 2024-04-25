import { AppComponent } from './app/app.component';
import {bootstrapApplication, provideClientHydration} from '@angular/platform-browser';
import {provideRouter} from "@angular/router";
import {APP_ROUTES} from "./app/app.routes";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient} from "@angular/common/http";

bootstrapApplication(AppComponent, {
  providers:[
    provideRouter(APP_ROUTES),
    provideAnimations(),
    provideHttpClient(),
    provideClientHydration()
  ]
})
