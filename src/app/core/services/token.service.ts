import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  constructor() {}

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  saveUser(user: unknown): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser<T>(): T | null {
    const user = localStorage.getItem(this.USER_KEY);

    return user ? JSON.parse(user) as T : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  logout(): void {
    this.clear();
  }

}
