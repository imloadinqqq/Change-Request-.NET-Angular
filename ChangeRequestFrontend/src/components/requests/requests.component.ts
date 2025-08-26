import { Component, inject, OnInit } from '@angular/core';
import { ChangeRequestService, ChangeRequest } from '../../services/change-request.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-requests',
  imports: [CommonModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit {
  private changeRequestService = inject(ChangeRequestService);
  requests: ChangeRequest[] = [];

  ngOnInit(): void {
      this.loadRequests();
  }

  loadRequests() {
    this.changeRequestService.getAllRequests().subscribe(data => this.requests = data);
  }
}
