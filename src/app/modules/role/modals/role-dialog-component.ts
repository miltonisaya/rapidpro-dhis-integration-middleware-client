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
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDivider} from "@angular/material/divider";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {CdkDrag, CdkDropList, DragDropModule} from "@angular/cdk/drag-drop";
import {MatList, MatListItem} from "@angular/material/list";
import {Authority} from "../../authority/types/Authority";
import {MatIcon} from "@angular/material/icon";
import {AuthorityService} from "../../authority/authority.service";
import {AuthorityApiResponse} from "../../authority/types/AuthorityApiResponse";

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
  originalList: Authority[] = [];
  selectedList: Authority[] = [];
  selectedOriginal: Authority[] = [];
  selectedAuthorities: Authority[] = [];
  authorities: Authority[];
  params: { page: number; size: number; sort: string } = {size: 10, page: 0, sort: 'name'};

  addToSelected(): void {
    this.selectedList.push(...this.selectedOriginal);
    this.originalList = this.originalList.filter(item => !this.selectedOriginal.includes(item));
    this.selectedOriginal = [];

    //Add the selected items to the form
    const authorityArray = this.roleService.form.get('authorities') as FormArray;
    this.selectedList.forEach((auth) => {
      authorityArray.push(this.createAuthorityFormGroup(auth));
    });
  }

  removeFromSelected(): void {
    this.originalList.push(...this.selectedAuthorities);
    this.selectedList = this.selectedList.filter(item => !this.selectedAuthorities.includes(item));
    this.selectedAuthorities = [];

    //Remove the item from the form
    //Add the selected items to the form
    const authorityArray = this.roleService.form.get('authorities') as FormArray;
    this.selectedList.forEach((authority) => {
      authorityArray.reset();
      authorityArray.push(this.createAuthorityFormGroup(authority));
    });
  }

  onSelectOriginal(item: Authority): void {
    const index = this.selectedOriginal.indexOf(item);
    if (index > -1) {
      this.selectedOriginal.splice(index, 1);
    } else {
      this.selectedOriginal.push(item);
    }
  }

  onSelectSelected(item: Authority): void {
    const index: number = this.selectedAuthorities.indexOf(item);
    if (index > -1) {
      this.selectedAuthorities.splice(index, 1);
    } else {
      this.selectedAuthorities.push(item);
    }
  }

  constructor(
    public roleService: RoleService,
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    public notifierService: NotifierService,
    public authorityService: AuthorityService,
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.initializeAuthorities(); //Fetch all the authorities existing in the DB
    this.roleService.populateForm(this.data);
    this.selectedList = this.data.authorities;
  }

  initializeAuthorities(): void {
    this.params.size = 1000;
    this.params.page = 0;
    this.params.sort = 'name';

    this.authorityService.get(this.params).subscribe((response: AuthorityApiResponse): void => {
      this.authorities = response.data;
      //Perform the filter of the authorities
      this.selectedList = this.removeAssignedAuthorities(this.authorities, this.selectedList);
    });
  }

  createAuthorityFormGroup(authority: Authority): FormGroup {
    return this.fb.group({
      uuid: new FormControl(authority.uuid, Validators.required),
      name: new FormControl(authority.name, Validators.required),
      action: new FormControl(authority.action, Validators.required),
      resource: new FormControl(authority.resource, Validators.required)
    });
  }

  removeAssignedAuthorities(existingAuthorities: Authority[], assignedAuthorities: Authority[]) {
    const assignedIds = new Set(assignedAuthorities.map(auth => auth.uuid));
    return existingAuthorities.filter(auth => !assignedIds.has(auth.uuid));
  }

  submitForm(): void {
    // Ensure the form and the uuid form control exist before trying to access its value
    if (this.roleService.form?.get('uuid')?.value) {
      this.roleService.update(this.roleService.form.value).subscribe((response) => {
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
