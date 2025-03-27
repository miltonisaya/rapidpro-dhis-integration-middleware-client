import {Component, CUSTOM_ELEMENTS_SCHEMA, Inject, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {FlowService} from "../../flow.service";
import {NotifierService} from "../../../notification/notifier.service";
import {DataElementService} from "../../../data-element/data-element.service";
import {FlowKeyService} from "../../flowkey.service";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatDivider} from "@angular/material/divider";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {AsyncPipe, NgFor} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-flow-key-dialog',
  templateUrl: 'flow-key-dialog-component.html',
  standalone: true,
  styleUrls: ['flow-key-dialog.component.sass'],
  imports: [
    NgFor,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDivider,
    MatDialogContent,
    MatFormField,
    MatAutocompleteTrigger,
    MatAutocomplete,
    AsyncPipe,
    MatOption,
    MatDialogActions,
    MatDialogClose,
    MatButton,
  ],
  providers: [DataElementService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})

export class FlowKeyDialogComponent implements OnInit {
  dataElements: any;
  filteredOptions: any;
  selectedDataElement: any;
  myControl = new FormControl();

  constructor(
    public flowKeyService: FlowKeyService,
    public dialogRef: MatDialogRef<FlowKeyDialogComponent>,
    public notifierService: NotifierService,
    public dataElementService: DataElementService,
    public flowService: FlowService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.getDataElements();

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.dataElements)
      );
  }

  getDataElements() {
    let params = {
      pageSize: 1000,
      pageNo: 0,
      sortBy: 'name'
    };
    return this.dataElementService.getDataElements(params).subscribe((response: any) => {
      this.dataElements = response.data.content;
    }, (error: { message: string; }) => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
    });
  }

  submitForm(form: FormGroup) {
    if (this.flowKeyService.form.valid) {
      this.flowKeyService.updateFlowKey(this.flowKeyService.form.value)
        .subscribe((response: { message: string; }) => {
          this.notifierService.showNotification(response.message, 'OK', 'success');
          this.onClose();
        }, (error: { message: string; }) => {
          this.notifierService.showNotification(error.message, 'OK', 'error');
        });
    }
  }

  onClose() {
    this.flowKeyService.form.reset();
    this.dialogRef.close();
  }

  mapDataElement() {
    let data = {
      dataElementUuid: this.myControl.value.uuid,
      rapidProFlowKeyUuid: this.data.uuid
    };


    this.flowKeyService.mapDataElement(data).subscribe((response: any) => {
      this.notifierService.showNotification(response.message, 'OK', 'success');
      this.flowService.findKeysWithCategoriesByFlowUuid(this.data.flowUuid);

    }, (error: { message: string; }) => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
      this.flowService.findKeysWithCategoriesByFlowUuid(this.data.flowUuid);
    });
    this.dialogRef.close();
  }

  displayFn(dataElement: any): string {
    this.selectedDataElement = dataElement.uuid;
    return dataElement && dataElement.name ? dataElement.name : '';
  }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    return this.dataElements.filter((option: { name: string; }) => option.name.toLowerCase().includes(filterValue));
  }
}

