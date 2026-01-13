import { isAndroid, isIOS, isWeb } from "./platform";

/**
 * Configuration for the app
 */

// AdMob Configuration
export const ADMOB_CONFIG = {
  APP_ID: {
    android: "ca-app-pub-3625004979166724~8542529874",
    ios: "ca-app-pub-3940256099942544~1458002511",
  },
  REWARDED_VIDEO_ID: {
    android: "ca-app-pub-3625004979166724/5942796005",
    ios: "ca-app-pub-3940256099942544/1712485313",
  },
  INTERSTITIAL_ID: {
    android: "ca-app-pub-3625004979166724/8327078894",
    ios: "ca-app-pub-3940256099942544/4411468910",
  },
  AD_COOLDOWN_MINUTES: 1,
  INTERSTITIAL_COOLDOWN_MINUTES: 2,
  CREDITS_PER_AD: 2,
  MAX_ADS_PER_DAY: 20,
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
 * Get the AdMob Interstitial Ad Unit ID for the current platform
 */
export const getInterstitialAdUnitId = (): string => {
  if (isAndroid()) {
    return ADMOB_CONFIG.INTERSTITIAL_ID.android;
  } else if (isIOS()) {
    return ADMOB_CONFIG.INTERSTITIAL_ID.ios;
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
