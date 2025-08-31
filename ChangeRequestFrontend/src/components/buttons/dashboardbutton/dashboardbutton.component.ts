import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboardbutton',
  imports: [RouterModule],
  templateUrl: './dashboardbutton.component.html',
  styleUrl: './dashboardbutton.component.css'
})
export class DashboardbuttonComponent {
  private router = inject(Router);

  navToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
