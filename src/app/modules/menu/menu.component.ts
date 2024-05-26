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
import {MenuService} from "./menu.service";
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FlexModule} from '@angular/flex-layout';
import {MenuDialogComponent} from "./modals/menu-dialog-component";
import {CommonModule} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent} from "@angular/material/dialog";
import {Menu} from "./types/Menu";
import {Authority} from "../authority/types/Authority";
import {NotifierService} from "../notification/notifier.service";
import {MenuApiResponse} from "./types/MenuApiResponse";

@Component({
  selector: 'app-menus',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
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
    MenuDialogComponent,
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
    MenuService
  ]
})

export class MenuComponent implements OnInit {
  title: string = 'Menus';
  data: Menu[] = [];
  roleUuid: string;

  //Pagination starts here
  @ViewChild('paginator', {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Menu>([]);
  displayedColumns: string[] = ['number', 'name', 'icon', 'url','sortOrder', 'actions'];
  pageSize = 10;
  pageIndex = 0;
  params: { pageNo: number; pageSize: number; sortBy: string };
  pageNo: number = 0;
  totalRecords = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;

  constructor(
    private menuService: MenuService,
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
      "sortBy": "name"
    }

    return this.menuService.get(this.params).subscribe((response: MenuApiResponse) => {
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
    const dialogConfig = new MatDialogConfig();
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
      console.log('Form Data ->',formData);
      this.menuService.populateForm(formData);
      this.dialogService.open(MenuDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getMenus();
      });
    } else {
      dialogConfig.data = {};
      this.dialogService.open(MenuDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getMenus();
      });
    }
  }

  delete() {
    console.log('Menu deleted clicked');
    this.menuService.delete(this.roleUuid).subscribe({
      next: (response: MenuApiResponse) => {
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
      this.menuService.populateForm(roleData);
      this.dialogService.open(MenuDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.ngOnInit();
      });
    } else {
      dialogConfig.minWidth = '400px';
      this.dialogService.open(MenuDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.ngOnInit();
      });
    }
  }
}


