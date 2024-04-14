import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from "./header/header.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {FooterComponent} from "./footer/footer.component";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatListItem, MatNavList} from "@angular/material/list";
import {RouterLink} from "@angular/router";
import {MatDivider} from "@angular/material/divider";
import {FlexModule} from "@angular/flex-layout";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatNavList,
    MatListItem,
    RouterLink,
    MatDivider,
    FlexModule,
    MatButton,
    MatMenuTrigger,
    MatMenuItem,
    MatMenu,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
