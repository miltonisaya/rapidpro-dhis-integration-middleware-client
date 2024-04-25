import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrl: './default.component.css',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [MatSidenavContainer, MatSidenav, SidebarComponent, MatSidenavContent, MatToolbar, MatIcon, RouterOutlet, MatMenuTrigger, MatMenu, MatMenuItem]
})
export class DefaultComponent {
  title: string = "ZanAfyaMaoni Interoperability Middleware";

  constructor(
    private router: Router
  ) {
  }

  signOut(): void {
    localStorage.setItem("ZAN_AFYA_MAONI_USER", "");
    this.router.navigate(["login"]);


  }
}
