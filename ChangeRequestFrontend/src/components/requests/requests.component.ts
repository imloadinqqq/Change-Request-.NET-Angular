import { Component, inject, OnInit } from '@angular/core';
import { ChangeRequestService, ChangeRequest } from '../../services/change-request/change-request.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { RouterModule } from '@angular/router';
import { DashboardbuttonComponent } from '../buttons/dashboard-button/dashboard-button.component';
import { ApproveChangeRequestButtonComponent } from '../buttons/approve-change-request-button/approve-change-request-button.component';
import { RejectChangeRequestButtonComponent } from '../buttons/reject-change-request-button/reject-change-request-button.component';
import { UpdateRequestStatusToggleButtonComponent } from '../buttons/update-request-status-toggle-button/update-request-status-toggle-button.component';

@Component({
  selector: 'app-requests',
  imports: [CommonModule, RouterModule, DashboardbuttonComponent, ApproveChangeRequestButtonComponent, RejectChangeRequestButtonComponent, UpdateRequestStatusToggleButtonComponent],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit {
  private changeRequestService = inject(ChangeRequestService);
  private userService = inject(UserService);

  requests: ChangeRequest[] = [];
  userName: string | null = null;
  userType: string | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.loadRequests();
      this.loadUserName();
      this.loadUserType();
    }
  }

  loadRequests() {
    this.changeRequestService.getAllRequests().subscribe({
      next: data => this.requests = data,
      error: err => console.error('Failed to load requests', err)
    });
  }

  // maybe consolidate to one loadUserInfo()..
  loadUserName() {
    this.userName = this.userService.getUserName();
  }

  loadUserType() {
    this.userType = this.userService.getUserType();
  }

}
