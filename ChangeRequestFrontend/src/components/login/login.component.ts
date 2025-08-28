import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
        this.router.navigate(['/requests']);
      },
      error: (err) => {
        console.error('Login failed: ', err);
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
