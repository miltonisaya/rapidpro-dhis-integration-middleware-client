import {ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {LoaderService} from "../../modules/loader/loader.service";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrl: './default.component.css',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [MatSidenavContainer, MatSidenav, SidebarComponent, MatSidenavContent, MatToolbar, MatIcon, RouterOutlet, MatMenuTrigger, MatMenu, MatMenuItem, AsyncPipe, MatProgressSpinner, NgIf]
})
export class DefaultComponent {
  title: string = "ZanAfyaMaoni Interoperability Middleware";

  constructor(
    private router: Router,
    protected loaderService: LoaderService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  signOut(): void {
    localStorage.setItem("ZAN_AFYA_MAONI_USER", "");
    this.router.navigate(["login"]);
  }

  ngAfterContentChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
}
