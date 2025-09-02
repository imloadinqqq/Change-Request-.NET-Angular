import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-user-button-toggle',
  imports: [CommonModule, MatButtonToggleModule, FormsModule],
  templateUrl: './update-user-button-toggle.component.html',
  styleUrl: './update-user-button-toggle.component.css'
})
export class UpdateUserButtonToggleComponent implements OnInit {
  @Input() userId!: string | undefined;
  @Input() currentRole!: string | undefined;
  @Output() roleChanged = new EventEmitter<void>();
  selectedRole: string = 'developer';

  private snackBar = inject(MatSnackBar);
  private userService = inject(UserService);


  ngOnInit() {
    this.selectedRole = this.currentRole ?? 'developer';
  }

onRoleChange() {
    if (!this.userId) return;
    this.userService.updateUserRole(this.userId, this.selectedRole).subscribe({
      next: (res) => {
        console.log('Role updated:', res);
        this.snackBar.open(`${res}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.roleChanged.emit();
      },
      error: (err) => {
        console.error('Failed to update role', err);
        this.snackBar.open('Failed to update role', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }
}
