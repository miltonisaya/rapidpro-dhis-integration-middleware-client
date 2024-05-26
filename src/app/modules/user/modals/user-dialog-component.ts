import {Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {UsersService} from '../users.service';
import {NotifierService} from "../../notification/notifier.service";
import {RoleService} from "../../role/role.service";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatDivider} from "@angular/material/divider";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatButton} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {JsonPipe, NgForOf} from "@angular/common";

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
    JsonPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [UsersService, RoleService]
})

export class UserDialogComponent implements OnInit {
  roles: any = [];

  constructor(
    public usersService: UsersService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    public notifierService: NotifierService,
    public rolesService: RoleService
  ) {
  }

  ngOnInit() {
    this.getRoles();
  }

  submitForm(form: FormGroup) {
    if (this.usersService.form.valid) {
      if (this.usersService.form.get('uuid')?.value) {
        this.usersService.updateUser(this.usersService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message, 'OK', 'success');
            this.onClose();
          });
      } else {
        this.usersService.createUser(this.usersService.form.value)
          .subscribe(data => {
            this.onClose();
          }, error => {
            this.notifierService.showNotification(error.error.error, 'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.usersService.form.reset();
    this.usersService.initializeFormGroup();
    this.dialogRef.close();
  }

  /**
   * This method returns roles
   */
  getRoles() {
    const params = {
      pageNo: 1,
      pageSize: 1000,
      sortBy: 'name'
    }
    return this.rolesService.get(params).subscribe(response => {
      console.log("Roles =>", response);

      this.roles = response.data;
    }, (error) => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
    });
  }
}
