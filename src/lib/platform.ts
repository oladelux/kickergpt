import { Capacitor } from "@capacitor/core";

export type Platform = "web" | "ios" | "android";

/**
 * Get the current platform
 */
export const getPlatform = (): Platform => {
  const platform = Capacitor.getPlatform();

  if (platform === "ios") return "ios";
  if (platform === "android") return "android";
  return "web";
};

/**
 * Check if running on native mobile (iOS or Android)
 */
export const isNativeMobile = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Check if running on web
 */
export const isWeb = (): boolean => {
  return getPlatform() === "web";
};

/**
 * Check if running on Android
 */
export const isAndroid = (): boolean => {
  return getPlatform() === "android";
};

/**
 * Check if running on iOS
 */
export const isIOS = (): boolean => {
  return getPlatform() === "ios";
};

/**
 * Check if a plugin is available
 */
export const isPluginAvailable = (pluginName: string): boolean => {
  return Capacitor.isPluginAvailable(pluginName);
};

/**
 * Get the app version
 */
export const getAppVersion = (): string => {
  return import.meta.env.VITE_APP_VERSION || "1.0.0";
};

/**
 * Check if ads are available on this platform
 */
export const areAdsAvailable = (): boolean => {
  return isNativeMobile() && isPluginAvailable("AdMob");
};

/**
 * Check if in-app purchases are available on this platform
 */
export const areIAPAvailable = (): boolean => {
  return isNativeMobile() && isPluginAvailable("Purchases");
};
