import { useState, useEffect, useCallback } from 'react';
import { adsService, AdState, AdRewardResult } from '@/services/ads.service';
import { areAdsAvailable } from '@/lib/platform';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useAds = () => {
  const [adState, setAdState] = useState<AdState>('not_loaded');
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [canWatchAd, setCanWatchAd] = useState(true);
  const [nextAdAvailableIn, setNextAdAvailableIn] = useState<number | undefined>();

  // Initialize ads service
  useEffect(() => {
    if (areAdsAvailable()) {
      adsService.initialize();
    }

    // Add state listener
    const stateListener = (state: AdState) => {
      setAdState(state);
    };
    adsService.addStateListener(stateListener);

    // Update initial state
    updateCanWatchAd();
    setAdsWatchedToday(adsService.getAdsWatchedToday());

    return () => {
      adsService.removeStateListener(stateListener);
    };
  }, []);

  // Update can watch ad status
  const updateCanWatchAd = useCallback(() => {
    const result = adsService.canWatchAd();
    setCanWatchAd(result.allowed);
    setNextAdAvailableIn(result.nextAvailableIn);
  }, []);

  /**
   * Preload an ad
   */
  const preloadAd = useCallback(async () => {
    if (!areAdsAvailable()) {
      return;
    }

    try {
      await adsService.loadRewardedAd();
    } catch (error) {
      console.error('Failed to preload ad:', error);
    }
  }, []);

  /**
   * Watch a rewarded video ad
   */
  const watchAd = useCallback(async (): Promise<{ success: boolean; credits?: number }> => {
    if (!areAdsAvailable()) {
      toast.error('Ads are not available on this platform');
      return { success: false };
    }

    // Check if user can watch ad
    const canWatch = adsService.canWatchAd();
    if (!canWatch.allowed) {
      toast.error(canWatch.reason || 'Cannot watch ad at this time');
      return { success: false };
    }

    setIsWatchingAd(true);

    try {
      // Show the ad
      const result: AdRewardResult = await adsService.showRewardedAd();

      if (result.success) {
        // Verify reward with backend
        try {
          const response = await api.ads.claimReward({
            creditsEarned: result.credits,
          });

          setAdsWatchedToday(adsService.getAdsWatchedToday());
          updateCanWatchAd();

          toast.success(`You earned ${result.credits} credits!`);
          
          // Preload next ad
          setTimeout(() => {
            preloadAd();
          }, 1000);

          return { success: true, credits: result.credits };
        } catch (error) {
          console.error('Failed to claim ad reward:', error);
          toast.error('Failed to claim your reward. Please try again.');
          return { success: false };
        }
      }

      return { success: false };
    } catch (error: any) {
      console.error('Failed to show ad:', error);
      const errorMessage = error?.error || 'Failed to show ad';
      toast.error(errorMessage);
      updateCanWatchAd();
      return { success: false };
    } finally {
      setIsWatchingAd(false);
    }
  }, [preloadAd, updateCanWatchAd]);

  return {
    // State
    adState,
    isWatchingAd,
    adsWatchedToday,
    canWatchAd,
    nextAdAvailableIn,
    areAdsAvailable: areAdsAvailable(),

    // Methods
    watchAd,
    preloadAd,
    updateCanWatchAd,
  };
};

