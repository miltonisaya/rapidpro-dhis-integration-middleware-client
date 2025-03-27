import {Component, OnInit} from '@angular/core';
import {BarchartComponent} from '../../widgets/barchart/barchart.component';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FlexModule} from '@angular/flex-layout';
import {MatDivider} from "@angular/material/divider";
import {CommonModule} from "@angular/common";
import {TransactionsService} from "../transactions/transactions.service";
import {ContactService} from "../contact/contact.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [FlexModule, MatCard, MatCardTitle, MatCardContent, BarchartComponent, MatDivider, CommonModule],
  providers: [ContactService, TransactionsService]
})
export class DashboardComponent implements OnInit {
  title: string = "Dashboard";
  totalRegisteredClients: number;
  totalRegisteredClientsThisYear: number;
  totalRegisteredClientsThisMonth: number;
  totalRegisteredClientsToday: number;
  transactions: any;

  constructor(
    private contactService: ContactService,
    private dashboardService: TransactionsService
  ) {
  }

  ngOnInit() {
    this.getTotalRegisteredClientsThisMonth();
    this.getTotalRegisteredClientsToday();
    this.getTotalRegisteredClients();
    this.getTotalRegisteredClientsThisYear();
    this.getTransactionLogs();
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

  getTransactionLogs() {
    this.dashboardService.get().subscribe(response => {
      this.transactions = response.data;
    })
  }
}
