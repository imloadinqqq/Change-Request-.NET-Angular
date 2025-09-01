import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserService } from '../user/user.service';

export interface ChangeRequest {
  "Id"?: string;
  "Title": string;
  "Description": string;
  "Status": number;
  "Priority": number;
  "Target Date"?: string;
  "Id of Approver"?: string | null;
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

  createChangeRequest(data: any) {
    const token = this.userService.getToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post<ChangeRequest>(this.api_url, data, { headers }).pipe(
      map((res) => res.Id)
    );
  }
}
