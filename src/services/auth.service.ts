import { BehaviorSubject, Observable, of, from, throwError } from "rxjs";
import { map, tap, catchError, switchMap, finalize, shareReplay } from "rxjs/operators";
import { api, getToken, removeToken, UnauthorizedError } from "@/lib/api";

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
  private currentUserRequest$: Observable<User | null> | null = null;

  signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    countryCode: string
  ): Observable<AuthResponse> {
    return from(api.auth.signup({ firstName, lastName, email, password, countryCode })).pipe(
      switchMap(() => this.login(email, password, countryCode))
    );
  }

  login(email: string, password: string, countryCode: string): Observable<AuthResponse> {
    return from(api.auth.login({ email, password, countryCode })).pipe(
      map((response) => this.normalizeAuthResponse(response)),
      tap(({ user }) => this.currentUserSubject.next(user)),
      catchError((error) => {
        if (error instanceof UnauthorizedError && error.errorCode === "emailNotVerified") {
          const emailNotVerifiedError = new Error("Email not verified") as Error & {
            code?: string;
          };
          emailNotVerifiedError.code = "emailNotVerified";
          throw emailNotVerifiedError;
        }
        throw error;
      })
    );
  }

  logout(): Observable<void> {
    return from(api.auth.logout()).pipe(
      catchError(() => of(null)),
      tap(() => {
        removeToken();
        this.currentUserSubject.next(null);
        this.currentUserRequest$ = null;
      }),
      map(() => void 0)
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return from(api.auth.forgotPassword({ email })).pipe(
      map((response) => ({
        message: response?.message ?? "Password reset email sent",
      }))
    );
  }

  resendVerificationEmail(email: string): Observable<{ message: string }> {
    return from(api.auth.resendVerificationEmail({ email })).pipe(
      map((response) => ({
        message: response?.message ?? "Email sent if the account exists/unverified.",
      }))
    );
  }

  confirmEmail(hash: string): Observable<{ message: string }> {
    return from(api.auth.confirmEmail(hash)).pipe(
      map((response) => ({
        message: response?.message ?? "Email verified successfully",
      }))
    );
  }

  getCurrentUser(force = false): Observable<User | null> {
    const existingUser = this.currentUserSubject.value;
    if (!force && existingUser) {
      return of(existingUser);
    }

    if (!force && this.currentUserRequest$) {
      return this.currentUserRequest$;
    }

    const token = getToken();
    if (!token) {
      return of(null);
    }

    const request$ = from(api.auth.me()).pipe(
      map((response) => this.normalizeUser(response?.user ?? response)),
      tap((user) => this.currentUserSubject.next(user)),
      catchError(() => {
        this.currentUserSubject.next(null);
        removeToken();
        return of(null);
      }),
      finalize(() => {
        this.currentUserRequest$ = null;
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.currentUserRequest$ = request$;
    return request$;
  }

  isAuthenticated(): boolean {
    return !!getToken();
  }

  private normalizeAuthResponse(data: unknown): AuthResponse {
    const d = data as Record<string, unknown> | null | undefined;
    const user = this.normalizeUser((d && (d.user ?? d)) || {});
    return {
      user,
      token:
        (typeof d?.token === "string" && d.token) ||
        (typeof d?.accessToken === "string" && d.accessToken) ||
        getToken() ||
        "",
    };
  }

  private normalizeUser(data): User {
    if (!data) {
      return {
        id: "",
        name: "",
        email: "",
        planId: "",
      };
    }

    const firstName = data.firstName ?? data.given_name ?? "";
    const lastName = data.lastName ?? data.family_name ?? "";
    const name = data.name ?? [firstName, lastName].filter(Boolean).join(" ");

    return {
      id: data.id ?? data._id ?? "",
      name,
      email: data.email ?? "",
      planId: data.planId ?? data.plan_id ?? data.subscriptionPlanId ?? "",
    };
  }
}

export const authService = new AuthService();
