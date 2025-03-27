import {Component, CUSTOM_ELEMENTS_SCHEMA, Inject, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
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
import {JsonPipe, NgIf} from "@angular/common";

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
    MatButton,
    JsonPipe,
    NgIf
  ],
  providers: [DataElementService, ProgramService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})

export class DataElementProgramMappingDialogComponent implements OnInit {
  unSelectedDataElementList: any[] = [];
  selectedDataElementsList: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DataElementProgramMappingDialogComponent>,
    public notifierService: NotifierService,
    public dataElementService: DataElementService,
    public programService: ProgramService,
    private primengConfig: PrimeNGConfig,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.getDataElements();
    this.primengConfig.ripple = true;
  }

  getDataElements() {
    return this.dataElementService.getDataElementsByProgram(this.data).subscribe(response => {
      const {selectedDataElements, unAssignedDataElements} = response.data;
      this.selectedDataElementsList = selectedDataElements;
      this.unSelectedDataElementList = unAssignedDataElements;
    }, (error: { message: string; }) => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
    });
  }

  saveData() {
    let payload = {
      programUuid: this.data,
      dataElements: this.selectedDataElementsList
    }

    return this.programService.mapDataElements(payload).subscribe((response: any) => {
      response.data.content;
      this.notifierService.showNotification(response.message, 'OK', 'success');
      this.dialogRef.close()
    }, error => {
      this.notifierService.showNotification(error.error.message, 'OK', 'error');
      this.dialogRef.close()
    })
  }
}
