import {Component, OnInit} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {OrganisationUnitService} from '../organisation-unit.service';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {NotifierService} from '../../notification/notifier.service';
import {MatDivider} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";

interface Council {
  id: string;
  name: string;
}

@Component({
  selector: 'app-organisation-unit-dialog',
  templateUrl: 'organisation-unit-dialog-component.html',
  styleUrls: ['organisation-unit-dialog.component.sass'],
  imports: [
    ReactiveFormsModule,
    MatDivider,
    MatDialogContent,
    MatFormFieldModule, // Added to support mat-label and mat-error
    MatAutocomplete,
    MatDialogActions,
    MatAutocompleteTrigger,
    MatOption,
    FlexLayoutModule,
    MatInput,
    MatButton,
    MatDialogTitle,
    MatDialogClose,
    NgIf,
    NgForOf,
    AsyncPipe
  ],
  standalone: true
})
export class OrganisationUnitDialogComponent implements OnInit {
  myControl = new FormControl<string | Council>('', [Validators.required]);
  councils: Council[] = [];
  filteredOptions: Observable<Council[]>;

  constructor(
    public organisationUnitService: OrganisationUnitService,
    public dialogRef: MatDialogRef<OrganisationUnitDialogComponent>,
    public notifierService: NotifierService
  ) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value?.name || ''),
      map(name => name ? this._filter(name) : this.councils)
    );
  }

  ngOnInit() {
    this.getCouncils();
  }

  displayFn(council: Council): string {
    return council?.name || '';
  }

  getCouncils() {
    const param = {pageSize: 1000};
    this.organisationUnitService.getCouncils(param).subscribe({
      next: (response: any) => {
        this.councils = response.data;
      },
      error: (error) => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
        console.error('Error fetching councils:', error);
      }
    });
  }

  submitForm() {
    if (this.organisationUnitService.form.valid && this.myControl.valid) {
      const formValue = {
        ...this.organisationUnitService.form.value,
        parentId: typeof this.myControl.value === 'object' && this.myControl.value ? this.myControl.value.id : null
      };

      const request = formValue.id
        ? this.organisationUnitService.update(formValue.id, formValue)
        : this.organisationUnitService.create(formValue);

      request.subscribe({
        next: (response: any) => {
          this.notifierService.showNotification(response.message || 'Success', 'OK', 'success');
          this.onClose();
        },
        error: (error) => {
          this.notifierService.showNotification(error.error?.error || 'An error occurred', 'OK', 'error');
        }
      });
    }
  }

  onClose() {
    this.organisationUnitService.form.reset();
    this.organisationUnitService.initializeFormGroup();
    this.myControl.reset();
    this.dialogRef.close();
  }

  private _filter(name: string): Council[] {
    const filterValue = name.toLowerCase();
    return this.councils.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
