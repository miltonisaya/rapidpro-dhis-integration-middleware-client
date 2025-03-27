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
      this.dataSource.data = response.data;
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

  onNodeClick(node: any) {
    this.selectedNode = node;
    console.log('Selected Node =>', this.selectedNode);
  }

  // filter string from mat input filter
  applyFilter(filterText: KeyboardEvent) {
    console.log('Filter Text =>',filterText);
    // this.filterTree(filterText.target[]);
    // show / hide based on state of filter string
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  // pass mat input string to recursive function and return data
  filterTree(filterText: string) {
    // use filter input text, return filtered TREE_DATA, use the 'name' object value
    this.dataSource.data = this.filterRecursive(filterText, this.apiResponse.data, 'name');
  }


  // filter recursively on a text string using property object value
  filterRecursive(filterText: string, array: any[], property: string) {
    let filteredData;

    //make a copy of the data so we don't mutate the original
    function copy(o: any) {
      return Object.assign({}, o);
    }

    // has string
    if (filterText) {
      // need the string to match the property value
      filterText = filterText.toLowerCase();
      // copy obj so we don't mutate it and filter
      filteredData = array.map(copy).filter(function x(y) {
        if (y[property].toLowerCase().includes(filterText)) {
          return true;
        }
        // if children match
        if (y.children) {
          return (y.children = y.children.map(copy).filter(x)).length;
        }
      });
      // no string, return whole array
    } else {
      filteredData = array;
    }
    return filteredData;
  }
}
