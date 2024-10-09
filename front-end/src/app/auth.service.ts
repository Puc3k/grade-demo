import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/login';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, password });
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  getUserRoles(): string[] | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken.roles || null;
    }
    return null;
  }

  isTeacherOrAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles !== null && (roles.includes('ROLE_TEACHER') || roles.includes('ROLE_ADMIN'));
  }
}
