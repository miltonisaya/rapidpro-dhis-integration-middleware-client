import {Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatSort} from "@angular/material/sort";
import {NotifierService} from "../notification/notifier.service";
import {DataElementService} from "./data-element.service";
import {DataElement} from "./types/dataElement";

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
    FlexLayoutModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})
export class DataElementComponent {

  displayedColumns: string[] = ["sno", 'name', 'code', 'dataType', 'dhis2uid'];
  dataElements: any = [];
  dataSource: MatTableDataSource<DataElement>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pageSize = 10;
  pageNo = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  private params: { pageNo: number; pageSize: number };

  constructor(
    private DataElementService: DataElementService,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit(): void {
    this.getDataElements();
  }

  /**
   * This method returns data elements
   */
  getDataElements() {
    this.params = {
      "pageNo": this.pageNo,
      "pageSize": this.pageSize
    }

    return this.DataElementService.getDataElements(this.params).subscribe((response: any) => {
      this.dataElements = response.data;
      this.dataSource = new MatTableDataSource<DataElement>(this.dataElements.content);
      this.dataSource.sort = this.sort;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  syncDataElements() {
    return this.DataElementService.syncDataElements().subscribe((response: any) => {
      this.getDataElements();
      if (response.status == '200') {
        this.notifierService.showNotification(response.message, 'OK', 'success');
      }
    }, error => {
      // console.log("The error===>",error.message);
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  pageChanged(e: any) {
    console.log(e);
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getDataElements();
  }
}
