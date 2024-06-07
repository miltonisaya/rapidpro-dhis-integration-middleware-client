import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: '',
})
export class ConfirmDialogComponent implements OnChanges {
  @Input() open: boolean = false;
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() width: string = '400px';
  @Output() onClose = new EventEmitter<boolean>();
  @Output() onConfirm = new EventEmitter<void>();
  private dialogRef!: MatDialogRef<any>;

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.openDialog();
    } else if (changes['open'] && !this.open && this.dialogRef) {
      this.dialogRef.close();
    }
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(ConfirmDialogContentComponent, {
      width: this.width,
      disableClose: true,
      data: {
        title: this.title,
        message: this.message,
      },
    });

    this.dialogRef.afterClosed().subscribe((result) => {
      this.onClose.emit(result);
      if (result) {
        this.onConfirm.emit();
      }
    });
  }
}

@Component({
  selector: 'app-confirm-dialog-content',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="p-6 bg-white rounded-lg w-full max-w-sm mx-auto">
      <h2 class="text-lg font-bold text-gray-800">{{ data.title }}</h2>
      <p class="text-sm text-gray-600 mt-2">{{ data.message }}</p>
      <div class="flex justify-end mt-6">
        <button
          mat-button
          (click)="onCancelClick()"
          class="mr-2 !border !border-gray-300 !text-rose-600 !hover:bg-gray-100"
        >
          CANCEL
        </button>
        <button
          mat-button
          color="primary"
          (click)="onConfirmClick()"
          class="!bg-green-600 !text-white !hover:bg-green-700 !transition-colors"
        >
          CONFIRM
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class ConfirmDialogContentComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
