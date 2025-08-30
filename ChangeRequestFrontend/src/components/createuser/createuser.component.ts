import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-createuser',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './createuser.component.html',
  styleUrl: './createuser.component.css'
})
export class CreateuserComponent {
  private userService = inject(UserService);
  private router = inject(Router);

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
        next: res => console.log('Success:', res),
        error: err => console.log('Error:', err)
      });

      this.router.navigate(['/login']);
    } else {
      window.alert('Passwords must match');
    }
  }
}
