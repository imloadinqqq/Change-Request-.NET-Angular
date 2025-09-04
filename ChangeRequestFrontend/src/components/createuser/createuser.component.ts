import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-createuser',
  imports: [CommonModule, RouterModule, FormsModule, MatSnackBarModule],
  templateUrl: './createuser.component.html',
  styleUrl: './createuser.component.css'
})
export class CreateuserComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  @ViewChild('username') username!: ElementRef;
  @ViewChild('pass') password!: ElementRef;
  @ViewChild('validpass') validpass!: ElementRef;
  typedPassword: boolean = false;
  show: boolean = false;

  ngAfterViewInit(): void {
    this.typedPassword = this.password.nativeElement.value.length > 0;
  }

  editPassword() {
    this.typedPassword = this.password.nativeElement.value.length > 0;
  }

  showPassword() {
    this.show = !this.show;
    this.password.nativeElement.type = this.show ? 'text' : 'password';
    this.validpass.nativeElement.type = this.show ? 'text' : 'password';
  }

  submitUser() {
    const username = this.username.nativeElement.value;
    const password = this.password.nativeElement.value;
    const validPassword = this.validpass.nativeElement.value;

    if (password === validPassword) {
      const data: { UserName: string, Password: string }= {
        UserName: username,
        Password: password
      }
      this.userService.sendUserInfo(data).subscribe({
        next: (res) => {
          this.snackBar.open(`Successfully created user: ${data.UserName}`, 'Close',
          {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          console.log(res);
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.snackBar.open('Username already exists', 'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            })
          } else if (error.status === 500) {
            this.snackBar.open('Server error', 'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          } else {
            this.snackBar.open(`Error ${error.status}: ${error.message}`, 'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        }
      });
    } else {
    this.snackBar.open('Passwords must match!', 'Close',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }
}
