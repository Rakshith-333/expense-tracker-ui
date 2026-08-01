import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse, User } from '../models/login-response.model';
import { API } from '../constants/api.constants';
import { environment } from '../../../environments/environment';
import { RegisterRequest } from '../models/register-request.model';
import { RegisterResponse } from '../models/register-response.model';
import { DashboardResponse } from '../models/dashboard-response';
import { AddExpenseRequest } from '../models/add-expense-request';
import { AddExpenseResponse } from '../models/add-expense-response';
import { ExpenseResponse } from '../models/expenses-response';
import { ProfileResponse, UpdateMonthlyBudgetRequest, UpdateMonthlyBudgetResponse } from '../models/profile-response.model';

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

   getDashboard(): Observable<DashboardResponse> {
    const token = localStorage.getItem('token');
    const headersConfig: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    const headers = new HttpHeaders(headersConfig);

    return this.http.get<DashboardResponse>(
      `${this.baseUrl}${API.AUTH.DASHBOARD}`,
      { headers }
    );
  }

  getProfile(): Observable<ProfileResponse> {
    const token = localStorage.getItem('token');
    const headersConfig: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    const headers = new HttpHeaders(headersConfig);

    return this.http.get<ProfileResponse>(`${this.baseUrl}${API.PROFILE.GET}`, { headers });
  }

  updateMonthlyBudget(payload: UpdateMonthlyBudgetRequest): Observable<UpdateMonthlyBudgetResponse> {
    const token = localStorage.getItem('token');
    const headersConfig: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    const headers = new HttpHeaders(headersConfig);

    return this.http.put<UpdateMonthlyBudgetResponse>(`${this.baseUrl}${API.PROFILE.UPDATE_BUDGET}`, payload, { headers });
  }

  addExpense(payload: AddExpenseRequest): Observable<AddExpenseResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http.post<AddExpenseResponse>(`${this.baseUrl}${API.EXPENSES.ADDEXPENSE}`, payload, { headers })
  }

  getExpenses(
  page: number = 1,
  pageSize: number = 10
): Observable<ExpenseResponse> {

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  const params = new HttpParams()
    .set('page', page)
    .set('pageSize', pageSize);

  return this.http.get<ExpenseResponse>(
    `${this.baseUrl}${API.EXPENSES.GETEXPENSES}`,
    {
      headers,
      params
    }
  );
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
