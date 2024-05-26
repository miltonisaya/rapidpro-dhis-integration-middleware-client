import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
  MatTable,
  MatTableDataSource
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
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent} from "@angular/material/dialog";
import {Role} from "./types/Role";
import {Authority} from "../authority/types/Authority";
import {NotifierService} from "../notification/notifier.service";
import {RoleApiResponse} from "./types/RoleApiResponse";

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

export class RoleComponent implements OnInit {
  title: string = 'Roles';
  data: Role[] = [];
  roleUuid: string;

  //Pagination starts here
  @ViewChild('paginator', {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Role>([]);
  displayedColumns: string[] = ['number', 'name', 'code', 'description', 'actions'];
  pageSize = 10;
  pageIndex = 0;
  params: { pageNo: number; pageSize: number; sortBy: string };
  pageNo: number = 0;
  totalRecords = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;

  constructor(
    private roleService: RoleService,
    private dialogService: MatDialog,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit() {
    this.getRoles();
  }

  pageChanged(e: any) {
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getRoles();
  }

  getRoles() {
    this.params = {
      "pageNo": this.pageNo,
      "pageSize": this.pageSize,
      "sortBy": "name"
    }

    return this.roleService.get(this.params).subscribe((response: RoleApiResponse) => {
      this.dataSource.data = response.data || [];
      this.totalRecords = response.total ? response.total : 0;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
    });
  }

  openDeleteDialog(uuid: string) {
    this.roleUuid = uuid;
    this.dialogService.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getRoles();
    });
  }

  openDialog(row: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (row) {
      const roleData = {
        uuid: row.uuid,
        name: row.name,
        code: row.code,
        description: row.description,
        authorities: row.authorities
      };
      dialogConfig.data = roleData;
      this.roleService.populateForm(roleData);
      this.dialogService.open(RoleDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getRoles();
      });
    } else {
      dialogConfig.data = {};
      this.dialogService.open(RoleDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getRoles();
      });
    }
  }

  delete() {
    console.log('Menu deleted clicked');
    this.roleService.delete(this.roleUuid).subscribe({
      next: (response: RoleApiResponse) => {
        this.notifierService.showNotification(response.message, 'OK', 'error');
      },
      error: (error) => {
        this.notifierService.showNotification(error.message, 'OK', 'error');
      }
    });
    this.dialogService.closeAll();
  }

  openCreateDialog(data?: {
    uuid: string;
    name: string;
    description: string;
    code: string;
    authorities: Authority[]
  }): void {
    // console.log(data);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '400px';
    dialogConfig.height = 'auto';
    dialogConfig.panelClass = "dialog-config"
    if (data) {
      const roleData = {
        id: data.uuid,
        name: data.name,
        description: data.description,
        code: data.code,
      };
      this.roleService.populateForm(roleData);
      this.dialogService.open(RoleDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.ngOnInit();
      });
    } else {
      dialogConfig.minWidth = '400px';
      this.dialogService.open(RoleDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.ngOnInit();
      });
    }
  }
}


