import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {DefaultComponent} from './layouts/default/default.component';
import {LoginComponent} from './layouts/login/login.component';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {SharedModule} from "./shared/shared.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {WidgetModule} from "./widgets/widget.module";
import {MatDivider} from "@angular/material/divider";
import { FlowComponent } from './modules/flow/flow.component';
import { OrganisationUnitComponent } from './modules/organisation-unit/organisation-unit.component';
import { UserComponent } from './modules/user/user.component';
import { ProgramComponent } from './modules/program/program.component';
import { DataElementComponent } from './modules/data-element/data-element.component';
import {MatCell, MatColumnDef, MatHeaderCell, MatHeaderRow, MatRow, MatTable} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MasterModule} from "./modules/master.module";
import {HttpClientModule, provideHttpClient, withFetch} from "@angular/common/http";
import {MatFormField} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    LoginComponent,
    DashboardComponent,
    FlowComponent,
    OrganisationUnitComponent,
    UserComponent,
    ProgramComponent,
    DataElementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatNavList,
    MatListItem,
    MatSidenavContainer,
    MatSidenav,
    SharedModule,
    WidgetModule,
    FlexLayoutModule,
    MatCard,
    MatCardContent,
    MatGridList,
    MatGridTile,
    MatCardHeader,
    MatCardTitle,
    MatDivider,
    MatSidenavContent,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatProgressSpinner,
    FormsModule,
    ReactiveFormsModule,
    MasterModule,
    MatFormField,
    MatButton,
    MatInput
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
