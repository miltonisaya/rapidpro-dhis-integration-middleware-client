import {Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BreadcrumbComponent, BreadcrumbItem} from "../../shared/breadcrumb/breadcrumb.component";
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
import {CommonModule} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Role} from "./types/Role";
import {Authority} from "../authority/types/Authority";
import {NotifierService} from "../notification/notifier.service";
import {RoleApiResponse} from "./types/RoleApiResponse";
import {MenuGroup} from "../menu-group/types/MenuGroup";
import {lastValueFrom, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {AuthorityService} from "../authority/authority.service";
import {DialogComponent} from "../../components/dialog-component";
import {MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {RoleAuthority} from "./types/RoleAuthority";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {ReactiveFormsModule} from "@angular/forms";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {ConfirmDialogComponent} from "../../components/confirm/confirm.dialog";

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
    MatGridTile,
    ReactiveFormsModule,
    CdkTextareaAutosize,
    ConfirmDialogComponent,
    BreadcrumbComponent
  ],
  providers: [
    RoleService
  ], schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class RoleComponent implements OnInit, OnDestroy {
  title: string = 'Roles';
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/dashboard', icon: 'home' },
    { label: 'Security', url: '/roles' },
    { label: 'Roles' }
  ];
  data: Role[] = [];
  roleUuid: string = '';
  currentRole: Role | null = null;

  permissionDialogOpen: boolean = false;
  roleAuthorities: RoleAuthority[] = [];
  selectedPermissions: number[] = [111, 113];

  createEditDialogOpen: boolean = false;

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
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<Role>;
  isConfirmDeleteDialogOpen = false;
  private destroy$ = new Subject<void>();

  constructor(
    public roleService: RoleService,
    public authorityService: AuthorityService,
    public notifierService: NotifierService
  ) {
  }

  ngOnInit(): void {
    this.getRoles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  pageChanged(e: { pageSize: number; pageIndex: number }): void {
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getRoles();
  }

  getRoles(): void {
    this.params = {
      "pageNo": this.pageNo,
      "pageSize": this.pageSize,
      "sortBy": "name"
    };

    this.roleService.get(this.params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: RoleApiResponse) => {
          this.dataSource.data = response.data || [];
          this.totalRecords = response.total ? response.total : 0;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error) => {
          this.notifierService.showNotification(error.error.message, 'OK', 'error');
        }
      });
  }

  openDeleteDialog(uuid: string) {
    this.roleUuid = uuid;
    this.isConfirmDeleteDialogOpen = true;
    this.getRoles();
  }

  openEditDialog(row: Role): void {
    this.createEditDialogOpen = true;
    const roleData = {
      uuid: row.uuid,
      code: row.code,
      description: row.description,
      name: row.name
    };
    this.roleService.populateForm(roleData);
  }

  // delete() {
  //   this.roleService.delete(this.roleUuid).subscribe({
  //     next: (response: ContactApiResponse) => {
  //       this.notifierService.showNotification(response.message, 'OK', 'error');
  //     },
  //     error: (error) => {
  //       this.notifierService.showNotification(error.error.message, 'OK', 'error');
  //     }
  //   });
  // }

  openCreateDialog(data?: {
    uuid: string;
    name: string;
    description: string;
    code: string;
    authorities: Authority[]
  }): void {
    this.createEditDialogOpen = true;
    if (data) {
      const roleData = {
        id: data.uuid,
        name: data.name,
        description: data.description,
        code: data.code,
      };
      this.roleService.populateForm(roleData);
    } else {
      this.roleService.initializeFormGroup();
    }
  }

  async openPermissionsDialog(uuid: string) {
    const role = await lastValueFrom((this.roleService.findByUuid(uuid)));
    this.currentRole = role.data;
    this.permissionDialogOpen = true;
    let res = await lastValueFrom(this.authorityService.findByRole(uuid));
    this.roleAuthorities = res.data;
    this.selectedPermissions = role.data.authorities.map((a: Authority) => a.id);
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

  savePermissions(): void {
    if (!this.currentRole) return;

    const payload = {
      authorityIds: this.selectedPermissions,
      roleUuid: this.currentRole.uuid
    };

    this.authorityService.saveRoleAuthorities(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.notifierService.showNotification(response.message, 'OK', 'success');
        },
        error: (error) => {
          this.notifierService.showNotification(error.error.message, 'OK', 'error');
        }
      });

    this.permissionDialogOpen = false;
  }

  submitCreateEditRoleForm(): void {
    if (this.roleService.form.valid) {
      const isUpdate = this.roleService.form.get('uuid')?.value !== '';
      const request$ = isUpdate
        ? this.roleService.update(this.roleService.form.value)
        : this.roleService.create(this.roleService.form.value);

      request$
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.notifierService.showNotification(response.message, 'OK', 'success');
            this.createEditDialogOpen = false;
            this.getRoles();
          },
          error: (error) => {
            this.notifierService.showNotification(error.message, 'OK', 'error');
            this.createEditDialogOpen = false;
            this.getRoles();
          }
        });
    }
  }

  closeConfirmDialog(event: boolean): void {
    this.isConfirmDeleteDialogOpen = false;
  }

  handleConfirmDelete(): void {
    this.roleService.delete(this.roleUuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: RoleApiResponse) => {
          this.notifierService.showNotification(response.message, 'OK', 'success');
          this.getRoles();
        },
        error: (error) => {
          this.notifierService.showNotification(error.error.message, 'OK', 'error');
          this.getRoles();
        }
      });
  }
}


