import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {NotifierService} from "../../modules/notification/notifier.service";
import {Router} from "@angular/router";
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatFormField} from '@angular/material/form-field';
import {MatCard, MatCardContent} from '@angular/material/card';
import {FlexModule} from '@angular/flex-layout';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    FlexModule,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatButton
  ]
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

  loginProcess(): void {
    this.authService.login(this.loginFormGroup.value)
      .subscribe(response => {
        if (response.data.user) {
          this.notifierService.showNotification(response.message, 'OK', 'success');
          this.router.navigate(['/contacts']);
        }
      }, error => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      });
  }
}
