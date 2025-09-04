import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { ChangeRequestService } from '../../../services/change-request/change-request.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-request-status-toggle-button',
  imports: [CommonModule, MatButtonToggleModule, FormsModule],
  templateUrl: './update-request-status-toggle-button.component.html',
  styleUrl: './update-request-status-toggle-button.component.css'
})
export class UpdateRequestStatusToggleButtonComponent implements OnInit {
  @Input() requestId!: string | undefined;
  @Input() currentStatus!: string | undefined;
  @Output() statusChanged = new EventEmitter<void>();
  selectedStatus: string = 'InProgress'

  private snackBar = inject(MatSnackBar);
  private changeRequestService = inject(ChangeRequestService);

  ngOnInit(): void {
    this.selectedStatus = this.currentStatus ?? 'InProgress'
  }

  onStatusChange() {
    if (!this.requestId) return;
    console.log(this.selectedStatus);
    this.changeRequestService.updateChangeRequestStatus(this.requestId, this.selectedStatus).subscribe({
      next: (res) => {
        console.log('Status updated:', res);
        this.snackBar.open(`${res}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.statusChanged.emit();
      },
      error: (err) => {
        console.error('Failed to update status', err);
        console.log(this.requestId);
        this.snackBar.open('Failed to update status', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    })
  }
}
