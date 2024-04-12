import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  date: Date = new Date();

}
