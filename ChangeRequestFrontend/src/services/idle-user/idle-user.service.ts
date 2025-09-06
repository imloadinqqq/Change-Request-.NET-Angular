import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

export enum IdleUserTimes {
  IdleTime = 300000, // 5 minutes
  CountdownTime = 5000
}

@Injectable({
  providedIn: 'root'
})
export class IdleUserService {
  private timeoutId: any;
  private countdownId: any;
  private countdownValue: number = 0;
  private snackbarRef: MatSnackBarRef<any> | null = null;

  userInactive: Subject<boolean> = new Subject();

  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.userService.userLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.reset();
        this.initListener();
      } else {
        this.clearTimers();
      }
    });

    if (this.userService.getToken()) {
      this.reset();
      this.initListener();
    }
  }

  private initListener() {
    const events = [
      'mousemove',
      'click',
      'keypress',
      'DOMMouseScroll',
      'mousewheel',
      'touchmove',
      'MSPointerMove'
    ];
    events.forEach(event => window.addEventListener(event, () => this.reset()));
  }

  private reset() {
    if (!this.userService.getToken()) return;

    this.clearTimers();
    this.startIdleTimer();
  }

  private startIdleTimer() {
    if (!this.userService.getToken()) return;

    this.timeoutId = setTimeout(() => {
      console.log('Inactivity detected');
      this.startCountdown();
    }, IdleUserTimes.IdleTime);
  }

  private startCountdown() {
    if (!this.userService.getToken()) return;

    this.countdownValue = IdleUserTimes.CountdownTime / 1000;

    this.snackbarRef = this.snackBar.open(
      `You will be logged out in ${this.countdownValue} second(s)`,
      'Close',
      { horizontalPosition: 'center', verticalPosition: 'top', duration: undefined }
    );

    this.countdownId = setInterval(() => {
      this.countdownValue--;

      // Update snackbar message
      if (this.snackbarRef) {
        this.snackbarRef.instance.snackBarRef.dismiss();
        this.snackbarRef.dismiss();
        this.snackbarRef = this.snackBar.open(
          `You will be logged out in ${this.countdownValue} second(s)`,
          'Close',
          { horizontalPosition: 'center', verticalPosition: 'top', duration: undefined }
        );
      }

      if (this.countdownValue <= 0) {
        this.clearTimers();
        this.userInactive.next(true);
        this.userService.logout();
        this.router.navigate(['/login']);
        this.snackBar.open('You have been logged out due to inactivity', 'Close', {
          duration: 0,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    }, 1000);
  }

  private clearTimers() {
    clearTimeout(this.timeoutId);
    clearInterval(this.countdownId);

    if (this.snackbarRef) {
      this.snackbarRef.dismiss();
      this.snackbarRef = null;
    }
  }
}
