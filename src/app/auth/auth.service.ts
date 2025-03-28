import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from "../../environments/environment";
import {NotifierService} from "../modules/notification/notifier.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.baseURL + "/api/v1/users/auth/authenticate";
  currentUserValue: any;

  constructor(
    private http: HttpClient,
    private notifierService: NotifierService,
    private router: Router,
    handler: HttpBackend
  ) {
    this.http = new HttpClient(handler);

  }

  login(data: any) {
    console.log("Login Data =>", data);
    return this.http.post<any>(this.url, data).pipe(
      tap(response => {
        const token = response.data.token;
        const currentUser = response.data.user;
        this.currentUserValue = currentUser;
        currentUser.token = token;
        currentUser.menus = response.data.menus;
        currentUser.isSuperAdministrator = response.data.isSuperAdmin;
        console.log("Current User =>", currentUser);
        localStorage.setItem("ZAN_AFYA_MAONI_USER", JSON.stringify(currentUser));
      }),
    );
  }

  getToken() {
    // @ts-ignore
    let user = JSON.parse(localStorage.getItem("ZAN_AFYA_MAONI_USER"))
    return user.token;
  }

  signOut() {
    localStorage.removeItem('ZAN_AFYA_MAONI_USER');
    this.notifierService.showNotification('Logged out successfully', 'OK', 'success');
    this.router.navigate(["/login"]);
  }
}
