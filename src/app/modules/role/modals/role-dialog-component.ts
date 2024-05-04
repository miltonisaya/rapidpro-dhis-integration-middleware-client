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
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {MatList, MatListItem} from "@angular/material/list";

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
    DragDropModule
  ],
  styleUrls: ['role-dialog.component.css']
})

export class RoleDialogComponent implements OnInit {
  originalList: string[] = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10'
  ];

  selectedList: string[] = [];
  selectedOriginal: string[] = [];
  selectedSelected: string[] = [];

  addToSelected(): void {
    this.selectedList.push(...this.selectedOriginal);
    this.originalList = this.originalList.filter(item => !this.selectedOriginal.includes(item));
    this.selectedOriginal = [];
  }

  removeFromSelected(): void {
    this.originalList.push(...this.selectedSelected);
    this.selectedList = this.selectedList.filter(item => !this.selectedSelected.includes(item));
    this.selectedSelected = [];
  }

  onSelectOriginal(item: string): void {
    const index = this.selectedOriginal.indexOf(item);
    if (index > -1) {
      this.selectedOriginal.splice(index, 1);
    } else {
      this.selectedOriginal.push(item);
    }
  }

  onSelectSelected(item: string): void {
    const index:number = this.selectedSelected.indexOf(item);
    if (index > -1) {
      this.selectedSelected.splice(index, 1);
    } else {
      this.selectedSelected.push(item);
    }
  }

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

  submitForm(data: any): void {
    // Ensure the form and the uuid form control exist before trying to access its value
    if (this.roleService.form?.get('uuid')?.value) {
      this.roleService.update(this.roleService.form.value)
        .subscribe(response => {
          console.log("Response =>", response);
          // this.notifierService.showNotification(response.message, 'OK', 'success');
          this.onClose();
        }, error => {
          // Using optional chaining and nullish coalescing to handle possible null values
          this.notifierService.showNotification(error?.error?.error ?? 'Unknown error', 'OK', 'error');
        });
    }
  }

  onClose() {
    this.roleService.form.reset();
    this.roleService.initializeFormGroup();
    this.dialogRef.close();
  }
}
