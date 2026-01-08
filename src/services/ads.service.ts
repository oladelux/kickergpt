import {
  AdMob,
  RewardAdPluginEvents,
  InterstitialAdPluginEvents,
  AdMobRewardItem,
  AdLoadInfo,
} from "@capacitor-community/admob";
import { areAdsAvailable, isNativeMobile } from "@/lib/platform";
import { getRewardedVideoAdUnitId, getInterstitialAdUnitId, ADMOB_CONFIG } from "@/lib/config";

export type AdRewardResult = {
  success: boolean;
  credits: number;
  error?: string;
};

export type AdState = "not_loaded" | "loading" | "loaded" | "showing" | "completed" | "failed";

class AdsService {
  private isInitialized = false;
  private adState: AdState = "not_loaded";
  private interstitialAdState: AdState = "not_loaded";
  private lastAdWatchedTime: number = 0;
  private lastInterstitialShownTime: number = 0;
  private adsWatchedToday: number = 0;
  private todayDate: string = new Date().toDateString();
  private rewardListeners: Array<(result: AdRewardResult) => void> = [];
  private stateListeners: Array<(state: AdState) => void> = [];
  private interstitialListeners: Array<() => void> = [];
  private interstitialStateListeners: Array<(state: AdState) => void> = [];
  private interstitialCooldownMinutes: number = ADMOB_CONFIG.INTERSTITIAL_COOLDOWN_MINUTES;

  /**
   * Initialize AdMob
   */
  async initialize(): Promise<boolean> {
    if (!areAdsAvailable()) {
      console.warn("Ads are not available on this platform");
      return false;
    }

    if (this.isInitialized) {
      return true;
    }

    try {
      // Initialize AdMob
      await AdMob.initialize({
        testingDevices: ["YOUR_TEST_DEVICE_ID"], // Add your test device ID for testing
        initializeForTesting: true, // Set to false in production
      });

      // Add event listeners
      this.setupEventListeners();

      this.isInitialized = true;
      console.log("AdMob initialized successfully");
      return true;
    } catch (error) {
      console.error("Failed to initialize AdMob:", error);
      return false;
    }
  }

