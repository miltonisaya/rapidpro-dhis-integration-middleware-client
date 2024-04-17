import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {DefaultComponent} from './layouts/default/default.component';
import {LoginComponent} from './layouts/login/login.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {SharedModule} from "./shared/shared.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {WidgetModule} from "./widgets/widget.module";
import {MatDivider} from "@angular/material/divider";
import { FlowsComponent } from './pages/flows/flows.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { OrganisationUnitsComponent } from './pages/organisation-units/organisation-units.component';
import { UsersComponent } from './pages/users/users.component';
import { ProgramsComponent } from './pages/programs/programs.component';
import { DataElementsComponent } from './pages/data-elements/data-elements.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    LoginComponent,
    DashboardComponent,
    FlowsComponent,
    ContactsComponent,
    OrganisationUnitsComponent,
    UsersComponent,
    ProgramsComponent,
    DataElementsComponent
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
        MatSidenavContent
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
