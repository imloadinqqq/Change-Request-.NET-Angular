import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeRequestService, ChangeRequest } from '../../services/change-request/change-request.service';

@Component({
  selector: 'app-create-change-request-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatSelectModule],
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
      status: [0, Validators.required],
      priority: [1, Validators.required],
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
        Status: this.requestForm.value.status!,
        Priority: this.requestForm.value.priority!,
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
