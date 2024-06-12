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
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {UpperCasePipe} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";

export interface ProgramApiResponse {
  data: Program[];
  message: string;
  page: number;
  size: number;
  status: number;
  total: number;
}

@Component({
  selector: 'app-programs',
  templateUrl: './program.component.html',
  standalone: true,
  styleUrls: ['./program.component.css'],
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
    MatPaginator,
    UpperCasePipe,
    MatIconButton,
    MatTooltip
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ProgramComponent implements OnInit {
  title: string = "Programs";
  displayedColumns: string[] = ["sno", 'name', 'code', 'dhis2uid', 'actions'];
  programs: any = [];
  dataSource: MatTableDataSource<Program>;
  pageSize: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private programService: ProgramService,
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
    return this.programService.getDataElements().subscribe((response: any) => {
      console.log('Programs =>', response);
      this.programs = response.data;
      this.dataSource = new MatTableDataSource<Program>(this.programs);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.notifierService.showNotification(error.error.message, 'OK', 'error');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  syncPrograms() {
    return this.programService.syncPrograms().subscribe((response: ProgramApiResponse) => {
      this.notifierService.showNotification(response.message, 'OK', 'success');
      this.getPrograms();
    }, error => {
      this.notifierService.showNotification(error.error.message, 'OK', 'error');
    });
  }

  openDataElementProgramMappingDialog(uuid: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '50%';
    dialogConfig.data = uuid;
    this.dialog.open(DataElementProgramMappingDialogComponent, dialogConfig)
      .afterClosed().subscribe(() => {
      this.getPrograms();
    });
  }
}
