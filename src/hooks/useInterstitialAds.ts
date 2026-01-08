import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { adsService } from "@/services/ads.service";
import { areAdsAvailable } from "@/lib/platform";
import { useSubscriptionData } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";

/**
 * Routes that should never show interstitial ads
 */
const EXCLUDED_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/password-change",
  "/verify-email",
  "/confirm-email",
  "/confirm-reset-password",
  "/verify-payment",
  "/verify-addon-purchase",
  "/payment-successful",
  "/privacy",
  "/terms",
  "/survey",
];

/**
 * Routes that are considered main app screens (where we show ads between)
 */
const MAIN_APP_ROUTES = [
  "/fixtures",
  "/chat",
  "/strategies",
  "/favorites",
  "/history",
  "/profile",
  "/plans",
  "/control-room",
];

/**
 * Hook to handle interstitial ads on navigation
 * Only shows ads for FREE plan users
 */
export const useInterstitialAds = () => {
  const location = useLocation();
  const previousLocationRef = useRef<string>(location.pathname);
  const { plan, loading: planLoading } = useSubscriptionData();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Don't show ads if:
    // - Ads are not available on this platform
    // - User is not authenticated
    // - Plan is still loading
    // - User is not on FREE plan
    if (!areAdsAvailable() || !isAuthenticated || planLoading) {
      previousLocationRef.current = location.pathname;
      return;
    }

    // Only show ads for FREE plan users
    if (plan?.plan !== "FREE") {
      previousLocationRef.current = location.pathname;
      return;
    }

    const currentPath = location.pathname;
    const previousPath = previousLocationRef.current;

    // Don't show ad if navigating to/from excluded routes
    if (EXCLUDED_ROUTES.includes(currentPath) || EXCLUDED_ROUTES.includes(previousPath)) {
      previousLocationRef.current = currentPath;
      return;
    }

    // Only show ads when navigating between main app routes
    const isCurrentMainRoute = MAIN_APP_ROUTES.some((route) => currentPath.startsWith(route));
    const isPreviousMainRoute = MAIN_APP_ROUTES.some((route) => previousPath.startsWith(route));

    // Only show ad if navigating between different main app routes
    if (isCurrentMainRoute && isPreviousMainRoute && currentPath !== previousPath) {
      // Show interstitial ad (non-blocking - navigation continues)
      adsService.showInterstitialAd().catch((error) => {
        console.error("Failed to show interstitial ad:", error);
        // Don't block navigation if ad fails
      });

      // Preload next interstitial ad after a short delay
      setTimeout(() => {
        adsService.loadInterstitialAd().catch((error) => {
          console.error("Failed to preload interstitial ad:", error);
        });
      }, 1000);
    }

    // Update previous location
    previousLocationRef.current = currentPath;
  }, [location.pathname, plan, planLoading, isAuthenticated]);

  // Preload interstitial ad on mount if user is FREE plan
  useEffect(() => {
    if (areAdsAvailable() && isAuthenticated && !planLoading && plan?.plan === "FREE") {
      // Preload first interstitial ad
      adsService.loadInterstitialAd().catch((error) => {
        console.error("Failed to preload interstitial ad:", error);
      });
    }
  }, [isAuthenticated, plan, planLoading]);
};
