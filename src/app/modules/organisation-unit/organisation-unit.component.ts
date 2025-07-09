import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
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
export class OrganisationUnitComponent implements OnInit {
  treeControl = new NestedTreeControl<OuNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<OuNode>();
  selectedNode: OuNode | null = null;
  originalData: OrganisationUnit[] = [];

  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  organisationUnitId: string;
  isSuperAdministrator: boolean = false;

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

  checkIsAdmin() {
    const mnmUser = JSON.parse(localStorage.getItem('MNM_USER') || '{}');
    this.isSuperAdministrator = !!mnmUser.isSuperAdministrator;
  }

  getRootOrganisationUnits() {
    this.organisationUnitService.getRootOrganisationUnits().subscribe(
      (response: OuNode[]) => {
        console.log('Root nodes loaded:', response);
        this.dataSource.data = response;
        this.treeControl.dataNodes = response; // Sync tree control
        this.cdr.detectChanges();
      },
      error => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
        console.error('Error fetching root nodes:', error);
      }
    );
  }

  loadChildren(node: OuNode) {
    if (!node.children && node.hasChildren) {
      console.log('Fetching children for:', node.id, node.name);
      this.organisationUnitService.getChildren(node.id).subscribe(
        (response: OuNode[]) => {
          console.log('Children loaded for', node.name, ':', response);
          node.children = response; // Assign children to the node

          // Manual refresh: Reset and reassign dataSource.data to force re-render
          const currentData = this.dataSource.data;
          this.dataSource.data = []; // Clear the data source
          this.dataSource.data = currentData; // Reassign the updated data
          this.treeControl.dataNodes = this.dataSource.data; // Sync tree control
          this.treeControl.expand(node); // Ensure node stays expanded
          this.cdr.detectChanges(); // Force change detection

          console.log('Updated dataSource.data after refresh:', this.dataSource.data);
        },
        error => {
          this.notifierService.showNotification(error.error.error, 'OK', 'error');
          console.error('Error fetching children:', error);
        }
      );
    } else {
      console.log('No fetch needed for', node.name, '- already loaded or no children');
    }
  }

  onNodeExpand(node: OuNode) {
    if (!this.treeControl.isExpanded(node)) {
      console.log('Expanding node:', node.name);
      this.treeControl.expand(node);
      this.loadChildren(node);
    } else {
      console.log('Collapsing node:', node.name);
      this.treeControl.collapse(node);
      this.cdr.detectChanges();
    }
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('Filter Value =>', filterValue);
    // if (!filterValue) {
    //   this.dataSource.data = JSON.parse(JSON.stringify(this.originalData)); // Restore original data
    //   this.treeControl.collapseAll();
    //   this.cdr.detectChanges();
    //   return;
    // }
  }

  openDialog(data?: OuNode): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    if (data) {
      const ouData = {id: data.id, name: data.name, code: data.code, parentId: data.parentId};
      this.organisationUnitService.populateForm(ouData);
      this.dialog
        .open(OrganisationUnitDialogComponent, dialogConfig)
        .afterClosed()
        .subscribe(() => {
          this.getRootOrganisationUnits();
        });
    } else {
      dialogConfig.data = {};
      this.dialog
        .open(OrganisationUnitDialogComponent, dialogConfig)
        .afterClosed()
        .subscribe(() => {
          this.getRootOrganisationUnits();
        });
    }
  }

  openDeleteDialog(id: string) {
    this.organisationUnitId = id;
    this.dialog
      .open(this.deleteDialog)
      .afterClosed()
      .subscribe(() => {
        this.getRootOrganisationUnits();
      });
  }

  delete() {
    this.organisationUnitService.delete(this.organisationUnitId).subscribe(
      response => {
        this.notifierService.showNotification(response.message, 'OK', 'success');
        this.getRootOrganisationUnits();
      },
      error => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      }
    );
    this.dialog.closeAll();
  }

  hasNestedChild = (_: number, node: OuNode) => {
    const result = node.hasChildren;
    console.log('Checking if', node.name, 'has children:', result);
    return result;
  };

  onNodeClick(node: OuNode) {
    this.selectedNode = node;
    console.log('Node clicked:', node.name);
  }
}
