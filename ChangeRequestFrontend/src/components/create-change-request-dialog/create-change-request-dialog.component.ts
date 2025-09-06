import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { ChangeRequestService, ChangeRequest } from '../../services/change-request/change-request.service';

@Component({
  selector: 'app-create-change-request-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatIconModule],
  templateUrl: './create-change-request-dialog.component.html',
  styleUrls: ['./create-change-request-dialog.component.css']
})
export class CreateChangeRequestDialogComponent {
  private changeRequestService = inject(ChangeRequestService);
  private dialogRef = inject(MatDialogRef<CreateChangeRequestDialogComponent>);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  requestForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: [1, Validators.required],
      targetDate: [null]
    });


  newRequest: ChangeRequest = {
    Title: '',
    Description: '',
    Status: 0,
    Priority: 1
  };

  submitRequest() {
    if (this.requestForm.valid) {
      const newRequest: ChangeRequest = {
        Title: this.requestForm.value.title!,
        Description: this.requestForm.value.description!,
        Status: 0,
        Priority: this.requestForm.value.priority!,
        TargetDate: this.requestForm.value.targetDate
          ? new Date(this.requestForm.value.targetDate)
          : undefined

      };

      this.changeRequestService.createChangeRequest(newRequest).subscribe({
        next: (id) => {
          this.snackBar.open(`Change Request created! ID: ${id}`, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.dialogRef.close(id);
        },
        error: (err) => {
          console.error('Failed to create request', err);
          this.snackBar.open(`Failed to create request`, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
