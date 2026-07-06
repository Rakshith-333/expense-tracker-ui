import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse, User } from '../models/login-response.model';
import { API } from '../constants/api.constants';
import { environment } from '../../../environments/environment';
import { RegisterRequest } from '../models/register-request.model';
import { RegisterResponse } from '../models/register-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http.post<LoginResponse>(`${this.baseUrl}${API.AUTH.LOGIN}`, payload, { headers })
  }

   register(payload: RegisterRequest): Observable<RegisterResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http.post<RegisterResponse>(`${this.baseUrl}${API.AUTH.REGISTER}`, payload, { headers })
  }

//   logout(): void {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('authUser');
//   }

//   getToken(): string | null {
//     return localStorage.getItem('authToken');
//   }

//   getUser(): User | null {
//     const user = localStorage.getItem('authUser');
//     return user ? JSON.parse(user) : null;
//   }

//   isLoggedIn(): boolean {
//     return !!this.getToken();
//   }

//   private storeAuth(response: LoginResponse): void {
//     if (response?.success && response.data?.token) {
//       localStorage.setItem('authToken', response.data.token);
//       if (response.data.user) {
//         localStorage.setItem('authUser', JSON.stringify(response.data.user));
//       }
//     }
//   }
}
