import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User, UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardbuttonComponent } from '../buttons/dashboard-button/dashboard-button.component';
import { UpdateUserButtonToggleComponent } from '../buttons/update-user-button-toggle/update-user-button-toggle.component';

@Component({
  selector: 'app-userview',
  imports: [CommonModule, FormsModule, RouterModule, DashboardbuttonComponent, UpdateUserButtonToggleComponent],
  templateUrl: './userview.component.html',
  styleUrl: './userview.component.css'
})
export class UserviewComponent implements OnInit {
  // private router = inject(Router);
  private userService = inject(UserService);
  users: User[] = [];
  userType: string | null = null;
  loggedInUserId: string | null = null;

  selectedRoleMap: { [userId: string]: string } = {};

  ngOnInit(): void {
    if(typeof window !== 'undefined') {
      this.fetchUsers();
      this.userType = this.userService.getUserType();
      this.loggedInUserId = this.userService.getUserId();
    }
    console.log(this.userType);
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe({
      next: data => {
        console.log('Raw users from backend:', data);
        this.users = data;
      },
      error: err => console.error('Failed to load users', err)
    });
  }

  approve(user: User) {
    if (!user.Id) return;

    this.userService.approveUser(user.Id).subscribe({
      next: () => {
        console.log(`User ${user.Username} approved`);
        user.IsApproved = true; // update UI immediately
      },
      error: err => console.error('Approval failed', err)
    });
  }

  onRoleChange(user: User) {
    if (!user.Id) return;

    const previousRole = user.UserType;
    const newRole = this.selectedRoleMap[user.Id];

    user.UserType = newRole;

    this.userService.updateUserRole(user.Id, newRole).subscribe({
      next: () => {
        console.log(`Role for ${user.Username} updated to ${newRole}`);
      },
      error: err => {
        console.error('Failed to update role', err);
        user.UserType = previousRole;
      }
    });
  }
}
