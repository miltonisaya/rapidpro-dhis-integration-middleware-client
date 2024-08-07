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
import {CommonModule} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatInput} from "@angular/material/input";
import {OrganisationUnitService} from "./organisation-unit.service";
import {OrganisationUnitApiResponse} from "./types/OrganisationUnitApiResponse";
import {OrganisationUnit} from "./types/OrganisationUnit";
import {FlatTreeControl} from "@angular/cdk/tree";

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
  title: string = "Organisation Units";
  apiResponse: OrganisationUnitApiResponse;
  selectedNode: MatTreeNode<OrganisationUnitFlatNode>;
  selectedNodeUuid: string;

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
      console.log('Api Response =>', this.apiResponse);
      let treeData: any[] = [];
      treeData.push(this.apiResponse.data);
      this.dataSource.data = treeData;

      // this.dataSource.data = this.apiResponse.data;
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
    this.selectedNodeUuid = JSON.parse(JSON.stringify(this.selectedNode)).uuid;
    this.getChildrenByParentUuid(this.selectedNodeUuid);
  }

  getChildrenByParentUuid(parentUuid: string) {
    this.organisationUnitService.findChildrenByParentUuid(parentUuid).subscribe((response) => {
      if (response.data.length > 0) {
        this.dataSource.data = this.mergeArrays(this.dataSource.data, response.data);
      }
    })
  }

  private mergeArrays(existingArray: OrganisationUnit[], fetchedArray: OrganisationUnit[]) {
    let organisationUnits: OrganisationUnit[] = [];
    existingArray.map((e => {
      let currentOu: OrganisationUnit = {
        uuid:e.uuid,
        name:e.name,
        code:e.code,
        description:e.description,
        children:[]
      }

      e.children?.map((f => {
        // console.log("Existing ->",e);
        // console.log("Fetched ->",f);
        if(f.parent !== undefined && f.parent !== null) {
          if(f.parent.uuid === this.selectedNodeUuid) {
            currentOu.children?.push(f);
          }
        }
      }))
    }))
    console.log("Existing array =>",existingArray);
    return existingArray;
  }
}
