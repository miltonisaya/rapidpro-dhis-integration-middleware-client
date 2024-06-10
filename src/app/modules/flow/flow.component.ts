import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableDataSource,
  MatTableModule
} from "@angular/material/table";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent} from "@angular/material/dialog";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatSort, SortDirection} from "@angular/material/sort";
import {FlowService} from "./flow.service";
import {NotifierService} from "../notification/notifier.service";
import {Subscription} from "rxjs";
import {FlowCategoryDialogComponent} from "./modals/flow-category-dialog/flow-category-dialog-component";
import {PossibleTrueValuesComponent} from "./modals/possible-true-values-dialog/possible-true-values-component";
import {FlowKeyDialogComponent} from "./modals/flow-key-dialog/flow-key-dialog-component";
import {CommonModule} from "@angular/common";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-flows',
  templateUrl: './flow.component.html',
  styleUrl: './flow.component.css',
  imports: [
    CommonModule,
    MatTableModule,
    FlexLayoutModule,
    MatButton,
    MatFormField,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatTooltip,
    MatDialogContent,
    MatDialogActions,
    MatHeaderRow,
    MatRow,
    MatIconButton,
    MatTable,
    MatSelect,
    MatOption,
    MatInput,
    MatIcon,
    MatDialogClose,
    MatLabel
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})
export class FlowComponent implements OnInit {
  title: string = "Flows";
  flows: any = [];
  elementUuid: any;
  selectedFlowUuid: any = null;
  flowKeys: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('resetDialog') resetDialog: TemplateRef<any>;
  displayedColumns: string[] = ["sno", 'keyName', 'categories', 'dataElement', 'actions'];
  dataSource: MatTableDataSource<any>;
  input: any;
  params: { pageNumber: number; pageSize: number; sortBy: SortDirection }

  constructor(
    private flowService: FlowService,
    private notifierService: NotifierService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getFlows();
  }

  /**
   * This method returns flows
   */
  getFlows() {
    let params = {
      pageSize: 1000,
      pageNo: 0,
      sortBy: 'name'
    };
    return this.flowService.get(params).subscribe((response: any) => {
      this.flows = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.error.message, 'OK', 'error');
    });
  }

  syncFlows(): Subscription {
    return this.flowService.syncFlows().subscribe((response: any) => {
      this.getFlows();
    }, error => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
    });
  }

  getKeysByFlowUuid(event: any) {
    let uuid = event.value;
    console.log("Fetching keys with categories by flow uuid ...")
    return this.flowService.findKeysWithCategoriesByFlowUuid(uuid).subscribe((response: any) => {
      this.flowKeys = response.data;
      this.dataSource = new MatTableDataSource<any>(this.flowKeys);
      this.dataSource.sort = this.sort;
    }, error => {
      this.notifierService.showNotification(error.error.message, 'OK', 'error');
    })
  }

  openMapDataElementDialog(data: { uuid: any; keyDescription: any; keyName: any; }): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (data) {
      const categoriesMappingData = {
        id: data.uuid,
        keyDescription: data.keyDescription,
        keyName: data.keyName,
        flowId: this.selectedFlowUuid,
      };

      this.dialog.open(FlowKeyDialogComponent, {data: categoriesMappingData})
        .afterClosed().subscribe(() => {
        /**
         * Fetch the data using the flow id
         */
        return this.flowService.findKeysWithCategoriesByFlowUuid(this.selectedFlowUuid).subscribe((response: any) => {
          this.flowKeys = response.data;
          this.dataSource = new MatTableDataSource<any>(this.flowKeys);
          this.dataSource.sort = this.sort;
        }, error => {
          this.notifierService.showNotification(error.error.message, 'OK', 'error');
        });
      });
    } else {
      dialogConfig.data = {};
      this.dialog.open(FlowKeyDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        /**
         * Fetch the data using the flow id
         */
        return this.flowService.findKeysWithCategoriesByFlowUuid(this.selectedFlowUuid).subscribe((response: any) => {
          this.flowKeys = response.data;
          this.dataSource = new MatTableDataSource<any>(this.flowKeys);
          this.dataSource.sort = this.sort;
        }, error => {
          this.notifierService.showNotification(error.error.message, 'OK', 'error');
        });
      });
    }
  }

  openMapCategoryDialog(data: { uuid: string; dataElementUuid: string; name: string; }): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (data) {
      const categoriesMappingData = {
        id: data.uuid,
        dataElementUuid: data.dataElementUuid,
        flowId: this.selectedFlowUuid,
        categoryName: data.name
      };

      this.dialog.open(FlowCategoryDialogComponent, {data: categoriesMappingData})
        .afterClosed().subscribe(() => {
        /**
         * Fetch the data using the flow id
         */
        return this.flowService.findKeysWithCategoriesByFlowUuid(this.selectedFlowUuid).subscribe((response: any) => {
          this.flowKeys = response.data;
          this.dataSource = new MatTableDataSource<any>(this.flowKeys);
          this.dataSource.sort = this.sort;
        }, error => {
          this.notifierService.showNotification(error.message, 'OK', 'error');
        });
      });
    } else {
      dialogConfig.data = {};
      this.dialog.open(FlowCategoryDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getFlows();
      });
    }
  }

  applyFilter(event: any): void {
    const filterValue: string = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openResetDialog(data: { uuid: any; }): void {
    this.elementUuid = data.uuid;
    this.dialog.open(this.resetDialog)
      .afterClosed().subscribe(() => {
      this.dialog.closeAll();
    });
  }

  reset(): any {
    this.flowService.resetMapping(this.elementUuid).subscribe(response => {
      this.notifierService.showNotification(response.message, 'OK', 'success');

      /**
       * Fetch the data using the flow id
       */
      return this.flowService.findKeysWithCategoriesByFlowUuid(this.selectedFlowUuid).subscribe((response: any) => {
        this.flowKeys = response.data;
        this.dataSource = new MatTableDataSource<any>(this.flowKeys);
        this.dataSource.sort = this.sort;
      }, error => {
        this.notifierService.showNotification(error.error.message, 'OK', 'error');
      });
    }, error => {
      this.notifierService.showNotification(error.error.message, 'OK', 'error');
      console.log(error);
    });
    this.dialog.closeAll();
  }

  openSetPossibleValuesDialog(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    if (data) {
      const possibleTrueValues = {
        possibleTrueValues: data
      };

      this.dialog.open(PossibleTrueValuesComponent, {data: possibleTrueValues})
        .afterClosed().subscribe(() => {
        /**
         * Fetch the data using the flow id
         */
        return this.flowService.findKeysWithCategoriesByFlowUuid(this.selectedFlowUuid).subscribe((response: any) => {
          this.flowKeys = response.data;
          this.dataSource = new MatTableDataSource<any>(this.flowKeys);
          this.dataSource.sort = this.sort;
        }, error => {
          this.notifierService.showNotification(error.error.error, 'OK', 'error');
        });
      });
    } else {
      dialogConfig.data = {};
      this.dialog.open(PossibleTrueValuesComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getFlows();
      });
    }
  }
}
