import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IdleUserService } from '../services/idle-user/idle-user.service';
import { UserService } from '../services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ChangeRequestFrontend';
  private idleUserService = inject(IdleUserService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.idleUserService.userInactive.subscribe(() => {
      this.snackBar.open('You have been logged out due to inactivity.', 'Close', {
        duration: 0,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    })
  }
}
