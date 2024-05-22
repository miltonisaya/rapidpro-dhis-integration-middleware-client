import {Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Program} from './program';
import {ProgramService} from './program.service';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DataElementProgramMappingDialogComponent} from "./modals/data-element-program-mapping-dialog-component";
import {NotifierService} from "../notification/notifier.service";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-programs',
  templateUrl: './program.component.html',
  standalone: true,
  styleUrls: ['./program.component.scss'],
  providers: [NotifierService, ProgramService],
  imports: [
    FlexLayoutModule,
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatButton,
    MatFormField,
    MatTable,
    MatPaginator
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ProgramComponent implements OnInit {
  displayedColumns: string[] = ["sno", 'name', 'code', 'dhis2uid', 'actions'];
  programs: any = [];
  dataSource: MatTableDataSource<Program>;
  pageSize: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private ProgramService: ProgramService,
    private notifierService: NotifierService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getPrograms();
  }

  /**
   * This method returns data elements
   */
  getPrograms() {
    return this.ProgramService.getDataElements().subscribe((response: any) => {
      this.programs = response.data;
      this.dataSource = new MatTableDataSource<Program>(this.programs.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
      console.log(error);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  syncPrograms() {
    return this.ProgramService.syncPrograms().subscribe((response: any) => {
      this.getPrograms();
      if (response.status == '200') {
        console.log("The message===>", response);
        this.notifierService.showNotification(response.message, 'OK', 'success');
      }
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  openMappingDialog(uuid: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // if (data) {
    //   const flowKeysData = {
    //     id: data.id,
    //     keyDescription: data.keyDescription,
    //     keyName: data.keyName,
    //   };

    // console.log(flowKeysData);
    // this.FlowService.populateForm(flowKeysData);
    this.dialog.open(DataElementProgramMappingDialogComponent, {data: uuid})
      .afterClosed().subscribe(() => {
      this.getPrograms();
    });
    // } else {
    //   dialogConfig.data = {};
    //   this.dialog.open(FlowCategoryDialogComponent, dialogConfig)
    //     .afterClosed().subscribe(() => {
    //     this.getFlows();
    //   });
    // }
  }
}
