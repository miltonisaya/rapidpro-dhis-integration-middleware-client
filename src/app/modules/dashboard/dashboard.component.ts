import {Component, OnInit} from '@angular/core';
import {BarchartComponent} from '../../widgets/barchart/barchart.component';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FlexModule} from '@angular/flex-layout';
import {ContactService} from "../contact/contact.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [FlexModule, MatCard, MatCardTitle, MatCardContent, BarchartComponent],
  providers: [ContactService]
})
export class DashboardComponent implements OnInit {
  title: string = "Dashboard";
  totalRegisteredClients: number;
  totalRegisteredClientsThisYear: number;
  totalRegisteredClientsThisMonth: number;
  totalRegisteredClientsToday: number;

  constructor(
    private contactService: ContactService
  ) {
  }

  ngOnInit() {
    this.getTotalRegisteredClientsThisMonth();
    this.getTotalRegisteredClientsToday();
    this.getTotalRegisteredClients();
    this.getTotalRegisteredClientsThisYear();
  }

  getTotalRegisteredClients() {
    this.contactService.getTotalRegisteredClients().subscribe(response => {
      this.totalRegisteredClients = response.data;
    });
  }

  getTotalRegisteredClientsThisYear() {
    this.contactService.getTotalRegisteredClientsThisYear().subscribe(response => {
      this.totalRegisteredClientsThisYear = response.data;
    });
  }

  getTotalRegisteredClientsThisMonth() {
    this.contactService.getTotalRegisteredClientsThisMonth().subscribe(response => {
      this.totalRegisteredClientsThisMonth = response.data;
    });
  }

  getTotalRegisteredClientsToday() {
    this.contactService.getTotalRegisteredClientsThisToday().subscribe(response => {
      this.totalRegisteredClientsToday = response.data;
    });
  }
}
