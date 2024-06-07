import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';

import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-stats',
  templateUrl: './stat.component.html',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, NgFor, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class StatsComponent {
  @Input() stat: any;
}
