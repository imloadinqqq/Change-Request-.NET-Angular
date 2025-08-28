import { jwtDecode } from 'jwt-decode';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

interface JwtPayload {
  sub: string;
  unique_name: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
  iss: string;
  aud: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private tokenKey = 'auth_token';
  private apiUrl = 'http://localhost:5163/api';

  private http = inject(HttpClient);

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ token: string; user: { id: string; username: string } }>(
      this.apiUrl + '/login',
      credentials
    ).pipe(
      tap(res => {
        if (this.isBrowser()) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem('username', res.user.username);
        }
      })
    );
  }

  // called after successful login (200 status)
  setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.tokenKey) : null;
  }

  private getDecodedToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch(e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  getUserType(): string | null {
    const decoded = this.getDecodedToken();
    return decoded ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;
  }

  getUserId(): string | null {
    const decoded = this.getDecodedToken();
    return decoded ? decoded.sub : null;
  }

  getUserName(): string | null {
    return this.isBrowser() ? localStorage.getItem("username") : null;
  }

  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return true;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }
}
