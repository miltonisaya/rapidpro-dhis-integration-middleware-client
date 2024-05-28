import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {NotifierService} from "../../notification/notifier.service";
import {MenuService} from "../menu.service";
import {FlexModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDivider} from "@angular/material/divider";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {CdkDrag, CdkDropList, DragDropModule} from "@angular/cdk/drag-drop";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {PickListModule} from "primeng/picklist";
import {MenuItemService} from "../../menu-item/menu-item.service";
import {MenuItem} from "../../menu-item/types/MenuItem";

@Component({
  selector: 'app-menu-dialog',
  templateUrl: 'menu-dialog-component.html',
  standalone: true,
  providers: [MenuService, MenuItemService],
  imports: [
    FlexModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDivider,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    CommonModule,
    CdkTextareaAutosize,
    MatLabel,
    CdkDropList,
    CdkDrag,
    MatList,
    MatListItem,
    DragDropModule,
    MatIcon,
    PickListModule
  ],
  styleUrls: ['menu-dialog.component.css']
})

export class MenuDialogComponent implements AfterViewInit {
  params: { page: number; size: number; sort: string } = {size: 10, page: 0, sort: 'name'};
  assignedMenuItems: MenuItem[]
  unassignedMenuItems: MenuItem[];

  constructor(
    public menuService: MenuService,
    public menuItemService: MenuItemService,
    public dialogRef: MatDialogRef<MenuDialogComponent>,
    public notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngAfterViewInit(): void {
    this.menuService.populateForm(this.data);
    this.getMenuItems();
  }

  async getMenuItems() {
    const uuid = await this.data.uuid;
    this.menuItemService.getByMenuUuid(uuid)
      .subscribe((response:any) => {
        console.log('Menu items =>',response);
        this.unassignedMenuItems = response.data.assignedMenuItems;
        this.assignedMenuItems = response.data.unassignedMenuItems;
      }, (error: { message: string; }) => {
        this.notifierService.showNotification(error.message, 'OK', 'error');
      })
  }

  submitForm(): void {
    if (this.menuService.form.valid) {
      if (this.menuService.form.get('uuid')?.value != '') {
        this.menuService.update(this.menuService.form.value)
          .subscribe((response) => {
            this.notifierService.showNotification(response.message, 'OK', 'success');
            this.onClose();
          }, error => {
            this.notifierService.showNotification(error.message, 'OK', 'error');
          });
      } else {
        this.menuService.create(this.menuService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message, 'OK', 'error');
            this.onClose();
          }, error => {
            this.notifierService.showNotification(error.message, 'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.menuService.form.reset();
    this.menuService.initializeFormGroup();
    this.dialogRef.close();
  }
}