  /**
   * Setup AdMob event listeners
   */
  private setupEventListeners(): void {
    // Listen for rewarded ad events
    AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
      console.log("Rewarded ad loaded", info);
      this.updateAdState("loaded");
    });

    AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
      console.error("Rewarded ad failed to load", error);
      this.updateAdState("failed");
    });

    AdMob.addListener(RewardAdPluginEvents.Showed, () => {
      console.log("Rewarded ad showed");
      this.updateAdState("showing");
    });

    AdMob.addListener(RewardAdPluginEvents.FailedToShow, (error) => {
      console.error("Rewarded ad failed to show", error);
      this.updateAdState("failed");
      this.notifyRewardListeners({
        success: false,
        credits: 0,
        error: "Failed to show ad",
      });
    });

    AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      console.log("Rewarded ad dismissed");
      this.updateAdState("not_loaded");
    });

    AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
      console.log("User earned reward", reward);
      this.handleAdReward(reward);
    });

    // Setup interstitial ad event listeners
    this.setupInterstitialEventListeners();
  }

  /**
   * Setup interstitial ad event listeners
   */
  private setupInterstitialEventListeners(): void {
    AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
      console.log("Interstitial ad loaded", info);
      this.updateInterstitialAdState("loaded");
    });

    AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error) => {
      console.error("Interstitial ad failed to load", error);
      this.updateInterstitialAdState("failed");
    });

    AdMob.addListener(InterstitialAdPluginEvents.Showed, () => {
      console.log("Interstitial ad showed");
      this.updateInterstitialAdState("showing");
    });

    AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (error) => {
      console.error("Interstitial ad failed to show", error);
      this.updateInterstitialAdState("failed");
    });

    AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      console.log("Interstitial ad dismissed");
      this.updateInterstitialAdState("not_loaded");
      this.lastInterstitialShownTime = Date.now();
      this.notifyInterstitialListeners();
    });
  }

  /**
   * Load a rewarded video ad
   */
  async loadRewardedAd(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!areAdsAvailable()) {
      throw new Error("Ads not available on this platform");
    }

    if (this.adState === "loading" || this.adState === "loaded") {
      return;
    }

    try {
      this.updateAdState("loading");
      const adUnitId = getRewardedVideoAdUnitId();

      await AdMob.prepareRewardVideoAd({
        adId: adUnitId,
        npa: false, // Set to true for non-personalized ads
      });
    } catch (error) {
      console.error("Failed to load rewarded ad:", error);
      this.updateAdState("failed");
      throw error;
    }
  }

  /**
   * Show a rewarded video ad
   */
  async showRewardedAd(): Promise<AdRewardResult> {
    return new Promise((resolve, reject) => {
      const execute = async () => {
        if (!this.isInitialized) {
          await this.initialize();
        }

        if (!areAdsAvailable()) {
          const error = { success: false, credits: 0, error: "Ads not available" };
          reject(error);
          return;
        }

        // Check if user can watch an ad
        const canWatch = this.canWatchAd();
        if (!canWatch.allowed) {
          const error = { success: false, credits: 0, error: canWatch.reason };
          reject(error);
          return;
        }

        // Load ad if not loaded
        if (this.adState !== "loaded") {
          try {
            await this.loadRewardedAd();
          } catch (error) {
            const errorResult = {
              success: false,
              credits: 0,
              error: "Failed to load ad",
            };
            reject(errorResult);
            return;
          }
        }

        // Setup one-time listener for this specific ad
        const rewardListener = (result: AdRewardResult) => {
          this.removeRewardListener(rewardListener);
          if (result.success) {
            resolve(result);
          } else {
            reject(result);
          }
        };

        this.addRewardListener(rewardListener);

        try {
          await AdMob.showRewardVideoAd();
        } catch (error) {
          this.removeRewardListener(rewardListener);
          const errorResult = {
            success: false,
            credits: 0,
            error: "Failed to show ad",
          };
          reject(errorResult);
        }
      };

      execute();
    });
  }

  /**
   * Handle ad reward
   */
  private handleAdReward(reward: AdMobRewardItem): void {
    console.log("Processing ad reward:", reward);

    const credits = ADMOB_CONFIG.CREDITS_PER_AD;
    this.lastAdWatchedTime = Date.now();
    this.incrementAdsWatchedToday();
    this.updateAdState("completed");

    const result: AdRewardResult = {
      success: true,
      credits,
    };

    this.notifyRewardListeners(result);
  }

  /**
   * Check if user can watch an ad
   */
  canWatchAd(): { allowed: boolean; reason?: string; nextAvailableIn?: number } {
    if (!areAdsAvailable()) {
      return { allowed: false, reason: "Ads not available on this platform" };
    }

    // Check daily limit
    this.checkAndResetDailyCount();
    if (this.adsWatchedToday >= ADMOB_CONFIG.MAX_ADS_PER_DAY) {
      return {
        allowed: false,
        reason: `Daily limit of ${ADMOB_CONFIG.MAX_ADS_PER_DAY} ads reached. Try again tomorrow!`,
      };
    }

    // Check cooldown
    const now = Date.now();
    const timeSinceLastAd = now - this.lastAdWatchedTime;
    const cooldownMs = ADMOB_CONFIG.AD_COOLDOWN_MINUTES * 60 * 1000;

    if (timeSinceLastAd < cooldownMs) {
      const remainingMs = cooldownMs - timeSinceLastAd;
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      return {
        allowed: false,
        reason: `Please wait ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""} before watching another ad`,
        nextAvailableIn: remainingMs,
      };
    }

    return { allowed: true };
  }

  /**
   * Get current ad state
   */
  getAdState(): AdState {
    return this.adState;
  }

  /**
   * Get ads watched today count
   */
  getAdsWatchedToday(): number {
    this.checkAndResetDailyCount();
    return this.adsWatchedToday;
  }

  /**
   * Check and reset daily count if it's a new day
   */
  private checkAndResetDailyCount(): void {
    const today = new Date().toDateString();
    if (today !== this.todayDate) {
      this.todayDate = today;
      this.adsWatchedToday = 0;
    }
  }

  /**
   * Increment ads watched today
   */
  private incrementAdsWatchedToday(): void {
    this.checkAndResetDailyCount();
    this.adsWatchedToday++;
  }

  /**
   * Update ad state and notify listeners
   */
  private updateAdState(state: AdState): void {
    this.adState = state;
    this.notifyStateListeners(state);
  }

  /**
   * Add reward listener
   */
  addRewardListener(listener: (result: AdRewardResult) => void): void {
    this.rewardListeners.push(listener);
  }

  /**
   * Remove reward listener
   */
  removeRewardListener(listener: (result: AdRewardResult) => void): void {
    this.rewardListeners = this.rewardListeners.filter((l) => l !== listener);
  }

  /**
   * Notify reward listeners
   */
  private notifyRewardListeners(result: AdRewardResult): void {
    this.rewardListeners.forEach((listener) => listener(result));
  }

  /**
   * Add state listener
   */
  addStateListener(listener: (state: AdState) => void): void {
    this.stateListeners.push(listener);
  }

  /**
   * Remove state listener
   */
  removeStateListener(listener: (state: AdState) => void): void {
    this.stateListeners = this.stateListeners.filter((l) => l !== listener);
  }

  /**
   * Notify state listeners
   */
  private notifyStateListeners(state: AdState): void {
    this.stateListeners.forEach((listener) => listener(state));
  }

  /**
   * Load an interstitial ad
   */
  async loadInterstitialAd(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!areAdsAvailable()) {
      throw new Error("Ads not available on this platform");
    }

    if (this.interstitialAdState === "loading" || this.interstitialAdState === "loaded") {
      return;
    }

    try {
      this.updateInterstitialAdState("loading");
      const adUnitId = getInterstitialAdUnitId();

      await AdMob.prepareInterstitial({
        adId: adUnitId,
        npa: false, // Set to true for non-personalized ads
      });
    } catch (error) {
      console.error("Failed to load interstitial ad:", error);
      this.updateInterstitialAdState("failed");
      throw error;
    }
  }

  /**
   * Show an interstitial ad
   */
  async showInterstitialAd(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!areAdsAvailable()) {
      throw new Error("Ads not available on this platform");
    }

    // Check if we can show an interstitial ad
    const canShow = this.canShowInterstitial();
    if (!canShow.allowed) {
      console.log("Cannot show interstitial ad:", canShow.reason);
      return;
    }

    // Load ad if not loaded
    if (this.interstitialAdState !== "loaded") {
      try {
        await this.loadInterstitialAd();
      } catch (error) {
        console.error("Failed to load interstitial ad:", error);
        return;
      }
    }

    try {
      await AdMob.showInterstitial();
    } catch (error) {
      console.error("Failed to show interstitial ad:", error);
      this.updateInterstitialAdState("failed");
      throw error;
    }
  }

  /**
   * Check if we can show an interstitial ad
   */
  canShowInterstitial(): { allowed: boolean; reason?: string } {
    if (!areAdsAvailable()) {
      return { allowed: false, reason: "Ads not available on this platform" };
    }

    // Check cooldown
    const now = Date.now();
    const timeSinceLastInterstitial = now - this.lastInterstitialShownTime;
    const cooldownMs = this.interstitialCooldownMinutes * 60 * 1000;

    if (timeSinceLastInterstitial < cooldownMs && this.lastInterstitialShownTime > 0) {
      const remainingMs = cooldownMs - timeSinceLastInterstitial;
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      return {
        allowed: false,
        reason: `Please wait ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""} before showing another interstitial ad`,
      };
    }

    return { allowed: true };
  }

  /**
   * Get current interstitial ad state
   */
  getInterstitialAdState(): AdState {
    return this.interstitialAdState;
  }

  /**
   * Update interstitial ad state and notify listeners
   */
  private updateInterstitialAdState(state: AdState): void {
    this.interstitialAdState = state;
    this.notifyInterstitialStateListeners(state);
  }

  /**
   * Add interstitial listener
   */
  addInterstitialListener(listener: () => void): void {
    this.interstitialListeners.push(listener);
  }

  /**
   * Remove interstitial listener
   */
  removeInterstitialListener(listener: () => void): void {
    this.interstitialListeners = this.interstitialListeners.filter((l) => l !== listener);
  }

  /**
   * Notify interstitial listeners
   */
  private notifyInterstitialListeners(): void {
    this.interstitialListeners.forEach((listener) => listener());
  }

  /**
   * Add interstitial state listener
   */
  addInterstitialStateListener(listener: (state: AdState) => void): void {
    this.interstitialStateListeners.push(listener);
  }

  /**
   * Remove interstitial state listener
   */
  removeInterstitialStateListener(listener: (state: AdState) => void): void {
    this.interstitialStateListeners = this.interstitialStateListeners.filter((l) => l !== listener);
  }

  /**
   * Notify interstitial state listeners
   */
  private notifyInterstitialStateListeners(state: AdState): void {
    this.interstitialStateListeners.forEach((listener) => listener(state));
  }

  /**
   * Cleanup
   */
  async cleanup(): Promise<void> {
    this.rewardListeners = [];
    this.stateListeners = [];
    this.interstitialListeners = [];
    this.interstitialStateListeners = [];
    // AdMob doesn't require explicit cleanup in v7
  }
}

// Export singleton instance
export const adsService = new AdsService();
