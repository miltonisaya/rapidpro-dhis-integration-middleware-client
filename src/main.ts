import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { MatInput } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatColumnDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow } from '@angular/material/table';
import { MatDivider } from '@angular/material/divider';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { AppRoutingModule } from './app/app-routing.module';
import { AuthInterceptor } from './app/auth/auth.interceptor';
import { provideHttpClient, withFetch, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, BrowserModule, bootstrapApplication } from '@angular/platform-browser';


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, MatToolbar, MatIcon, MatIconButton, MatNavList, MatListItem, MatSidenavContainer, MatSidenav, FlexLayoutModule, MatCard, MatCardContent, MatGridList, MatGridTile, MatCardHeader, MatCardTitle, MatDivider, MatSidenavContent, MatTable, MatSort, MatColumnDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatPaginator, MatProgressSpinner, FormsModule, ReactiveFormsModule, MatFormField, MatButton, MatInput),
        provideClientHydration(),
        provideAnimationsAsync(),
        provideHttpClient(withFetch()),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
  .catch(err => console.error(err));
