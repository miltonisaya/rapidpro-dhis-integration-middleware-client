import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  OnDestroy,
  OnInit
} from '@angular/core';
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent} from '@angular/material/dialog';
import {OrganisationUnitService} from './organisation-unit.service';
import {OrganisationUnitDialogComponent, OrganisationUnitDialogData} from './modals/organisation-unit-dialog-component';
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
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {NotifierService} from "../notification/notifier.service";
import {MatInput} from "@angular/material/input";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSuffix} from "@angular/material/form-field";
import {FlexLayoutModule} from "@angular/flex-layout";
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BreadcrumbComponent, BreadcrumbItem} from "../../shared/breadcrumb/breadcrumb.component";
import {ConfirmDialogComponent} from "../../components/confirm/confirm.dialog";

interface OuNode {
  id: string;
  name: string;
  code: string;
  otherNames: string | null;
  parentId: string | null;
  children?: OuNode[];
  hasChildren: boolean;
}

interface FilteredResult {
  node: OuNode;
  path: OuNode[];
}

@Component({
  selector: 'app-organisation-units',
  templateUrl: './organisation-unit.component.html',
  styleUrls: ['./organisation-unit.component.css'],
  imports: [
    MatButton,
    MatFormField,
    MatLabel,
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
    MatTooltip,
    MatSuffix,
    FlexLayoutModule,
    BreadcrumbComponent,
    ConfirmDialogComponent
  ],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class OrganisationUnitComponent implements OnInit, OnDestroy {
  title: string = 'Organisation Units';
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/dashboard', icon: 'home' },
    { label: 'DHIS2 Metadata', url: '/organisation-units' },
    { label: 'Organisation Units' }
  ];
  treeControl = new NestedTreeControl<OuNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<OuNode>();
  selectedNode: OuNode | null = null;
  originalData: OuNode[] = [];
  filterText: string = '';

  organisationUnitId: string = '';
  isConfirmDeleteDialogOpen: boolean = false;
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getRootOrganisationUnits(): void {
    this.organisationUnitService.getRootOrganisationUnits()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: OuNode[]) => {
          this.originalData = this.deepCopyNodes(response);
          this.dataSource.data = response;
          this.treeControl.dataNodes = response;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.notifierService.showNotification(error.error?.error || 'Failed to load organisation units', 'OK', 'error');
        }
      });
  }

  deepCopyNodes(nodes: OuNode[]): OuNode[] {
    return nodes.map(node => ({
      ...node,
      children: node.children ? this.deepCopyNodes(node.children) : undefined
    }));
  }

  loadChildren(node: OuNode): void {
    if (!node.children && node.hasChildren) {
      this.organisationUnitService.getChildren(node.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: OuNode[]) => {
            node.children = response;

            // Also update originalData to keep in sync
            this.updateOriginalDataChildren(this.originalData, node.id, response);

            const currentData = this.dataSource.data;
            this.dataSource.data = [];
            this.dataSource.data = currentData;
            this.treeControl.dataNodes = this.dataSource.data;
            this.treeControl.expand(node);
            this.cdr.detectChanges();
          },
          error: (error) => {
            this.notifierService.showNotification(error.error?.error || 'Failed to load children', 'OK', 'error');
          }
        });
    }
  }

  updateOriginalDataChildren(nodes: OuNode[], parentId: string, children: OuNode[]): boolean {
    for (const node of nodes) {
      if (node.id === parentId) {
        node.children = this.deepCopyNodes(children);
        return true;
      }
      if (node.children && node.children.length > 0) {
        if (this.updateOriginalDataChildren(node.children, parentId, children)) {
          return true;
        }
      }
    }
    return false;
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

  applyFilter(event: KeyboardEvent): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterText = filterValue;

    if (!filterValue) {
      this.dataSource.data = this.deepCopyNodes(this.originalData);
      this.treeControl.dataNodes = this.dataSource.data;
      this.treeControl.collapseAll();
      this.cdr.detectChanges();
      return;
    }

    const filteredData = this.filterTreeData(this.deepCopyNodes(this.originalData), filterValue);
    this.dataSource.data = filteredData;
    this.treeControl.dataNodes = filteredData;
    this.expandFilteredNodes(filteredData);
    this.cdr.detectChanges();
  }

  filterTreeData(nodes: OuNode[], filterValue: string): OuNode[] {
    const result: OuNode[] = [];

    for (const node of nodes) {
      const nodeMatches = this.nodeMatchesFilter(node, filterValue);
      let filteredChildren: OuNode[] = [];

      if (node.children && node.children.length > 0) {
        filteredChildren = this.filterTreeData(node.children, filterValue);
      }

      if (nodeMatches || filteredChildren.length > 0) {
        const newNode: OuNode = {
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children
        };
        result.push(newNode);
      }
    }

    return result;
  }

  nodeMatchesFilter(node: OuNode, filterValue: string): boolean {
    const searchableText = `${node.name} ${node.code} ${node.otherNames || ''}`.toLowerCase();
    return searchableText.includes(filterValue);
  }

  expandFilteredNodes(nodes: OuNode[]): void {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        this.treeControl.expand(node);
        this.expandFilteredNodes(node.children);
      }
    }
  }

  openCreateDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '700px';
    dialogConfig.data = {
      mode: 'create'
    } as OrganisationUnitDialogData;

    this.dialog
      .open(OrganisationUnitDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.getRootOrganisationUnits();
        }
      });
  }

  openEditDialog(): void {
    if (!this.selectedNode) {
      this.notifierService.showNotification('Please select an organisation unit to edit', 'OK', 'error');
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '700px';
    dialogConfig.data = {
      mode: 'edit',
      organisationUnit: this.selectedNode
    } as OrganisationUnitDialogData;

    this.dialog
      .open(OrganisationUnitDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.selectedNode = null;
          this.getRootOrganisationUnits();
        }
      });
  }

  openDeleteDialog(id: string): void {
    this.organisationUnitId = id;
    this.isConfirmDeleteDialogOpen = true;
  }

  closeConfirmDialog(): void {
    this.isConfirmDeleteDialogOpen = false;
  }

  handleConfirmDelete(): void {
    this.organisationUnitService.delete(this.organisationUnitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.notifierService.showNotification(response.message || 'Organisation unit deleted successfully', 'OK', 'success');
          this.selectedNode = null;
          this.isConfirmDeleteDialogOpen = false;
          this.getRootOrganisationUnits();
        },
        error: (error) => {
          this.notifierService.showNotification(error.error?.error || 'Failed to delete organisation unit', 'OK', 'error');
          this.isConfirmDeleteDialogOpen = false;
        }
      });
  }

  hasNestedChild = (_: number, node: OuNode) => {
    return node.hasChildren;
  };

  onNodeClick(node: OuNode) {
    this.selectedNode = node;
  }
}
