import {Component, EventEmitter, Input, Output, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DialogComponent} from '../dialog-component';
import {NotifierService} from '../../modules/notification/notifier.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    DialogComponent
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnDestroy {
  @Input() open: boolean = false;
  @Output() onClose = new EventEmitter<boolean>();

  passwordForm: FormGroup;
  isLoading: boolean = false;
  hideCurrentPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  private destroy$ = new Subject<void>();
  private apiUrl = `${environment.baseURL}/api/v1/users`;

  constructor(
    private http: HttpClient,
    private notifierService: NotifierService
  ) {
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]),
      confirmPassword: new FormControl('', [Validators.required])
    }, {validators: this.passwordMatchValidator});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);

    const valid = hasUpperCase && hasLowerCase && hasNumeric;
    return valid ? null : {weakPassword: true};
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : {passwordMismatch: true};
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      const userJson = localStorage.getItem('ZAN_AFYA_MAONI_USER');
      if (!userJson) {
        this.notifierService.showNotification('User session not found', 'OK', 'error');
        this.isLoading = false;
        return;
      }

      const currentUser = JSON.parse(userJson);
      const payload = {
        uuid: currentUser.uuid,
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };

      this.http.put<{message: string}>(`${this.apiUrl}/change-password`, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.notifierService.showNotification(response.message || 'Password changed successfully', 'OK', 'success');
            this.isLoading = false;
            this.passwordForm.reset();
            this.onClose.emit(true);
          },
          error: (error) => {
            this.notifierService.showNotification(error.error?.message || 'Failed to change password', 'OK', 'error');
            this.isLoading = false;
          }
        });
    }
  }

  handleClose(): void {
    this.passwordForm.reset();
    this.onClose.emit(false);
  }

  getPasswordStrengthClass(): string {
    const password = this.passwordForm.get('newPassword')?.value || '';
    if (password.length === 0) return '';
    if (password.length < 8) return 'weak';

    let strength = 0;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength < 3) return 'weak';
    if (strength === 3) return 'medium';
    return 'strong';
  }

  hasMinLength(): boolean {
    const password = this.passwordForm.get('newPassword')?.value || '';
    return password.length >= 8;
  }

  hasUppercase(): boolean {
    const password = this.passwordForm.get('newPassword')?.value || '';
    return /[A-Z]/.test(password);
  }

  hasLowercase(): boolean {
    const password = this.passwordForm.get('newPassword')?.value || '';
    return /[a-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.passwordForm.get('newPassword')?.value || '';
    return /[0-9]/.test(password);
  }
}
