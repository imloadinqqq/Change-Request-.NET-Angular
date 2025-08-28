import { Component, inject, OnInit } from '@angular/core';
import { ChangeRequestService, ChangeRequest } from '../../services/change-request/change-request.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-requests',
  imports: [CommonModule, RouterModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit {
  private changeRequestService = inject(ChangeRequestService);
  private userService = inject(UserService);
  private router = inject(Router);
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
