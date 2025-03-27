import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {NotifierService} from "../../notification/notifier.service";
import {MenuItemService} from "../menu-item.service";
import {FlexModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatOption, MatSelect} from "@angular/material/select";
import {MenuGroupService} from "../../menu-group/menu-group.service";
import {MenuGroup} from "../../menu-group/types/MenuGroup";
import {AuthorityService} from "../../authority/authority.service";
import {Authority} from "../../authority/types/Authority";

@Component({
  selector: 'app-menu-item-dialog',
  templateUrl: 'menu-item-dialog-component.html',
  standalone: true,
  providers: [MenuItemService, MenuGroupService],
  imports: [
    FlexModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    CommonModule,
    MatLabel,
    DragDropModule,
    MatSelect,
    MatOption
  ],
  styleUrls: ['menu-item-dialog.component.css']
})

export class MenuItemDialogComponent implements OnInit {
  params: { page: number; size: number; sort: string } = {size: 10, page: 0, sort: 'name'};
  menuGroups: MenuGroup[];
  authorities: Authority[];

  constructor(
    public menuService: MenuItemService,
    public menuGroupService: MenuGroupService,
    public authorityService: AuthorityService,
    public dialogRef: MatDialogRef<MenuItemDialogComponent>,
    public notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.getMenuGroups();
    this.getAuthorities();
    this.menuService.populateForm(this.data);
    console.log("Form values =>",this.menuService.form.value);
  }

  getMenuGroups() {
    const params = {
      pageNo: 0,
      pageSize: 1000,
      sortBy: 'name'
    }
    this.menuGroupService.get(params).subscribe(response => {
      this.menuGroups = response.data;
    }, error => {
      this.notifierService.showNotification(error.error.message, 'OK', error);
    })
  }

  getAuthorities(){
    const params = {
      pageNo: 0,
      pageSize: 1000,
      sortBy: 'resource'
    }

    this.authorityService.findAll(params).subscribe(response =>{
      this.authorities = response.data;
    }, error => {
      this.notifierService.showNotification(error.error.message,'OK',error);
    })
  }

  submitForm(): void {
    if (this.menuService.form.valid) {
      if (this.menuService.form.get('uuid')?.value != '') {
        this.menuService.update(this.menuService.form.value)
          .subscribe((response) => {
            this.notifierService.showNotification(response.message, 'OK', 'success');
            this.dialogRef.close();
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
