import {Component, OnDestroy, OnInit} from '@angular/core';
import {BarchartComponent} from '../../widgets/barchart/barchart.component';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FlexModule} from '@angular/flex-layout';
import {MatDivider} from "@angular/material/divider";
import {CommonModule} from "@angular/common";
import {TransactionsService} from "../transactions/transactions.service";
import {ContactService} from "../contact/contact.service";
import {Transaction} from "../transactions/types/Transaction";
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [FlexModule, MatCard, MatCardTitle, MatCardContent, BarchartComponent, MatDivider, CommonModule, MatIcon],
  providers: [ContactService, TransactionsService]
})
export class DashboardComponent implements OnInit, OnDestroy {
  title: string = "Dashboard";
  totalRegisteredClients: number = 0;
  totalRegisteredClientsThisYear: number = 0;
  totalRegisteredClientsThisMonth: number = 0;
  totalRegisteredClientsToday: number = 0;
  transactions: Transaction[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private contactService: ContactService,
    private dashboardService: TransactionsService
  ) {
  }

  ngOnInit(): void {
    this.getTotalRegisteredClientsThisMonth();
    this.getTotalRegisteredClientsToday();
    this.getTotalRegisteredClients();
    this.getTotalRegisteredClientsThisYear();
    this.getTransactionLogs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTotalRegisteredClients(): void {
    this.contactService.getTotalRegisteredClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.totalRegisteredClients = response.data;
      });
  }

  getTotalRegisteredClientsThisYear(): void {
    this.contactService.getTotalRegisteredClientsThisYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.totalRegisteredClientsThisYear = response.data;
      });
  }

  getTotalRegisteredClientsThisMonth(): void {
    this.contactService.getTotalRegisteredClientsThisMonth()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.totalRegisteredClientsThisMonth = response.data;
      });
  }

  getTotalRegisteredClientsToday(): void {
    this.contactService.getTotalRegisteredClientsThisToday()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.totalRegisteredClientsToday = response.data;
      });
  }

  getTransactionLogs(): void {
    this.dashboardService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.transactions = response.data;
      });
  }
}
