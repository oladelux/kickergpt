import { isAndroid, isIOS, isWeb } from "./platform";

/**
 * Configuration for the app
 */

// AdMob Configuration
export const ADMOB_CONFIG = {
  // Test IDs for development - replace with your actual AdMob IDs in production
  APP_ID: {
    android: "ca-app-pub-3940256099942544~3347511713", // Test App ID
    ios: "ca-app-pub-3940256099942544~1458002511", // Test App ID
  },
  REWARDED_VIDEO_ID: {
    android: "ca-app-pub-3940256099942544/5224354917", // Test Rewarded Video
    ios: "ca-app-pub-3940256099942544/1712485313", // Test Rewarded Video
  },
  // Ad settings
  AD_COOLDOWN_MINUTES: 5, // Minimum time between ads
  CREDITS_PER_AD: 5, // Credits earned per completed ad
  MAX_ADS_PER_DAY: 20, // Maximum ads a user can watch per day
};

/**
 * Get the AdMob Rewarded Video Ad Unit ID for the current platform
 */
export const getRewardedVideoAdUnitId = (): string => {
  if (isAndroid()) {
    return ADMOB_CONFIG.REWARDED_VIDEO_ID.android;
  } else if (isIOS()) {
    return ADMOB_CONFIG.REWARDED_VIDEO_ID.ios;
  }
  return "";
};

/**
 * Get the AdMob App ID for the current platform
 */
export const getAdMobAppId = (): string => {
  if (isAndroid()) {
    return ADMOB_CONFIG.APP_ID.android;
  } else if (isIOS()) {
    return ADMOB_CONFIG.APP_ID.ios;
  }
  return "";
};

// Environment Configuration
export const ENV_CONFIG = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseUrl: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URI || "",
};

/**
 * Check if app is in development mode
 */
export const isDevelopment = (): boolean => {
  return ENV_CONFIG.isDevelopment;
};

/**
 * Check if app is in production mode
 */
export const isProduction = (): boolean => {
  return ENV_CONFIG.isProduction;
};
