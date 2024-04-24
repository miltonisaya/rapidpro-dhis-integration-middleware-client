import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../auth/auth.service";
import {NotifierService} from "../notification/notifier.service";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent {
  formGroup: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
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
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      });
  }
}
