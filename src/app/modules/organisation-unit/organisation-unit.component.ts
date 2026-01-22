import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {OrganisationUnitService} from './organisation-unit.service';
import {OrganisationUnitDialogComponent} from './modals/organisation-unit-dialog-component';
import {NestedTreeControl} from '@angular/cdk/tree';
import {
  MatNestedTreeNode,
  MatTree,
  MatTreeNestedDataSource,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodeOutlet
} from '@angular/material/tree';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {NotifierService} from "../notification/notifier.service";
import {MatInput} from "@angular/material/input";
import {OrganisationUnit} from "./types/OrganisationUnit";
import {FlexLayoutModule} from "@angular/flex-layout";
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

interface OuNode {
  id: string;
  name: string;
  code: string;
  otherNames: string | null;
  parentId: string | null;
  children?: OuNode[];
  hasChildren: boolean;
}

@Component({
  selector: 'app-organisation-units',
  templateUrl: './organisation-unit.component.html',
  styleUrls: ['./organisation-unit.component.scss'],
  imports: [
    MatButton,
    MatFormField,
    MatTree,
    MatTreeNode,
    MatNestedTreeNode,
    MatIconButton,
    MatIcon,
    MatTreeNodeOutlet,
    MatDialogContent,
    MatDialogActions,
    NgIf,
    MatTreeNodeDef,
    MatDialogClose,
    MatInput,
    FlexLayoutModule
  ],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class OrganisationUnitComponent implements OnInit, OnDestroy {
  treeControl = new NestedTreeControl<OuNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<OuNode>();
  selectedNode: OuNode | null = null;
  originalData: OrganisationUnit[] = [];

  @ViewChild('deleteDialog') deleteDialog: TemplateRef<OuNode>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  organisationUnitId: string = '';
  isSuperAdministrator: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private organisationUnitService: OrganisationUnitService,
    private dialog: MatDialog,
    private notifierService: NotifierService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.getRootOrganisationUnits();
    this.checkIsAdmin();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkIsAdmin(): void {
    const mnmUser = JSON.parse(localStorage.getItem('MNM_USER') || '{}');
    this.isSuperAdministrator = !!mnmUser.isSuperAdministrator;
  }

  getRootOrganisationUnits(): void {
    this.organisationUnitService.getRootOrganisationUnits()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: OuNode[]) => {
          this.dataSource.data = response;
          this.treeControl.dataNodes = response;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.notifierService.showNotification(error.error.error, 'OK', 'error');
        }
      });
  }

  loadChildren(node: OuNode): void {
    if (!node.children && node.hasChildren) {
      this.organisationUnitService.getChildren(node.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: OuNode[]) => {
            node.children = response;

            const currentData = this.dataSource.data;
            this.dataSource.data = [];
            this.dataSource.data = currentData;
            this.treeControl.dataNodes = this.dataSource.data;
            this.treeControl.expand(node);
            this.cdr.detectChanges();
          },
          error: (error) => {
            this.notifierService.showNotification(error.error.error, 'OK', 'error');
          }
        });
    }
  }

  onNodeExpand(node: OuNode) {
    if (!this.treeControl.isExpanded(node)) {
      this.treeControl.expand(node);
      this.loadChildren(node);
    } else {
      this.treeControl.collapse(node);
      this.cdr.detectChanges();
    }
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  openDialog(data?: OuNode): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    if (data) {
      const ouData = {id: data.id, name: data.name, code: data.code, parentId: data.parentId};
      this.organisationUnitService.populateForm(ouData);
    } else {
      dialogConfig.data = {};
    }
    this.dialog
      .open(OrganisationUnitDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getRootOrganisationUnits();
      });
  }

  openDeleteDialog(id: string): void {
    this.organisationUnitId = id;
    this.dialog
      .open(this.deleteDialog)
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getRootOrganisationUnits();
      });
  }

  delete(): void {
    this.organisationUnitService.delete(this.organisationUnitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.notifierService.showNotification(response.message, 'OK', 'success');
          this.getRootOrganisationUnits();
        },
        error: (error) => {
          this.notifierService.showNotification(error.error.error, 'OK', 'error');
        }
      });
    this.dialog.closeAll();
  }

  hasNestedChild = (_: number, node: OuNode) => {
    return node.hasChildren;
  };

  onNodeClick(node: OuNode) {
    this.selectedNode = node;
  }
}
