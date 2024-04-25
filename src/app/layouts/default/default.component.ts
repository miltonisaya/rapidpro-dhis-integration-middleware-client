import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';

@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    styleUrl: './default.component.css',
    standalone: true,
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
    imports: [MatSidenavContainer, MatSidenav, SidebarComponent, MatSidenavContent, MatToolbar, MatIcon, RouterOutlet]
})
export class DefaultComponent {
  title: string = "ZanAfyaMaoni Interoperability Middleware";

}
