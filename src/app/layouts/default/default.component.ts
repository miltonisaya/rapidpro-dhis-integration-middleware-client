import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDivider} from "@angular/material/divider";
import {CurrentUser} from "../../auth/types/auth.types";
import {ChangePasswordComponent} from "../../components/change-password/change-password.component";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrl: './default.component.css',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    MatSidenavContainer,
    MatSidenav,
    SidebarComponent,
    MatSidenavContent,
    MatToolbar,
    MatIcon,
    RouterOutlet,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    AsyncPipe,
    MatProgressSpinner,
    NgIf,
    MatIconButton,
    MatTooltip,
    MatDivider,
    ChangePasswordComponent
  ]
})
export class DefaultComponent implements OnInit {
  title: string = "ZanAfyaMaoni Interoperability Middleware";
  userName: string = '';
  userEmail: string = '';
  changePasswordDialogOpen: boolean = false;

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    const currentUserJson = localStorage.getItem('ZAN_AFYA_MAONI_USER');
    if (currentUserJson) {
      const user: CurrentUser = JSON.parse(currentUserJson);
      this.userName = user.name || 'User';
      this.userEmail = user.email || '';
    }
  }

  openHelp(): void {
    // Open help dialog or navigate to help page
    window.open('https://docs.zanafyamaoni.go.tz/help', '_blank');
  }

  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  openChangePassword(): void {
    this.changePasswordDialogOpen = true;
  }

  handlePasswordDialogClose(event: boolean): void {
    this.changePasswordDialogOpen = false;
  }

  signOut(): void {
    localStorage.removeItem("ZAN_AFYA_MAONI_USER");
    this.router.navigate(["login"]);
  }
}
