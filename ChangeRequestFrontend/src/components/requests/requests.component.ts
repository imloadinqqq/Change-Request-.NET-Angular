import { Component, inject, OnInit } from '@angular/core';
import { ChangeRequestService, ChangeRequest } from '../../services/change-request/change-request.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { RouterModule } from '@angular/router';
import { DashboardbuttonComponent } from '../buttons/dashboard-button/dashboard-button.component';
import { ApproveChangeRequestButtonComponent } from '../buttons/approve-change-request-button/approve-change-request-button.component';
import { RejectChangeRequestButtonComponent } from '../buttons/reject-change-request-button/reject-change-request-button.component';
import { UpdateRequestStatusToggleButtonComponent } from '../buttons/update-request-status-toggle-button/update-request-status-toggle-button.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-requests',
  imports: [CommonModule, RouterModule, DashboardbuttonComponent, ApproveChangeRequestButtonComponent, RejectChangeRequestButtonComponent, UpdateRequestStatusToggleButtonComponent, NgxPaginationModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit {
  private changeRequestService = inject(ChangeRequestService);
  private userService = inject(UserService);

  requests: ChangeRequest[] = [];
  filteredRequests: ChangeRequest[] = [];
  allStatus: string[] = ["Pending", "Approved", "Rejected", "InProgress", "Completed"];
  userName: string | null = null;
  userType: string | null = null;
  page: number = 1;
  currentStatusFilter: string | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.loadRequests();
      this.loadUserName();
      this.loadUserType();
    }
  }

  loadRequests() {
    this.changeRequestService.getAllRequests().subscribe({
      next: (requests) => {
        this.requests = requests.map((request) => ({ ...request }));
      },
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

  filterByStatus(status: string) {
    this.currentStatusFilter = status;
    this.filteredRequests = this.requests.filter((request) => request.Status.toString() === status);
    console.log(this.currentStatusFilter);
  }

  clearFilter() {
    this.currentStatusFilter = null;
    this.filteredRequests = [...this.requests];
  }

}
