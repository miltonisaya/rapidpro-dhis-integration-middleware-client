import {Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatTable,
  MatTableDataSource,
  MatTableModule
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {UserService} from './user.service';
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent} from '@angular/material/dialog';
import {UserDialogComponent} from './modals/user-dialog-component';
import {NotifierService} from "../notification/notifier.service";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField} from "@angular/material/form-field";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {JsonPipe, NgForOf, UpperCasePipe} from "@angular/common";
import {User} from "./types/User";
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './user.component.html',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatButton,
    MatFormField,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatPaginator,
    MatDialogActions,
    MatDialogContent,
    MatDialogClose,
    MatInput,
    NgForOf,
    MatTableModule,
    JsonPipe,
    UpperCasePipe
  ],
  providers: [UserService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ["sno", 'name', 'email', 'roles','organisationUnit', 'actions'];
  users: User[] = [];
  totalUsers: number = 0;
  userId: string = '';
  dataSource: MatTableDataSource<User>;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<User>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageSize: number = 10;
  pageNo: number = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  private params: { pageNo: number; pageSize: number };
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private notifierService: NotifierService,
    private matDialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUsers(): void {
    this.params = {
      "pageNo": this.pageNo,
      "pageSize": this.pageSize
    };

    this.userService.getUsers(this.params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.users = response.data;
          this.totalUsers = response.total || this.users.length;
          this.dataSource = new MatTableDataSource<User>(this.users);
        },
        error: (error) => {
          this.notifierService.showNotification(error.error.message, 'OK', 'error');
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditDialog(data?: User): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (data) {
      dialogConfig.data = {
        uuid: data.uuid,
        email: data.email,
        name: data.name,
        phone: data.phone,
        roles: data.roles,
        organisationUnit: data?.organisationUnit
      };
    } else {
      dialogConfig.data = {};
    }
    this.matDialog.open(UserDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getUsers();
      });
  }

  openDeleteDialog(uuid: string): void {
    this.userId = uuid;
    this.matDialog.open(this.deleteDialog)
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getUsers();
      });
  }

  delete(): void {
    this.userService.delete(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.notifierService.showNotification(response.message, 'OK', 'success');
        },
        error: (error) => {
          this.notifierService.showNotification(error.error.message, 'OK', 'error');
        }
      });
    this.matDialog.closeAll();
  }

  pageChanged(e: { pageSize: number; pageIndex: number }): void {
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getUsers();
  }
}
