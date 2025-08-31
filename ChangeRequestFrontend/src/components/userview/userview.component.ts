import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User, UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardbuttonComponent } from '../buttons/dashboardbutton/dashboardbutton.component';

@Component({
  selector: 'app-userview',
  imports: [CommonModule, FormsModule, RouterModule, DashboardbuttonComponent],
  templateUrl: './userview.component.html',
  styleUrl: './userview.component.css'
})
export class UserviewComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  users: User[] = [];

  ngOnInit(): void {
    if(typeof window !== 'undefined') {
      this.fetchUsers();
    }
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe({
      next: data => this.users = data,
      error: err => console.error('Failed to load users', err)
    });
  }
}
