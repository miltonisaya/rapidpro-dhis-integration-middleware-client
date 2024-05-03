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
import {RoleService} from "../role.service";
import {FlexModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDivider} from "@angular/material/divider";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-contact-dialog',
  templateUrl: 'contact-dialog-component.html',
  standalone: true,
  providers:[RoleService],
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
    CommonModule
  ],
  styleUrls: ['contact-dialog.component.css']
})

export class ContactDialogComponent implements OnInit{
  constructor(
    public contactService: RoleService,
    public dialogRef: MatDialogRef<ContactDialogComponent>,
    public notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.contactService.populateForm(this.data);
  }

  submitForm(data: any): void {
    // Ensure the form and the uuid form control exist before trying to access its value
    if (this.contactService.form?.get('uuid')?.value) {
      this.contactService.updateContact(this.contactService.form.value)
        .subscribe(response => {
          this.notifierService.showNotification(response.message, 'OK', 'success');
          this.onClose();
        }, error => {
          // Using optional chaining and nullish coalescing to handle possible null values
          this.notifierService.showNotification(error?.error?.error ?? 'Unknown error', 'OK', 'error');
        });
    }
  }

  onClose() {
    this.contactService.form.reset();
    this.contactService.initializeFormGroup();
    this.dialogRef.close();
  }
}
