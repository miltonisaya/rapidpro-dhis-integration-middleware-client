import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {NotifierService} from "../../notification/notifier.service";
import {RoleService} from "../role.service";
import {FlexModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDivider} from "@angular/material/divider";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {CdkDrag, CdkDropList, DragDropModule} from "@angular/cdk/drag-drop";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-role-dialog',
  templateUrl: 'role-dialog-component.html',
  standalone: true,
  providers: [RoleService],
  imports: [
    FlexModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDivider,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    CommonModule,
    CdkTextareaAutosize,
    MatLabel,
    CdkDropList,
    CdkDrag,
    MatList,
    MatListItem,
    DragDropModule,
    MatIcon
  ],
  styleUrls: ['role-dialog.component.css']
})

export class RoleDialogComponent implements OnInit {
  params: { page: number; size: number; sort: string } = {size: 10, page: 0, sort: 'name'};

  constructor(
    public roleService: RoleService,
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    public notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.roleService.populateForm(this.data);
  }

  submitForm(): void {
    if (this.roleService.form.valid) {
      if (this.roleService.form.get('uuid')?.value) {
        this.roleService.update(this.roleService.form.value)
          .subscribe((response) => {
            console.log('Response =>', response);
            // this.notifierService.showNotification(response.message, 'OK', 'success');
            this.dialogRef.close();
            this.onClose();
          }, error => {
            console.log('Error =>', error);

            // this.notifierService.showNotification(error.error.error, 'OK', 'error');
          });
      } else {
        this.roleService.create(this.roleService.form.value)
          .subscribe(data => {
            this.onClose();
          }, error => {
            this.notifierService.showNotification(error.message, 'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.roleService.form.reset();
    this.roleService.initializeFormGroup();
    this.dialogRef.close();
  }
}
