import {AfterViewInit, Component, TemplateRef, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {RoleService} from "./role.service";
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FlexModule} from '@angular/flex-layout';
import {RoleDialogComponent} from "./modals/role-dialog-component";
import {CommonModule} from "@angular/common";
import {merge, of as observableOf, startWith, switchMap} from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent} from "@angular/material/dialog";

@Component({
  selector: 'app-roles',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
  standalone: true,
  imports: [
    FlexModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatPaginator,
    RoleDialogComponent,
    CommonModule,
    MatProgressSpinner,
    MatSort,
    MatSortHeader,
    MatButton,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
  providers: [
    RoleService
  ]
})

export class RoleComponent implements AfterViewInit {
  displayedColumns: string[] = ['number', 'name', 'code', 'description', 'actions'];
  pageSizeOptions: number[] = [10, 20, 50, 100, 250, 500, 1000];
  data: Role[] = [];
  roleUuid: string;
  resultsLength = 0;
  isLoadingResults = true;
  areRecordsAvailable = false;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private roleService: RoleService,
    private dialogService: MatDialog
  ) {
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.roleService!.get(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.direction
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.areRecordsAvailable = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.total;
          return data.data;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  openDeleteDialog(uuid: string) {
    this.roleUuid = uuid;
    this.dialogService.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      // this.getUsers();
    });
  }

  openDialog(row: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (row) {
      const contactData = {
        uuid: row.uuid,
        name: row.name,
        code: row.code,
        description: row.description
      };
      dialogConfig.data = contactData;
      this.roleService.populateForm(contactData);
      this.dialogService.open(RoleDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        // this.getContacts();
      });
    } else {
      dialogConfig.data = {};
      this.dialogService.open(RoleDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        // this.getContacts();
      });
    }
  }

  delete() {
    console.log('Role deleted clicked');
    this.roleService.delete(this.roleUuid).subscribe({
      next: (response) => {
        console.log('Role deleted successfully', response);
        // Update the UI or state as necessary
        // For example, refresh the list of roles if you have one
      },
      error: (error) => {
        console.error('Error deleting role:', error);
        // Optionally handle errors, e.g., show a notification or message to the user
      }
    });
    this.dialogService.closeAll();
  }
}

export interface ApiResponse {
  data: Role[];
  page: number;
  size: number;
  status: number;
  total: number;
}

export interface Role {
  name: string;
  code: string;
  description: string;
  uuid: string;
}
