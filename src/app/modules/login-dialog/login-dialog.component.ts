import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../auth/auth.service";
import {NotifierService} from "../notification/notifier.service";
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FlexModule } from '@angular/flex-layout';
import {MatButton} from "@angular/material/button";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.css'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    standalone: true,
    imports: [ReactiveFormsModule, FlexModule, MatFormField, MatLabel, MatIcon, MatInput, MatButton, CommonModule]
})
export class LoginDialogComponent {
  formGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    public authService: AuthService,
    public notifierService: NotifierService,
    public router: Router,
    public dialog: MatDialog
  ) {
  }

  loginProcess() {
    this.authService.login(this.formGroup.value)
      .subscribe(response => {
        if (response.data.user) {
          this.notifierService.showNotification(response.message, 'OK', 'success');
          // @ts-ignore
          let currentRoute = JSON.parse(localStorage.getItem("CURRENT_ROUTE"));
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`${currentRoute}`])
          });
          this.dialog.closeAll();
        }
      }, error => {
        this.notifierService.showNotification(error.error.message, 'OK', 'error');
      });
  }
}
