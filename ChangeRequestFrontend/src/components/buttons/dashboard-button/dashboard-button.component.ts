import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboardbutton',
  imports: [RouterModule],
  templateUrl: './dashboard-button.component.html',
  styleUrl: './dashboard-button.component.css'
})
export class DashboardbuttonComponent {
  private router = inject(Router);

  navToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
