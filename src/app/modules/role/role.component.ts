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
import {RoleService} from "./role.service";
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FlexModule} from '@angular/flex-layout';
import {RoleDialogComponent} from "./modals/role/role-dialog-component";
import {CommonModule} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Role} from "./types/Role";
import {Authority} from "../authority/types/Authority";
import {NotifierService} from "../notification/notifier.service";
import {RoleApiResponse} from "./types/RoleApiResponse";
import {MenuGroup} from "../menu-group/types/MenuGroup";
import {lastValueFrom} from "rxjs";
import {AuthorityService} from "../authority/authority.service";
import {DialogComponent} from "../../components/dialog-component";
import {MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {RoleAuthority} from "./types/RoleAuthority";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {BreakpointObserver} from "@angular/cdk/layout";

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
    DialogComponent,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCheckbox,
    MatGridList,
    MatGridTile
  ],
  providers: [
    RoleService
  ], schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class RoleComponent implements OnInit {
  title: string = 'Roles';
  data: Role[] = [];
  roleUuid: string;
  currentRole: any | null = null;
  permissionDialogOpen: boolean = false;

  //Permissions Config
  roleAuthorities: RoleAuthority[];
  selectedAuthorities: number[] = [];
  selectedPermissions: number[] = [111, 113];


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
    private authorityService: AuthorityService,
    private notifierService: NotifierService,
    private breakpointObserver: BreakpointObserver
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
      this.notifierService.showNotification(error.error.message, 'OK', 'error');
    });
  }

  openDeleteDialog(uuid: string) {
    this.roleUuid = uuid;
    // this.dialogService.open(this.deleteDialog)
    //   .afterClosed().subscribe(() => {
    //   this.getRoles();
    // });
  }

  openDialog(row: any): void {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    if (row) {
      const menuData: MenuGroup = {
        uuid: row.uuid,
        name: row.name,
        url: row.url,
        sortOrder: row.sortOrder,
        icon: row.icon
      };
      // dialogConfig.data = menuData;
      // this.roleService.populateForm(menuData);
      // this.dialogService.open(RoleDialogComponent, dialogConfig)
      //   .afterClosed().subscribe(() => {
      //   this.getRoles();
      // });
    } else {
      // dialogConfig.data = {};
      // this.dialogService.open(RoleDialogComponent, dialogConfig)
      //   .afterClosed().subscribe(() => {
      //   this.getRoles();
      // });
    }
  }

  delete() {
    this.roleService.delete(this.roleUuid).subscribe({
      next: (response: RoleApiResponse) => {
        this.notifierService.showNotification(response.message, 'OK', 'error');
      },
      error: (error) => {
        this.notifierService.showNotification(error.error.message, 'OK', 'error');
      }
    });
    // this.dialogService.closeAll();
  }

  openCreateDialog(data?: {
    uuid: string;
    name: string;
    description: string;
    code: string;
    authorities: Authority[]
  }): void {
    // console.log(data);
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.minWidth = '400px';
    // dialogConfig.height = 'auto';
    // dialogConfig.panelClass = "dialog-config"
    if (data) {
      const roleData = {
        id: data.uuid,
        name: data.name,
        description: data.description,
        code: data.code,
      };
      this.roleService.populateForm(roleData);
      // this.dialogService.open(RoleDialogComponent, dialogConfig)
      //   .afterClosed().subscribe(() => {
      //   this.ngOnInit();
      // });
    } else {
      // dialogConfig.minWidth = '400px';
      // this.dialogService.open(RoleDialogComponent, dialogConfig)
      //   .afterClosed().subscribe(() => {
      //   this.ngOnInit();
      // });
    }
  }

  async openPermissionsDialog(uuid: string) {
    const role = await lastValueFrom((this.roleService.findByUuid(uuid)));
    this.currentRole = role.data;
    this.permissionDialogOpen = true;

    let res = await lastValueFrom(this.authorityService.findByRole(uuid));
    this.roleAuthorities = res.data;
    this.selectedPermissions = role.data.authorities.map((a: { id: any; }) => a.id);
  }

  togglePermission(permissionId: number): void {
    const index = this.selectedPermissions.indexOf(permissionId);
    if (index > -1) {
      this.selectedPermissions.splice(index, 1);
    } else {
      this.selectedPermissions.push(permissionId);
    }
  }

  isSelected(permissionId: number): boolean {
    return this.selectedPermissions.includes(permissionId);
  }

  handleClose($event: boolean) {
    this.permissionDialogOpen = false;
  }

  savePermissions() {
    const payload = {
      authorityIds: this.selectedPermissions,
      roleUuid: this.currentRole.uuid
    }

    //Close the dialog
    this.permissionDialogOpen = false;
  }
}


