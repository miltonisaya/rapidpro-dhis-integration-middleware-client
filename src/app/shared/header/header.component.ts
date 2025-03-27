import { Component } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: true,
    imports: [MatToolbar, MatIconButton, MatIcon, FlexModule]
})
export class HeaderComponent {

  toggleSidebar() {

  }
}
