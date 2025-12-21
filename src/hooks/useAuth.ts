import { useState, useEffect } from "react";
import { authService, User, AuthResponse } from "@/services/auth.service";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscription = authService.currentUser$.subscribe(setUser);

    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      authService.getCurrentUser().subscribe({
        next: () => setLoading(false),
        error: () => setLoading(false),
      });
    } else {
      setLoading(false);
    }

    return () => subscription.unsubscribe();
  }, []);

  const signup = (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    countryCode: string
  ) => {
    setLoading(true);
    setError(null);

    return new Promise<AuthResponse>((resolve, reject) => {
      authService.signup(firstName, lastName, email, password, countryCode).subscribe({
        next: (response) => {
          setLoading(false);
          resolve(response);
        },
        error: (err) => {
          setLoading(false);
          setError(err.message);
          reject(err);
        },
      });
    });
  };

  const login = (email: string, password: string, countryCode: string) => {
    setLoading(true);
    setError(null);

    return new Promise<AuthResponse>((resolve, reject) => {
      authService.login(email, password, countryCode).subscribe({
        next: (response) => {
          console.log("response", response);
          setLoading(false);
          resolve(response);
        },
        error: (err) => {
          setLoading(false);
          setError(err.message);
          reject(err);
        },
      });
    });
  };

  const logout = () => {
    setLoading(true);

    return new Promise<void>((resolve) => {
      authService.logout().subscribe({
        next: () => {
          setLoading(false);
          resolve();
        },
      });
    });
  };

  const forgotPassword = (email: string) => {
    setLoading(true);
    setError(null);

    return new Promise<{ message: string }>((resolve, reject) => {
      authService.forgotPassword(email).subscribe({
        next: (response) => {
          setLoading(false);
          resolve(response);
        },
        error: (err) => {
          setLoading(false);
          setError(err.message);
          reject(err);
        },
      });
    });
  };

  const resendVerificationEmail = (email: string) => {
    setLoading(true);
    setError(null);

    return new Promise<{ message: string }>((resolve, reject) => {
      authService.resendVerificationEmail(email).subscribe({
        next: (response) => {
          setLoading(false);
          resolve(response);
        },
        error: (err) => {
          setLoading(false);
          setError(err.message);
          reject(err);
        },
      });
    });
  };

  const confirmEmail = (hash: string) => {
    setLoading(true);
    setError(null);

    return new Promise<{ message: string }>((resolve, reject) => {
      authService.confirmEmail(hash).subscribe({
        next: (response) => {
          setLoading(false);
          resolve(response);
        },
        error: (err) => {
          setLoading(false);
          setError(err.message);
          reject(err);
        },
      });
    });
  };

  return {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    forgotPassword,
    resendVerificationEmail,
    confirmEmail,
    isAuthenticated: !!user,
  };
};
