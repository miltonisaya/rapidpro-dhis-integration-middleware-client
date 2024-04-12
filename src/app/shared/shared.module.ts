import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from "./header/header.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {FooterComponent} from "./footer/footer.component";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatListItem, MatNavList} from "@angular/material/list";
import {RouterLink} from "@angular/router";



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
    RouterLink
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
