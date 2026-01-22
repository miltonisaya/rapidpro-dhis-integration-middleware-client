import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BreadcrumbComponent, BreadcrumbItem} from '../../shared/breadcrumb/breadcrumb.component';
import {NotifierService} from '../notification/notifier.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CurrentUser} from '../../auth/types/auth.types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    BreadcrumbComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  title: string = 'My Profile';
  breadcrumbItems: BreadcrumbItem[] = [
    {label: 'Home', url: '/dashboard', icon: 'home'},
    {label: 'My Profile'}
  ];

  profileForm: FormGroup;
  currentUser: CurrentUser | null = null;
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();
  private apiUrl = `${environment.baseURL}/api/v1/users`;

  constructor(
    private http: HttpClient,
    private notifierService: NotifierService
  ) {
    this.profileForm = new FormGroup({
      uuid: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCurrentUser(): void {
    const userJson = localStorage.getItem('ZAN_AFYA_MAONI_USER');
    if (userJson) {
      this.currentUser = JSON.parse(userJson);
      this.profileForm.patchValue({
        uuid: this.currentUser?.uuid || '',
        name: this.currentUser?.name || '',
        email: this.currentUser?.email || '',
        phone: this.currentUser?.phone || ''
      });
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid && this.currentUser) {
      this.isLoading = true;
      const payload = {
        uuid: this.profileForm.value.uuid,
        name: this.profileForm.value.name,
        email: this.profileForm.value.email,
        phone: this.profileForm.value.phone
      };

      this.http.put<{message: string}>(`${this.apiUrl}/${payload.uuid}`, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            // Update localStorage with new user info
            if (this.currentUser) {
              this.currentUser.name = payload.name;
              this.currentUser.email = payload.email;
              this.currentUser.phone = payload.phone;
              localStorage.setItem('ZAN_AFYA_MAONI_USER', JSON.stringify(this.currentUser));
            }
            this.notifierService.showNotification(response.message || 'Profile updated successfully', 'OK', 'success');
            this.isLoading = false;
          },
          error: (error) => {
            this.notifierService.showNotification(error.error?.message || 'Failed to update profile', 'OK', 'error');
            this.isLoading = false;
          }
        });
    }
  }

}
