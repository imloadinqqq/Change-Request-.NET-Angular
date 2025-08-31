import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService, UserStats } from '../../services/user/user.service';
import { DashboardbuttonComponent } from '../buttons/dashboardbutton/dashboardbutton.component';

@Component({
  selector: 'app-userstats',
  imports: [CommonModule, RouterModule, DashboardbuttonComponent],
  templateUrl: './userstats.component.html',
  styleUrl: './userstats.component.css'
})
export class UserstatsComponent implements OnInit {
  private userService = inject(UserService);
  stats: UserStats | null = null;

  ngOnInit(): void {
      this.loadUserStats();
  }

  loadUserStats() {
    this.userService.getUserStats().subscribe({
      next: data => this.stats = data,
      error: err => console.error('Failed to load user stats', err)
    })
  }

  getRoles(): string[] {
    return this.stats ? Object.keys(this.stats.usersByRole) : [];
  }
}
