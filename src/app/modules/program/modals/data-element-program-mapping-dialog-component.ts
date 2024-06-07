import {Component, CUSTOM_ELEMENTS_SCHEMA, Inject, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {PrimeNGConfig} from "primeng/api";
import {ProgramService} from "../program.service";
import {NotifierService} from "../../notification/notifier.service";
import {DataElementService} from "../../data-element/data-element.service";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatDivider} from "@angular/material/divider";
import {PickListModule} from "primeng/picklist";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-flow-key-dialog',
  templateUrl: 'data-element-program-mapping-dialog-component.html',
  styleUrls: ['data-element-program-mapping-dialog.component.css'],
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatDivider,
    MatDialogContent,
    PickListModule,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    MatButton
  ],
  providers: [DataElementService, ProgramService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})

export class DataElementProgramMappingDialogComponent implements OnInit {
  fetchedList: any[];
  selectedDataElementsList: any;

  constructor(
    public dialogRef: MatDialogRef<DataElementProgramMappingDialogComponent>,
    public notifierService: NotifierService,
    public dataElementService: DataElementService,
    public programService: ProgramService,
    private primengConfig: PrimeNGConfig,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.getDataElements();
    this.selectedDataElementsList = [];
    this.primengConfig.ripple = true;
  }

  getDataElements() {
    let params = {
      pageSize: 1000,
      pageNo: 0,
      sortBy:'name'
    };
    return this.dataElementService.getDataElements(params).subscribe((response: any) => {
      this.fetchedList = response.data.content;
    }, (error: { message: string; }) => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
      console.log(error);
    });
  }

  saveData() {
    let payload = {
      programId: this.data,
      dataElements: this.selectedDataElementsList
    }

    return this.programService.mapDataElements(payload).subscribe((response: any) => {
      response.data.content;
      console.log("Response=>", response);
      this.notifierService.showNotification(response.message, 'OK', 'success');
      this.matDialog.closeAll()
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
      console.log("Error =>", error);
      this.matDialog.closeAll()
    })
  }
}



