import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";
import {NotifierService} from "../modules/notification/notifier.service";
import {CurrentUser, LoginCredentials, LoginResponse} from "./types/auth.types";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.baseURL + "/api/v1/users/auth/authenticate";
  currentUserValue: CurrentUser | null = null;

  constructor(
    private http: HttpClient,
    private notifierService: NotifierService,
    private router: Router,
    handler: HttpBackend
  ) {
    this.http = new HttpClient(handler);
  }

  login(data: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url, data).pipe(
      tap(response => {
        const token = response.data.token;
        const currentUser: CurrentUser = {
          ...response.data.user,
          token: token,
          menus: response.data.menus,
          isSuperAdministrator: response.data.isSuperAdmin
        };
        this.currentUserValue = currentUser;
        localStorage.setItem("ZAN_AFYA_MAONI_USER", JSON.stringify(currentUser));
      }),
    );
  }

  getToken(): string | null {
    const userJson = localStorage.getItem("ZAN_AFYA_MAONI_USER");
    if (!userJson) {
      return null;
    }
    const user: CurrentUser = JSON.parse(userJson);
    return user.token;
  }

  getCurrentUser(): CurrentUser | null {
    const userJson = localStorage.getItem("ZAN_AFYA_MAONI_USER");
    if (!userJson) {
      return null;
    }
    return JSON.parse(userJson);
  }

  signOut(): void {
    localStorage.removeItem('ZAN_AFYA_MAONI_USER');
    this.currentUserValue = null;
    this.notifierService.showNotification('Logged out successfully', 'OK', 'success');
    this.router.navigate(["/login"]);
  }
}
