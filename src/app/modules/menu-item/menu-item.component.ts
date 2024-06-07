import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FlexModule} from '@angular/flex-layout';
import {CommonModule} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent} from "@angular/material/dialog";
import {NotifierService} from "../notification/notifier.service";
import {MenuItemDialogComponent} from "./modals/menu-item-dialog-component";
import {MenuItemService} from "./menu-item.service";
import {MenuItem} from "./types/MenuItem";
import {MenuItemApiResponse} from "./types/MenuItemApiResponse";

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
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
    MenuItemDialogComponent,
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
    MenuItemService
  ], schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MenuItemComponent implements OnInit {
  title: string = 'MenuGroup Items';
  data: MenuItem[] = [];
  roleUuid: string;

  //Pagination starts here
  @ViewChild('paginator', {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<MenuItem> = new MatTableDataSource<MenuItem>([]);
  displayedColumns: string[] = ['number', 'name', 'icon', 'url', 'sortOrder', 'actions'];
  pageSize: number = 10;
  pageIndex: number = 0;
  params: { pageNo: number; pageSize: number; sortBy: string };
  pageNo: number = 0;
  totalRecords = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;

  constructor(
    private menuItemService: MenuItemService,
    private dialogService: MatDialog,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit() {
    this.getMenus();
  }

  pageChanged(e: any) {
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getMenus();
  }

  getMenus() {
    this.params = {
      "pageNo": this.pageNo,
      "pageSize": this.pageSize,
      "sortBy": "sortOrder"
    }

    return this.menuItemService.get(this.params).subscribe((response: MenuItemApiResponse) => {
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
      this.getMenus();
    });
  }

  openDialog(row: any): void {
    const dialogConfig: MatDialogConfig<any> = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (row) {
      const formData = {
        uuid: row.uuid,
        name: row.name,
        url: row.url,
        icon: row.icon,
        sortOrder: row.sortOrder
      };
      dialogConfig.data = formData;
      this.menuItemService.populateForm(formData);
      this.dialogService.open(MenuItemDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getMenus();
      });
    } else {
      dialogConfig.data = {};
      this.dialogService.open(MenuItemDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getMenus();
      });
    }
  }

  delete() {
    this.menuItemService.delete(this.roleUuid).subscribe({
      next: (response: MenuItemApiResponse) => {
        this.notifierService.showNotification(response.message, 'OK', 'error');
      },
      error: (error) => {
        this.notifierService.showNotification(error.error.message, 'OK', 'error');
      }
    });
    this.dialogService.closeAll();
  }

  openCreateDialog(data?: {
    uuid: string;
    name: string;
    url: string;
    icon: string;
    sortOrder: number;
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
        icon: data.icon,
        url: data.url,
        sortOrder: data.sortOrder
      };
      this.menuItemService.populateForm(roleData);
      this.dialogService.open(MenuItemDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.ngOnInit();
      });
    } else {
      dialogConfig.minWidth = '400px';
      this.dialogService.open(MenuItemDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.ngOnInit();
      });
    }
  }
}


