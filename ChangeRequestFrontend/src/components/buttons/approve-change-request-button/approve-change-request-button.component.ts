import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { ChangeRequestService } from '../../../services/change-request/change-request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approve-change-request-button',
  imports: [CommonModule],
  templateUrl: './approve-change-request-button.component.html',
  styleUrl: './approve-change-request-button.component.css'
})
export class ApproveChangeRequestButtonComponent {
  private changeRequestService = inject(ChangeRequestService);
  private snackBar = inject(MatSnackBar);
  @Input() requestId!: string;
  @Output() approved = new EventEmitter<void>();

  approveRequest() {
    this.changeRequestService.approveChangeRequest(this.requestId).subscribe({
      next: (id) => {
        console.log("Request Approved: ", id);
        this.snackBar.open(`Change Request approved! ID: ${id}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.approved.emit();
      },
      error: (err) => {
        console.log("Failed to approved: ", err);
        this.snackBar.open('Failed to approve change request', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    })
  }

}
