import {Component, CUSTOM_ELEMENTS_SCHEMA, Inject, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {FlowService} from "../../flow.service";
import {NotifierService} from "../../../notification/notifier.service";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {DataElementService} from "../../../data-element/data-element.service";
import {CategoryService} from "../../category.service";

@Component({
  selector: 'app-flow-key-dialog',
  templateUrl: 'possible-true-values-component.html',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    FlexLayoutModule,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatButton,
    MatDialogClose
  ],
  providers: [DataElementService, CategoryService, FlowService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  styleUrls: ['possible-true-values-dialog.component.sass']
})

export class PossibleTrueValuesComponent implements OnInit {
  possibleValuesForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public notifierService: NotifierService,
    public categoryService: CategoryService,
    public flowService: FlowService,
    public matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.initializeFormGroup();
  }

  initializeFormGroup() {
    this.possibleValuesForm = this.formBuilder.group({
      possibleTrueValues: ['']
    });
  }

  savePossibleTrueValues() {
    let payload = {
      categoryUuid: this.data.possibleTrueValues.uuid,
      possibleTrueValues: this.possibleValuesForm.value.possibleTrueValues
    }

    this.categoryService.savePossibleValues(payload).subscribe((response: any) => {
      if (response.status == '200') {
        this.notifierService.showNotification(response.message, 'OK', 'success');
        this.flowService.findKeysWithCategoriesByFlowUuid(this.data.flowUuid);
      }
    }, (error: { message: string; }) => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
      this.flowService.findKeysWithCategoriesByFlowUuid(this.data.flowUuid);
      console.log("fetched keys by flow with id " + this.data.flowUuid);
    });
    this.matDialog.closeAll();
  }
}

