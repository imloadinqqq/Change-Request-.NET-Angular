import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { ClockComponent } from '../clock/clock.component';
import { CreatechangrequestbuttonComponent } from '../buttons/createchangrequestbutton/createchangrequestbutton.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, ClockComponent, CreatechangrequestbuttonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  userType: string | null = null;
  userName: string | null = null;

  ngOnInit(): void {
      this.loadDashBoard();
  }

  loadDashBoard(): void {
    this.userType = this.userService.getUserType();
    this.userName = this.userService.getUserName();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
    console.log('logged out');
  }

  navToRequests() {
    this.router.navigate(['/requests']);
    console.log('requests');
  }

  viewUsers() {
    this.router.navigate(['/users']);
    console.log('update');
  }

  viewUserStats() {
    this.router.navigate(['/userStats']);
  }
}
