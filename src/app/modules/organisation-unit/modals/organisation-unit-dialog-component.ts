import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {OrganisationUnitService} from '../organisation-unit.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NotifierService} from '../../notification/notifier.service';
import {MatDivider} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {NestedTreeControl} from "@angular/cdk/tree";
import {
  MatNestedTreeNode,
  MatTree,
  MatTreeNestedDataSource,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodeOutlet
} from "@angular/material/tree";

interface OuNode {
  id: string;
  name: string;
  code: string;
  otherNames: string | null;
  parentId: string | null;
  children?: OuNode[];
  hasChildren: boolean;
}

export interface OrganisationUnitDialogData {
  mode: 'create' | 'edit';
  organisationUnit?: OuNode;
}

@Component({
  selector: 'app-organisation-unit-dialog',
  templateUrl: 'organisation-unit-dialog-component.html',
  styleUrls: ['organisation-unit-dialog.component.sass'],
  imports: [
    ReactiveFormsModule,
    MatDivider,
    MatDialogContent,
    MatFormFieldModule,
    MatDialogActions,
    FlexLayoutModule,
    MatInput,
    MatButton,
    MatDialogTitle,
    MatDialogClose,
    NgIf,
    NgForOf,
    MatIcon,
    MatIconButton,
    MatTree,
    MatTreeNode,
    MatNestedTreeNode,
    MatTreeNodeOutlet,
    MatTreeNodeDef
  ],
  standalone: true
})
export class OrganisationUnitDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isEditMode: boolean = false;
  selectedParent: OuNode | null = null;

  treeControl = new NestedTreeControl<OuNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<OuNode>();

  private destroy$ = new Subject<void>();

  constructor(
    public organisationUnitService: OrganisationUnitService,
    public dialogRef: MatDialogRef<OrganisationUnitDialogComponent>,
    public notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: OrganisationUnitDialogData
  ) {
    this.form = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      otherNames: new FormControl('')
    });
  }

  ngOnInit() {
    this.isEditMode = this.data?.mode === 'edit';
    this.loadOrganisationUnits();

    if (this.isEditMode && this.data.organisationUnit) {
      this.form.patchValue({
        id: this.data.organisationUnit.id,
        name: this.data.organisationUnit.name,
        code: this.data.organisationUnit.code,
        otherNames: this.data.organisationUnit.otherNames || ''
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrganisationUnits(): void {
    this.organisationUnitService.getRootOrganisationUnits()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: OuNode[]) => {
          this.dataSource.data = response;
          this.treeControl.dataNodes = response;

          // If editing and has parent, find and select the parent
          if (this.isEditMode && this.data.organisationUnit?.parentId) {
            this.findAndSelectParent(response, this.data.organisationUnit.parentId);
          }
        },
        error: (error) => {
          this.notifierService.showNotification(error.error?.error || 'Failed to load organisation units', 'OK', 'error');
        }
      });
  }

  findAndSelectParent(nodes: OuNode[], parentId: string): void {
    for (const node of nodes) {
      if (node.id === parentId) {
        this.selectedParent = node;
        return;
      }
      if (node.children && node.children.length > 0) {
        this.findAndSelectParent(node.children, parentId);
      }
    }
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
            this.treeControl.expand(node);
          },
          error: (error) => {
            this.notifierService.showNotification(error.error?.error || 'Failed to load children', 'OK', 'error');
          }
        });
    }
  }

  onNodeExpand(node: OuNode): void {
    if (!this.treeControl.isExpanded(node)) {
      this.treeControl.expand(node);
      this.loadChildren(node);
    } else {
      this.treeControl.collapse(node);
    }
  }

  selectParent(node: OuNode): void {
    // Don't allow selecting the same node as its own parent when editing
    if (this.isEditMode && this.data.organisationUnit?.id === node.id) {
      this.notifierService.showNotification('Cannot select the same organisation unit as its parent', 'OK', 'error');
      return;
    }
    this.selectedParent = node;
  }

  clearParentSelection(): void {
    this.selectedParent = null;
  }

  hasNestedChild = (_: number, node: OuNode) => {
    return node.hasChildren;
  };

  submitForm(): void {
    if (this.form.valid) {
      const formValue = {
        ...this.form.value,
        parentId: this.selectedParent?.id || null
      };

      const request = this.isEditMode
        ? this.organisationUnitService.update(formValue.id, formValue)
        : this.organisationUnitService.create(formValue);

      request.pipe(takeUntil(this.destroy$)).subscribe({
        next: (response: any) => {
          this.notifierService.showNotification(
            response.message || (this.isEditMode ? 'Organisation unit updated successfully' : 'Organisation unit created successfully'),
            'OK',
            'success'
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.notifierService.showNotification(error.error?.error || 'An error occurred', 'OK', 'error');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
