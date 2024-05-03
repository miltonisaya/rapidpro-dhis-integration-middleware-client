import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from "@angular/common";
import {LoginComponent} from "./layouts/login/login.component";
import {AuthService} from "./auth/auth.service";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {ContactComponent} from "./modules/contact/contact.component";
import {RoleComponent} from "./modules/role/role.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoginComponent,
    FormsModule,
    ContactComponent,
    RoleComponent
  ],
  providers: [AuthService]
})
export class AppComponent {}
