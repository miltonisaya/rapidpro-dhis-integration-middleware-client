import {Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {
  MatNestedTreeNode,
  MatTree,
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
  MatTreeNode,
  MatTreeNodeOutlet,
  MatTreeNodePadding,
  MatTreeNodeToggle
} from "@angular/material/tree";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {OrganisationUnitService} from "./organisation-unit.service";
import {MatIcon} from "@angular/material/icon";
import {MatFormField} from "@angular/material/form-field";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatInput} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {FlatTreeControl} from "@angular/cdk/tree";
import {OrganisationUnitApiResponse} from "./types/OrganisationUnitApiResponse";

interface OrganisationUnit {
  name: string;
  code?: string;
  uuid?: string;
  parent?: OrganisationUnit;
  children?: OrganisationUnit[];
}
/** Flat node with expandable and level information */
interface OrganisationUnitFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-organisation-unit',
  templateUrl: './organisation-unit.component.html',
  styleUrl: './organisation-unit.component.css',
  imports: [
    CommonModule,
    MatIcon,
    MatTreeNode,
    MatTree,
    MatTreeNodePadding,
    MatIconButton,
    MatTreeNodeToggle,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatTreeNodeOutlet,
    MatDialogClose,
    MatNestedTreeNode,
    MatFormField,
    FlexLayoutModule,
    MatInput,
    MatTreeModule
  ],
  providers: [OrganisationUnitService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  standalone: true
})

export class OrganisationUnitComponent implements OnInit {
  apiResponse: OrganisationUnitApiResponse;
  selectedNode: MatTreeNode<OrganisationUnitFlatNode>;

  constructor(
    private organisationUnitService: OrganisationUnitService
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.organisationUnitService.get().subscribe(response => {
      this.apiResponse = response;
      this.dataSource.data = this.apiResponse.data;
    });
  }

  private _transformer = (node: OrganisationUnit, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      uuid: node.uuid
    };
  };

  treeControl = new FlatTreeControl<OrganisationUnitFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener<OrganisationUnit, OrganisationUnitFlatNode>(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: OrganisationUnitFlatNode) => node.expandable;

  openCreateDialog() {
  }

  onNodeClick(node: MatTreeNode<OrganisationUnitFlatNode>) {
    this.selectedNode = node;
  }
}


