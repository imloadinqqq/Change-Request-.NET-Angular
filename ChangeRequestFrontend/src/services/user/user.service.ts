import { jwtDecode } from 'jwt-decode';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface JwtPayload {
  sub: string;
  unique_name: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
  iss: string;
  aud: string;
}

export interface User {
  "Id"?: string;
  "Username": string;
  "Password"?: string;
  "UserType"?: string | null;
  "IsApproved"?: boolean;
}

export interface UserStats {
  totalUsers: number;
  usersByRole: {
    [role: string]: number;
  };
}

interface UserInfo {
  UserName: string;
  Password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private tokenKey = 'auth_token';
  private readonly api_url = 'http://localhost:3000/api';

  private http = inject(HttpClient);

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ token: string; user: { id: string; username: string } }>(
      this.api_url + '/login',
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

  sendUserInfo(data: UserInfo): Observable<UserInfo> {
    return this.http.post<UserInfo>(this.api_url + '/register', data);
  }

  updateUserRole(userId: string, role: string): Observable<string> {
    const url = `${this.api_url}/users/${userId}/role`;

    const token = this.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const body = { newRole: role };

    return this.http.patch(url, body, { headers, responseType: 'text' });
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

  // logout
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('username');
  }

  logout(): void {
    this.removeToken();
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

  getAllUsers(): Observable<User[]> {
    const token = this.getToken();
    const url = `${this.api_url}/users`;
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<User[]>(url, { headers });
  }

  getUserStats(): Observable<UserStats> {
    const token = this.getToken();
    const url = `${this.api_url}/users/stats`;
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<UserStats>(url, { headers });

  }

  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return true;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    return !this.isTokenExpired();
  }

  approveUser(id: string)  {
    const token = this.getToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post(this.api_url + `/approve/${id}`, null, { headers });
  }
}
