import {Component, CUSTOM_ELEMENTS_SCHEMA, Inject, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {UserService} from '../user.service';
import {NotifierService} from "../../notification/notifier.service";
import {RoleService} from "../../role/role.service";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatDivider} from "@angular/material/divider";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatButton} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {AsyncPipe, JsonPipe, NgForOf} from "@angular/common";
import {RoleApiResponse} from "../../role/types/RoleApiResponse";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {startWith, switchMap} from "rxjs/operators";
import {Observable} from "rxjs";
import {OrganisationUnitService} from "../../organisation-unit/organisation-unit.service";
import {OrganisationUnit} from "../../organisation-unit/types/OrganisationUnit";

@Component({
  selector: 'app-user-dialog',
  templateUrl: 'user-dialog-component.html',
  standalone: true,
  styleUrls: ['user-dialog.component.css'],
  imports: [
    NgForOf,
    MatTableModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDivider,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    JsonPipe,
    AsyncPipe,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatLabel
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [UserService, RoleService]
})

export class UserDialogComponent implements OnInit {
  roles: any = [];
  params: { pageNo: number; pageSize: number; sortBy: string };
  pageSize = 10;
  pageNo: number = 0;
  filteredOrganisationUnits: any;
  selectedOrganisationUnit: any;
  myControl = new FormControl();

  constructor(
    public userService: UserService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    public notifierService: NotifierService,
    public roleService: RoleService,
    public organisationUnitService: OrganisationUnitService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.userService.populateForm(this.data);
    this.getRoles();
    this.filteredOrganisationUnits = this.myControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filter(value || ''))
    );
  }

  submitForm(form: FormGroup) {
    if (this.userService.form.valid) {
      if (this.userService.form.get('uuid')?.value) {
        this.userService.updateUser(this.userService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message, 'OK', 'success');
            this.onClose();
          });
      } else {
        this.userService.create(this.userService.form.value)
          .subscribe(data => {
            this.onClose();
          }, error => {
            this.notifierService.showNotification(error.error.error, 'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.dialogRef.close();
    this.userService.form.reset();
    this.userService.initializeFormGroup();
  }

  getRoles() {
    this.params = {
      "pageNo": this.pageNo,
      "pageSize": this.pageSize,
      "sortBy": "name"
    }

    return this.roleService.get(this.params).subscribe((response: RoleApiResponse) => {
      this.roles = response.data;
    }, error => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
    });
  }

  displayFn(organisationUnit: OrganisationUnit): string {
    this.selectedOrganisationUnit = organisationUnit;
    return organisationUnit && organisationUnit.name ? organisationUnit.name : '';
  }

  private _filter(searchTerm: string): Observable<any[]> {
    let params = {
      page: 0,
      size: 100,
      sort: 'name',
      name: searchTerm
    };
    return this.organisationUnitService.search(params);
  }
}
