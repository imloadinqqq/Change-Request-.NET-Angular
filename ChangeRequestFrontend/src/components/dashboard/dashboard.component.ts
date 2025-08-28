import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  userType: string | null = null;

  ngOnInit(): void {
      this.loadDashBoard();
  }

  loadDashBoard(): void {
    this.userType = this.userService.getUserType();

    // handle user type
    switch(this.userType) {
      case 'Admin': {
        console.log('admin');
        // admin dashboard
        break;
      }
      case 'Developer': {
        console.log('dev');
        // dev dashboard
        break;
      }
      case 'Supervisor': {
        console.log('super');
        // supervisor dashboard
        break;
      }
      default: {
        console.log('not logged in');
        break;
      }
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
    console.log('logged out');
  }

}
