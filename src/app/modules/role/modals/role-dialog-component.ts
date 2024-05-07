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
import {Authority} from "../../authority/types/Authority";
import {MatIcon} from "@angular/material/icon";
import {AuthorityService} from "../../authority/authority.service";
import {AuthorityApiResponse} from "../../authority/types/AuthorityApiResponse";
import {PickListModule} from "primeng/picklist";

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
    MatIcon,
    PickListModule
  ],
  styleUrls: ['role-dialog.component.css']
})

export class RoleDialogComponent implements OnInit {
  params: { page: number; size: number; sort: string } = {size: 10, page: 0, sort: 'name'};
  availableAuthorities: Authority[];
  assignedAuthorities: Authority[];

  constructor(
    public roleService: RoleService,
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    public notifierService: NotifierService,
    public authorityService: AuthorityService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.roleService.populateForm(this.data);
    this.assignedAuthorities = this.data.authorities;
    this.initializeAuthorities(); //Fetch all the authorities existing in the DB
  }

  initializeAuthorities(): void {
    this.params.size = 1000;
    this.params.page = 0;
    this.params.sort = 'name';

    this.assignedAuthorities = this.data.authorities; //Authorities which have been assigned to the current role
    this.authorityService.get(this.params).subscribe((response: AuthorityApiResponse): void => {
      this.availableAuthorities = response.data;
      this.removeAssignedAuthorities();
    });
  }

  removeAssignedAuthorities() {
    const assignedIds = new Set(this.assignedAuthorities.map(auth => auth.uuid));
    this.availableAuthorities = this.availableAuthorities.filter(auth => !assignedIds.has(auth.uuid));
  }

  submitForm(): void {
    if (this.roleService.form?.get('uuid')?.value) {
      this.roleService.update(this.roleService.form.value).subscribe((response) => {
        // this.notifierService.showNotification(response.message, 'OK', 'success');
        this.onClose();
      }, error => {
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
