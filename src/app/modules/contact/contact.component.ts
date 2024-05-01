import {Component, input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
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
import {NotifierService} from "../notification/notifier.service";
import {ContactService} from "./contact.service";
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FlexModule} from '@angular/flex-layout';
import {Contact} from "./types/Contact";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ContactDialogComponent} from "./modals/contact-dialog-component";

@Component({
  selector: 'app-contacts',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
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
    ContactDialogComponent
  ],
  providers: [
    ContactService
  ]
})

export class ContactComponent implements OnInit {
  displayedColumns: string[] = ["sno", 'name', 'facilityCode', 'urn', 'sex', 'age', 'actions'];
  contacts: Contact[] = [];
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any> | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  pageSize: number = 10;
  pageNo: number = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  dataSource: any;
  private params: { pageNo: number; pageSize: number; } | undefined;

  constructor(
    private notifierService: NotifierService,
    private contactService: ContactService,
    private dialogService: MatDialog
  ) {
  }

  ngOnInit(): void {
    console.log("Fetching contacts ...")
    this.getContacts();
  }

  getContacts() {
    this.params = {
      "pageNo": this.pageNo,
      "pageSize": this.pageSize
    }

    return this.contactService.getContacts(this.params).subscribe((response: any) => {
      console.log("Contacts =>", response);
      this.contacts = response.data;
      this.dataSource = new MatTableDataSource<Contact>(this.contacts);
    }, error => {
      this.notifierService.showNotification(error.error, 'OK', 'error');
    });
  }

  openDialog(data?: { id: any; facilityCode: any; }): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (data) {
      const contactData = {
        id: data.id,
        facilityCode: data.facilityCode
      };
      this.contactService.populateForm(contactData);
      this.dialogService.open(ContactDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getContacts();
      });
    } else {
      dialogConfig.data = {};
      this.dialogService.open(ContactDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getContacts();
      });
    }
  }

  protected readonly input = input;

  pageChanged(e: any) {
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getContacts();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
