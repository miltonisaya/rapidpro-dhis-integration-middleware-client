import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDivider } from '@angular/material/divider';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
    standalone: true,
    imports: [MatDivider, DatePipe],
})
export class FooterComponent {
  date: Date = new Date();

}
