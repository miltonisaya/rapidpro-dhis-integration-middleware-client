import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {NotifierService} from "../../modules/notification/notifier.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginFormGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private notifierService: NotifierService,
    private router: Router
    ) {
  }

  loginProcess():void {
    this.authService.login(this.loginFormGroup.value)
      .subscribe(response => {
        if (response.data.user) {
          this.notifierService.showNotification(response.message, 'OK', 'success');
          this.router.navigate(['/dashboard']);
        }
      }, error => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      });
  }
}
