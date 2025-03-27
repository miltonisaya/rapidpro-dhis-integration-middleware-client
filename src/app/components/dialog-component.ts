import {
  Component,
  ContentChild,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef,} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {DragDropModule} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule,
  ],
  template: '',
})
export class DialogComponent implements OnChanges {
  @Input() open: boolean = false;
  @Input() title: string = '';
  @Input() width: string = '740px';
  @Input() fullScreen: boolean = false;
  @Input() draggable: boolean = false;
  @Output() onClose = new EventEmitter<boolean>();
  @ContentChild(TemplateRef) content!: TemplateRef<any>;

  private dialogRef!: MatDialogRef<any>;

  constructor(private dialog: MatDialog) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.openDialog();
    } else if (changes['open'] && !this.open && this.dialogRef) {
      this.dialogRef.close();
    }
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(DialogContentComponent, {
      width: this.fullScreen ? '100vw' : this.width,
      height: this.fullScreen ? '100vh' : 'auto',
      maxWidth: this.fullScreen ? '100vw' : this.width,
      maxHeight: this.fullScreen ? '100vh' : 'auto',
      disableClose: true,
      data: {
        title: this.title,
        content: this.content,
        draggable: this.draggable,
      },
      panelClass: this.fullScreen ? 'full-screen-dialog' : '',
    });

    this.dialogRef.afterClosed().subscribe((result) => {
      this.onClose.emit(result);
    });
  }
}

@Component({
  selector: 'app-dialog-content',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    DragDropModule,
  ],
  template: `
    <div
      [class.draggable]="data.draggable"
      cdkDrag
      cdkDragRootElement=".cdk-overlay-pane"
      class="flex flex-col"
    >
      <div
        class="dialog-header"
        [class.draggable]="data.draggable"
        cdkDragHandle
      >
        <span>
          <h1 mat-dialog-title>{{ data.title }}</h1>
        </span>
        <span class="close-icon" (click)="onCancelClick()">
          <mat-icon>close</mat-icon>
        </span>
      </div>
      <div mat-dialog-content>
        <ng-container *ngTemplateOutlet="data.content"></ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .full-screen-dialog .mat-dialog-container {
        padding: 0;
        margin: 0;
        border-radius: 0;
      }

      .draggable {
        cursor: move;
      }

      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #c0c0c0;
        color: white;
        padding: 10px;
      }

      .close-icon {
        cursor: pointer;
      }
    `,
  ],
})
export class DialogContentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
