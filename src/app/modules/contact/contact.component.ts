import {Component, OnInit, ViewChild} from '@angular/core';
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
  MatTable,
  MatTableDataSource
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
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {Contact} from "./types/Contact";
import {NotifierService} from "../notification/notifier.service";

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

export class ContactComponent implements OnInit {
  title: string = "Contacts";
  displayedColumns: string[] = ['number', 'name', 'urn', 'facilityCode','facilityName', 'sex', 'createdOn', 'registrationDate', 'age', 'actions'];
  pageSizeOptions: number[] = [10, 20, 50, 100, 250, 500, 1000];
  data: Contact[] = [];
  resultsLength: number = 0;
  params: { pageNo: number; pageSize: number; sortBy: string };
  pageSize = 10;
  pageIndex = 0;
  pageNo: number = 0;
  totalRecords = 0;
  dataSource = new MatTableDataSource<Contact>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private contactService: ContactService,
    private dialogService: MatDialog,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit() {
    this.getContacts();
  }

  pageChanged(e: any) {
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getContacts();
  }

  getContacts() {
    this.params = {
      "pageNo": this.pageNo,
      "pageSize": this.pageSize,
      "sortBy": "name"
    }

    return this.contactService.get(this.params).subscribe((response: any) => {
      this.dataSource.data = response.data || [];
      this.totalRecords = response.total ? response.total : 0;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.notifierService.showNotification(error.error.message, 'OK', 'error');
    });
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
