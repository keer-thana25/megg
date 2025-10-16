import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  username: string;
  role: string;
  generation: string;
  profilePicture?: string;
  bio?: string;
  interests: string[];
  achievements: string[];
  followers?: User[];
  following?: User[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  generation: string;
  interests?: string[];
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'chronolink_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      // Decode token to get user info (simplified - in production, verify token with server)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.getProfile().subscribe({
          next: (response: any) => {
            if (response.success) {
              this.currentUserSubject.next(response.user);
            }
          },
          error: () => {
            this.logout();
          }
        });
      } catch (error) {
        this.logout();
      }
    }
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setSession(response);
          }
        })
      );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setSession(response);
          }
        })
      );
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem(this.tokenKey, authResponse.token);
    this.currentUserSubject.next(authResponse.user);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null && this.currentUserSubject.value !== null;
  }

  getProfile(): Observable<{ success: boolean; user: User }> {
    return this.http.get<{ success: boolean; user: User }>(`${this.apiUrl}/auth/profile`);
  }

  updateProfile(userData: Partial<User>): Observable<{ success: boolean; user: User }> {
    return this.http.put<{ success: boolean; user: User }>(`${this.apiUrl}/auth/profile`, userData)
      .pipe(
        tap(response => {
          if (response.success) {
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  refreshCurrentUser(): void {
    this.getProfile().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.currentUserSubject.next(response.user);
        }
      },
      error: () => {
        this.logout();
      }
    });
  }
}
