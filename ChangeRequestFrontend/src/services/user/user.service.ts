import { jwtDecode } from 'jwt-decode';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  login(credentials: { username: string; password: string }) {
    return this.http.post(this.apiUrl + '/login', credentials);
  }

  // called after successful login (200 status)
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
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

  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return true;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }
}
