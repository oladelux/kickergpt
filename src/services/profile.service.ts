import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  planName: string;
  creditsUsed: number;
  creditsTotal: number;
}

class ProfileService {
  getProfile(): Observable<ProfileData> {
    return of({
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      planName: 'Premium Plan',
      creditsUsed: 47,
      creditsTotal: 100,
    }).pipe(delay(500));
  }

  updateProfile(data: {
    name?: string;
    email?: string;
  }): Observable<ProfileData> {
    return of({
      id: '1',
      name: data.name || 'Demo User',
      email: data.email || 'demo@example.com',
      planName: 'Premium Plan',
      creditsUsed: 47,
      creditsTotal: 100,
    }).pipe(delay(1000));
  }

  getUsage(): Observable<{ used: number; total: number; percentage: number }> {
    return of({
      used: 47,
      total: 100,
      percentage: 47,
    }).pipe(delay(500));
  }
}

export const profileService = new ProfileService();
