import {Component, CUSTOM_ELEMENTS_SCHEMA, Inject, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {AuthorityService} from "../../../authority/authority.service";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import {JsonPipe, KeyValuePipe, NgForOf} from "@angular/common";
import {MatFormField} from "@angular/material/form-field";
import {MatListOption, MatSelectionList} from "@angular/material/list";
import {RoleAuthority} from "../../types/RoleAuthority";

@Component({
  selector: 'app-permissions-dialog',
  templateUrl: 'permissions-dialog-component.html',
  styleUrls: ['permissions-dialog.component.css'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  imports: [MatDialogModule, MatButtonModule, MatCard, MatCardContent, MatCardHeader, MatCheckbox, ReactiveFormsModule, FlexLayoutModule, NgForOf, MatFormField, JsonPipe, MatSelectionList, MatListOption, KeyValuePipe],
})
export class RolePermissionDialog implements OnInit {
  roleAuthorities: RoleAuthority[];

  constructor(
    public authorityService: AuthorityService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.getAuthoritiesByRole();
    this.authorityService.initializeFormGroup(this.data);
  }

  getAuthoritiesByRole() {
    this.authorityService.findByRole(this.data).subscribe(response => {
      this.roleAuthorities = response.data;
      this.authorityService.initAuthorities(response.data);
      // console.log('Api response =>', response.data);
    })
  }

  submitForm() {
    console.log('Form Values =>', this.authorityService.form.value);
  }
}
