import {AfterViewInit, Component, input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from "@angular/material/table";
import {NotifierService} from "../notification/notifier.service";
import {ContactService} from "./contact.service";
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FlexModule } from '@angular/flex-layout';

@Component({
    selector: 'app-contacts',
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.css',
    standalone: true,
    imports: [FlexModule, MatFormField, MatLabel, MatInput, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatIconButton, MatTooltip, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator]
})

export class ContactComponent implements OnInit {
  displayedColumns: string[] = ["sno", 'name', 'facilityCode', 'urn', 'sex', 'age', 'actions'];
  contacts: any = [];
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any> | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  pageSize = 10;
  pageNo = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  dataSource: any;
  private params: { pageNo: number; pageSize: number; } | undefined;

  constructor(
    private notifierService: NotifierService,
    private contactService: ContactService
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
      this.dataSource = new MatTableDataSource<any>(this.contacts);
    }, error => {
      this.notifierService.showNotification(error.error, 'OK', 'error');
    });
  }

  openDialog(contacts: any) {
    console.log("Opening dialog!")
  }

  protected readonly input = input;

  pageChanged($event: PageEvent) {
    console.log("Page changed!")
  }

  applyFilter($event: KeyboardEvent) {
    console.log("Filter Applied!")
  }
}
