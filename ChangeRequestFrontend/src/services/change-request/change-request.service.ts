import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserService } from '../user/user.service';

export interface ChangeRequest {
  "Id"?: string;
  "CreatedDate"?: Date;
  "UserId"?: string;
  "Title": string;
  "Description": string;
  "Status": number;
  "Priority": number;
  "TargetDate"?: Date;
  "ApproverId"?: string | null;
  "ApprovalDate"?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChangeRequestService {
  private readonly api_url = 'http://localhost:3000/api/requests'
  private userService = inject(UserService);
  private http = inject(HttpClient);

  getAllRequests(): Observable<ChangeRequest[]> {
    const token = this.userService.getToken(); // read from local storage to avoid refresh errors
    let headers = new HttpHeaders();
    console.log(localStorage.getItem('auth_token'));

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<ChangeRequest[]>(this.api_url, { headers });
  }

  createChangeRequest(request: Omit<ChangeRequest, 'Id' | 'UserId'>): Observable<string> {
    const token = this.userService.getToken();
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.post<ChangeRequest>(this.api_url, request, { headers }).pipe(
      map(res => res.Id!)
    );
  }

  approveChangeRequest(requestId: string) {
    const token = this.userService.getToken();
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.post<ChangeRequest>(`${this.api_url}/${requestId}/approve`, null, { headers }).pipe(
      map(res => res.Id!)
    );
  }

  rejectChangeRequest(requestId: string) {
    const token = this.userService.getToken();
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.post<ChangeRequest>(`${this.api_url}/${requestId}/reject`, null, { headers }).pipe(
      map(res => res.Id!)
    );
  }

  updateChangeRequestStatus(requestId: string, status: string): Observable<string> {
    const url = `${this.api_url}/${requestId}/status`;

    const token = this.userService.getToken();
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    const body = { NewStatus: status };

    return this.http.patch(url, body, { headers, responseType: 'text' });
  }
}
