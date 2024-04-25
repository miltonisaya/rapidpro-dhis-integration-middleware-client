import { Component } from '@angular/core';
import { BarchartComponent } from '../../widgets/barchart/barchart.component';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { FlexModule } from '@angular/flex-layout';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: true,
    imports: [FlexModule, MatCard, MatCardTitle, MatCardContent, BarchartComponent]
})
export class DashboardComponent {

}
