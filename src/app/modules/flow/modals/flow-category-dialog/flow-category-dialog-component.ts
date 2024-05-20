import {Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {NotifierService} from "../../../notification/notifier.service";
import {FlowKeyService} from "../../flowkey.service";
import {DataElementService} from "../../../data-element/data-element.service";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatDivider} from "@angular/material/divider";
import {MatFormField} from "@angular/material/form-field";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatInput} from "@angular/material/input";
import {AsyncPipe, CommonModule} from "@angular/common";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-flow-key-dialog',
  templateUrl: 'flow-category-dialog-component.html',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDialogTitle,
    MatDivider,
    MatDialogContent,
    MatFormField,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatInput,
    MatAutocomplete,
    MatOption,
    AsyncPipe,
    MatDialogActions,
    MatDialogClose,
    MatButton
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['flow-category-dialog.component.sass']
})

export class FlowCategoryDialogComponent implements OnInit {
  dataElements: any;
  filteredOptions: any;
  selectedDataElementYes: any;
  dataElement = new FormControl();

  constructor(
    public flowKeyService: FlowKeyService,
    public dialogRef: MatDialogRef<FlowCategoryDialogComponent>,
    public notifierService: NotifierService,
    public dataElementService: DataElementService,
    public flowService: FlowKeyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.getDataElements();
    this.filteredOptions = this.dataElement.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.dataElements)
      );
  }

  getDataElements() {
    let params = {
      pageSize: 1000
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

  mapCategoryAndDataElement() {
    let data = {
      dataElementUuid: this.dataElement.value.uuid,
      categoryId: this.data.id
    };

    this.flowKeyService.mapDataElementsWithCategory(data).subscribe((response: any) => {
      if (response.status == '201') {
        this.notifierService.showNotification(response.message, 'OK', 'success');
        this.flowService.getKeysByFlowUuid(this.data.flowUuid);
      }
    }, (error: { message: string; }) => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
      this.flowService.getKeysByFlowUuid(this.data.flowUuid);
      console.log("fetched keys by flow with uuid " + this.data.flowUuid);
    });
    this.dialogRef.close();
  }

  displayFn(dataElement: any): string {
    this.selectedDataElementYes = dataElement.uuid;
    return dataElement && dataElement.name ? dataElement.name : '';
  }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    return this.dataElements.filter((option: { name: string; }) => option.name.toLowerCase().includes(filterValue));
  }
}

