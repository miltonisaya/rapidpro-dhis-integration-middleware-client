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
import {MatSidenav, MatSidenavContainer} from "@angular/material/sidenav";
import {SharedModule} from "./shared/shared.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {WidgetModule} from "./widgets/widget.module";

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    LoginComponent,
    DashboardComponent
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
    MatCardTitle
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
