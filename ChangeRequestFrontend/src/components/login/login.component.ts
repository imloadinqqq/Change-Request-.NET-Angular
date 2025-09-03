import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @ViewChild('username') username!: ElementRef;
  @ViewChild('pass') password!: ElementRef;
  typedPassword: boolean = false;
  show: boolean = false;

  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngAfterViewInit() {
    this.typedPassword = this.password.nativeElement.value.length > 0;
  }

  // functions
  login() {
    const username = this.username.nativeElement.value.trim();
    const password = this.password.nativeElement.value.trim();

    if (username.length == 0 || password.length == 0) {
      return;
    }

    const data = {
      username: username,
      password: password
    };

    this.userService.login(data).subscribe({
      next: (res: any) => {
        // save token
        this.userService.setToken(res.token);

        const userType = this.userService.getUserType();
        console.log('Role: ', userType);

        // add more role-based redirects LATER
        this.router.navigate(['/dashboard']);
        this.snackBar.open('Successfully logged in!', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.snackBar.open(`Invalid username or password`, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        } else if (error.status === 403) {
          this.snackBar.open(`User not approved`, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        } else if (error.status === 500) {
          this.snackBar.open(`Server error`, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        } else {
          this.snackBar.open(`Error ${error.status}: ${error.message}`, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      }
    });
  }

  editPassword() {
    this.typedPassword = this.password.nativeElement.value.length > 0;
  }

  showPassword() {
    this.show = !this.show;
    this.password.nativeElement.type = this.show ? 'text' : 'password';
  }

}
