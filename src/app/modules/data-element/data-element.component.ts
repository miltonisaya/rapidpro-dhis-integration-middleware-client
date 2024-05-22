import {Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableDataSource,
  MatTableModule
} from "@angular/material/table";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatSort} from "@angular/material/sort";
import {NotifierService} from "../notification/notifier.service";
import {DataElementService} from "./data-element.service";
import {DataElement} from "./types/dataElement";

export interface DataElementApiResponse {
  data: DataElement[];
  page: number;
  size: number;
  status: number;
  total: number;
  message: string;
}

@Component({
  selector: 'app-data-elements',
  templateUrl: './data-element.component.html',
  styleUrl: './data-element.component.css',
  imports: [
    MatPaginator,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatFormField,
    MatInput,
    MatTable,
    MatButton,
    FlexLayoutModule,
    MatTableModule
  ],
  providers: [DataElementService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  standalone: true
})
export class DataElementComponent implements OnInit {
  displayedColumns: string[] = ["sno", 'name', 'code', 'dataType', 'dhis2uid'];
  dataElements: any = [];
  dataSource: MatTableDataSource<DataElement>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pageSize: number = 10;
  pageNo: number = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  private params: { pageNo: number; pageSize: number; sortBy: string };

  constructor(
    private dataElementService: DataElementService,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit(): void {
    this.getDataElements();
  }

  getDataElements() {
    this.params = {
      "pageNo": this.pageNo,
      "pageSize": this.pageSize,
      "sortBy": "name"
    }

    return this.dataElementService.getDataElements(this.params).subscribe((response: any) => {
      this.dataElements = response.data;
      this.dataSource = new MatTableDataSource<DataElement>(this.dataElements.content);
      this.dataSource.sort = this.sort;
    }, error => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  syncDataElements() {
    return this.dataElementService.syncDataElements().subscribe(response => {
      this.getDataElements();
      this.notifierService.showNotification(response.message, 'OK', 'success');
    }, error => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
    });
  }

  pageChanged(e: any) {
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getDataElements();
  }
}
