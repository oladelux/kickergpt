import { useState, useEffect } from 'react';
import { profileService, ProfileData } from '@/services/profile.service';

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = () => {
    setLoading(true);
    setError(null);

    profileService.getProfile().subscribe({
      next: (data) => {
        setProfile(data);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateProfile = (data: { name?: string; email?: string }) => {
    setLoading(true);
    setError(null);

    return new Promise<ProfileData>((resolve, reject) => {
      profileService.updateProfile(data).subscribe({
        next: (updatedProfile) => {
          setProfile(updatedProfile);
          setLoading(false);
          resolve(updatedProfile);
        },
        error: (err) => {
          setError(err.message);
          setLoading(false);
          reject(err);
        },
      });
    });
  };

  const getUsage = () => {
    return new Promise<{ used: number; total: number; percentage: number }>(
      (resolve, reject) => {
        profileService.getUsage().subscribe({
          next: resolve,
          error: reject,
        });
      },
    );
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    getUsage,
    reload: loadProfile,
  };
};
