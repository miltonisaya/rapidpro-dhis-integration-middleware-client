import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContactComponent} from "./contact/contact.component";
import {MatCell, MatColumnDef, MatHeaderCell, MatHeaderRow, MatRow, MatTable} from "@angular/material/table";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {ContactService} from "./contact/contact.service";
import {NotifierService} from "./notification/notifier.service";
import {NotifierComponent} from "./notification/notifier/notifier.component";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";


@NgModule({
  declarations: [ContactComponent,
    NotifierComponent],
  imports: [
    CommonModule,
    MatTable,
    MatProgressSpinner,
    MatSort,
    MatColumnDef,
    MatCell,
    MatHeaderCell,
    MatPaginator,
    MatHeaderRow,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatRow,
    MatLabel,
    MatFormField,
    MatInput,
  ],
  providers: [
    ContactService,
    NotifierService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class MasterModule {
}
