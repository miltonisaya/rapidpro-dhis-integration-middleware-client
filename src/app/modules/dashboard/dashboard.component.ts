import { Component, OnInit } from '@angular/core';
import { BarchartComponent } from '../../widgets/barchart/barchart.component';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { FlexModule } from '@angular/flex-layout';
import { StatsComponent } from '../stat-component/stat.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [
    FlexModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    BarchartComponent,
    StatsComponent,
    NgFor,
  ],
})
export class DashboardComponent implements OnInit {
  stats: any[];

  ngOnInit() {
    this.stats = [
      {
        title: 'Total Revenue',
        percentage: '+32.40%',
        value: '$150,243.00',
        icon: 'trending_up',
        description: 'vs last week $123,235.00',
        status: 'up',
      },
      {
        title: 'Total Orders',
        percentage: '-12.40%',
        value: '$23,456.00',
        icon: 'credit_card',
        description: 'vs last week $72,235.00',
        status: 'down',
      },
      {
        title: 'Total Customers',
        percentage: '+2.40%',
        value: '$82,234.00',
        icon: 'group',
        description: 'vs last week $30,235.00',
        status: 'up',
      },
      {
        title: 'Total Projects',
        percentage: '-1.40%',
        value: '$82,234.00',
        icon: 'credit_card',
        description: 'vs last week 200,000.00',
        status: 'down',
      },
    ];
  }
}
