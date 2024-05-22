import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {ContactService} from "./contact.service";
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FlexModule} from '@angular/flex-layout';
import {ContactDialogComponent} from "./modals/contact-dialog-component";
import {CommonModule} from "@angular/common";
import {merge, of as observableOf, startWith, switchMap} from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

@Component({
  selector: 'app-contacts',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [
    FlexModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatPaginator,
    ContactDialogComponent,
    CommonModule,
    MatProgressSpinner,
    MatSort,
    MatSortHeader,
    MatButton
  ],
  providers: [
    ContactService
  ]
})

export class ContactComponent implements AfterViewInit {
  title: string = "Contacts";
  displayedColumns: string[] = ['number', 'name', 'urn', 'facilityCode', 'sex', 'createdOn', 'registrationDate', 'age', 'fields', 'actions'];
  pageSizeOptions: number[] = [10, 20, 50, 100, 250, 500, 1000];
  data: Contact[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  areRecordsAvailable = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private contactService: ContactService,
    private dialogService: MatDialog
  ) {
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.contactService!.getContacts(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.direction
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.areRecordsAvailable = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.total;
          return data.data;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  openDialog(row: any): void {
    console.log("Open dialog clicked!");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (row) {
      const contactData = {
        uuid: row.uuid,
        facilityCode: row.facilityCode,
        name: row.name,
        registrationDate: row.registrationDate,
        urn: row.urn,
        sex: row.sex
      };
      dialogConfig.data = contactData;
      this.contactService.populateForm(contactData);
      this.dialogService.open(ContactDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        // this.getContacts();
      });
    } else {
      dialogConfig.data = {};
      this.dialogService.open(ContactDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        // this.getContacts();
      });
    }
  }
}

export interface ApiResponse {
  data: Contact[];
  page: number;
  size: number;
  status: number;
  total: number;
}

export interface Contact {
  age: number;
  createdOn: string;
  facilityCode: string;
  fields: string;
  name: string;
  registrationDate: string;
  sex: string;
  urn: string;
  uuid: string;
}
