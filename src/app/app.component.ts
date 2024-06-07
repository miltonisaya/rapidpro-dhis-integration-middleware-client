import {AfterContentChecked, ChangeDetectorRef, Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from "@angular/common";
import {LoginComponent} from "./layouts/login/login.component";
import {AuthService} from "./auth/auth.service";
import {FormsModule} from "@angular/forms";
import {ContactComponent} from "./modules/contact/contact.component";
import {RoleComponent} from "./modules/role/role.component";
import {LoaderService} from "./modules/loader/loader.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MenuGroupComponent} from "./modules/menu-group/menu-group.component";
import {MenuItemComponent} from "./modules/menu-item/menu-item.component";
import {MatProgressBar} from "@angular/material/progress-bar";

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
    RoleComponent,
    MenuGroupComponent,
    MenuItemComponent,
    MatProgressSpinner,
    MatProgressBar
  ],
  providers: [AuthService],
})
export class AppComponent implements AfterContentChecked {
  constructor(
    protected loaderService: LoaderService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngAfterContentChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
}
