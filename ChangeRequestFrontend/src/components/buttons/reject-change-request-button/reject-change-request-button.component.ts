import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { ChangeRequestService } from '../../../services/change-request/change-request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reject-change-request-button',
  imports: [CommonModule],
  templateUrl: './reject-change-request-button.component.html',
  styleUrl: './reject-change-request-button.component.css'
})
export class RejectChangeRequestButtonComponent {
  private changeRequestService = inject(ChangeRequestService);
  private snackBar = inject(MatSnackBar);

  @Input() requestId!: string;
  @Output() rejected = new EventEmitter<void>();

  rejectRequest() {
    this.changeRequestService.rejectChangeRequest(this.requestId).subscribe({
      next: (id) => {
        console.log("Request Rejected: ", id);
        this.snackBar.open(`Change Request rejected! ID: ${id}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.rejected.emit();
      },
      error: (err) => {
        console.error("Failed to reject: ", err);
        this.snackBar.open('Failed to reject change request', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    });
  }
}
