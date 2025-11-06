import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  email: string;
  planId: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Mock data
  private mockUsers = [
    {
      id: '1',
      email: 'demo@example.com',
      password: 'password123',
      name: 'Demo User',
      planId: 'premium',
    },
  ];

  signup(
    name: string,
    email: string,
    password: string,
    planId: string,
  ): Observable<AuthResponse> {
    // Mock signup
    return of({
      user: { id: Math.random().toString(), name, email, planId },
      token: 'mock-token-' + Math.random(),
    }).pipe(
      delay(1000),
      tap((response) => {
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
      }),
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    // Mock login
    const user = this.mockUsers.find((u) => u.email === email);

    if (!user || user.password !== password) {
      return throwError(() => new Error('Invalid credentials')).pipe(
        delay(500),
      );
    }

    return of({
      user: { id: user.id, name: user.name, email: user.email, planId: user.planId },
      token: 'mock-token-' + Math.random(),
    }).pipe(
      delay(1000),
      tap((response) => {
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
      }),
    );
  }

  logout(): Observable<void> {
    return of(void 0).pipe(
      delay(500),
      tap(() => {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
      }),
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return of({ message: 'Password reset email sent' }).pipe(delay(1000));
  }

  getCurrentUser(): Observable<User | null> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(null);
    }

    // Mock getting current user
    return of({
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      planId: 'premium',
    }).pipe(
      delay(500),
      tap((user) => this.currentUserSubject.next(user)),
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

export const authService = new AuthService();
