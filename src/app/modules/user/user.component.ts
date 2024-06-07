import {Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {JsonPipe, NgForOf} from "@angular/common";
import {User} from "./types/User";

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
    JsonPipe
  ],
  providers: [UserService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = ["sno", 'name', 'email', 'roles', 'actions'];
  users: any = [];
  userId: string;
  dataSource: MatTableDataSource<User>;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageSize: number = 10;
  pageNo: number = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  private params: { pageNo: number; pageSize: number };

  constructor(
    private userService: UserService,
    private notifierService: NotifierService,
    private matDialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  /**
   * This method returns users
   */
  getUsers() {
    this.params = {
      "pageNo": this.pageNo,
      "pageSize": this.pageSize
    }

    return this.userService.getUsers(this.params).subscribe((response: any) => {
      this.users = response.data;
      this.dataSource = new MatTableDataSource<User>(this.users);
    }, error => {
      this.notifierService.showNotification(error.error.message, 'OK', 'error');
      console.log(error);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditDialog(data?: any): void {
    console.log("Edit user data =>",data);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (data) {
      const userData = {
        id: data.uuid,
        email: data.email,
        name: data.name,
        phone: data.phone,
        roles: data.roles
      };
      this.userService.populateForm(userData);
      this.matDialog.open(UserDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getUsers();
      });
    } else {
      dialogConfig.data = {};
      this.matDialog.open(UserDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getUsers();
      });
    }
  }

  openDeleteDialog(uuid: string) {
    this.userId = uuid;
    this.matDialog.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getUsers();
    });
  }

  delete() {
    this.userService.delete(this.userId)
      .subscribe(response => {
        this.notifierService.showNotification(response.message, 'OK', 'success');
      }, error => {
        this.notifierService.showNotification(error.error.message, 'OK', 'error');
      });
    this.matDialog.closeAll();
  }

  pageChanged(e: any) {
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getUsers();
  }
}
