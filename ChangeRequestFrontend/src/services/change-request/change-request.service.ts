import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private readonly api_url = 'http://localhost:5163/api/requests'
  private http = inject(HttpClient);

  getAllRequests(): Observable<ChangeRequest[]> {
    const token = localStorage.getItem('auth_token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined
    return this.http.get<ChangeRequest[]>(this.api_url, { headers });
  }
}
