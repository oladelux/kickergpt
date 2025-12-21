# BootRoom Bot - Mobile App Documentation

## Overview

This document provides a comprehensive guide for the BootRoom Bot mobile app implementation using Capacitor. The app wraps the existing React web app and adds native mobile features including:

- **Rewarded Video Ads** (AdMob) - Users can watch ads to earn free credits
- **In-App Purchases** (Google Play) - Users can purchase credit packs
- **Native Mobile Experience** - Hardware back button, splash screen, etc.

## 📁 Project Structure

```
boot-room-bot/
├── android/                          # Native Android project (auto-generated)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml  # App permissions & config
│   │   │   └── res/                 # App icons & resources
│   │   └── build.gradle             # Android build configuration
│   └── build.gradle                 # Root Gradle config
├── src/
│   ├── components/
│   │   ├── WatchAdButton.tsx        # Button to trigger rewarded ads
│   │   └── CreditPurchaseModal.tsx  # Modal for in-app purchases
│   ├── hooks/
│   │   ├── useAds.ts                # Hook for ad functionality
│   │   └── useIAP.ts                # Hook for in-app purchases
│   ├── services/
│   │   ├── ads.service.ts           # AdMob service (singleton)
│   ├── lib/
│   │   ├── platform.ts              # Platform detection utilities
│   │   └── config.ts                # App configuration (AdMob IDs, etc.)
│   └── pages/
│       └── Plans.tsx                # Updated with mobile features
├── capacitor.config.ts              # Capacitor configuration
├── BACKEND_API_REQUIREMENTS.md      # Backend API documentation
├── PLAY_STORE_GUIDE.md              # Play Store submission guide
├── TESTING_GUIDE.md                 # Comprehensive testing guide
└── .env.example                     # Environment variables template
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Java 21 (for Android builds)
- Android Studio (for Android development)
- Physical Android device with USB debugging enabled
- Google Play Developer account ($25 one-time fee)
- AdMob account (free)

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

3. **Build web app:**

```bash
npm run build
```

4. **Sync with Capacitor:**

```bash
npm run cap:sync:android
```

5. **Open in Android Studio:**

```bash
npm run cap:open:android
```

6. **Run on device:**

- Connect Android device via USB
- Enable Developer Mode and USB Debugging
- Click "Run" in Android Studio

## 📱 Mobile Features

### 1. Rewarded Video Ads (AdMob)

**User Flow:**

1. User navigates to Plans page
2. Clicks "Watch Ad for Credits" button
3. Rewarded video ad plays
4. User watches ad to completion
5. 5 credits granted automatically
6. Credits update in real-time

**Configuration:**

- AdMob IDs in `src/lib/config.ts`
- Test IDs included for development
- Replace with production IDs before release

**Limitations:**

- 5-minute cooldown between ads
- Maximum 20 ads per day
- Only available on mobile (hidden on web)

**Files:**

- `src/services/ads.service.ts` - Core ad logic
- `src/hooks/useAds.ts` - React hook for components
- `src/components/WatchAdButton.tsx` - UI component

### 2. In-App Purchases (Google Play)

**User Flow:**

1. User clicks "View Credit Packs" on Plans page
2. Modal opens showing available products
3. User selects a product (10, 50, or 100 credits)
4. Google Play purchase dialog opens
5. User completes purchase
6. Credits added immediately
7. Purchase verified with backend

**Products:**

- 10 Credits - $2.99
- 50 Credits - $9.99
- 100 Credits - $17.99

**Configuration:**

- Product IDs in `src/lib/config.ts`
- Products created in Google Play Console

**Files:**

- `src/hooks/useIAP.ts` - React hook for components
- `src/components/CreditPurchaseModal.tsx` - UI modal

### 3. Platform Detection

**Utilities:**

```typescript
import { isNativeMobile, isAndroid, isIOS, isWeb } from "@/lib/platform";

if (isNativeMobile()) {
  // Show mobile-only features
}

if (isWeb()) {
  // Show web-only features (Stripe, etc.)
}
```

**Usage:**

- Conditionally render mobile features
- Show/hide UI elements based on platform
- Different payment flows (Stripe on web, IAP on mobile)

### 4. Credit System

**Credit Types:**

1. **Monthly Allowance** - From subscription (10 for Free, 100 for Pro)
2. **Addon Credits** - Purchased via Stripe on web
3. **Ad Credits** - Earned by watching ads (mobile only)
4. **Purchased Credits** - Bought via IAP (mobile only)

**Consumption Order:**

1. Ad credits (free)
2. Purchased credits
3. Addon credits
4. Monthly allowance

**Display:**

- Total credits shown prominently
- Breakdown available on Plans page
- Real-time updates after earning/purchasing

## 🔧 Development

### Available Scripts

```bash
# Web development
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Capacitor
npm run cap:sync         # Sync web assets to native projects
npm run cap:sync:android # Sync to Android only
npm run cap:open:android # Open Android Studio
npm run cap:run:android  # Build and run on device
npm run cap:build        # Build web + sync to native
```

### Development Workflow

1. **Make changes to React code**
2. **Build web app:** `npm run build`
3. **Sync to Capacitor:** `npm run cap:sync:android`
4. **Run in Android Studio** or use `npm run cap:run:android`

**Hot Reload (for faster development):**

- Run `npm run dev` to start Vite dev server
- Update `capacitor.config.ts`:

```typescript
server: {
  url: 'http://192.168.1.X:5173', // Your local IP
  cleartext: true
}
```

- Sync and run on device
- Changes reflect immediately without rebuild

### Testing

**Test AdMob Ads:**

- Test ad IDs are pre-configured
- Ads load immediately in test mode
- Replace with production IDs before release

**Test In-App Purchases:**

- Add test users in Google Play Console
- Use test Google account on device
- Test purchases don't charge real money
- Products must be published (at least in internal testing)

**See:** `TESTING_GUIDE.md` for comprehensive testing procedures

## 🏗️ Backend Requirements

The mobile app requires new backend API endpoints:

### 1. Ad Reward Endpoint

**POST** `/ads/reward`

- Verifies and grants credits after ad completion
- Enforces cooldown and daily limits
- Returns updated credit balance

### 2. IAP Verification Endpoint

**POST** `/purchases/verify-mobile`

- Verifies purchase with Google Play API
- Prevents duplicate transactions
- Grants credits to user account

### 3. Updated Usage Endpoint

**GET** `/subscriptions/usage`

- Returns all credit types (monthly, addon, ad, purchased)
- Calculates total credits remaining

**See:** `BACKEND_API_REQUIREMENTS.md` for detailed implementation guide

## 📦 Building for Production

### 1. Update Configuration

**Update AdMob IDs** in `src/lib/config.ts`:

```typescript
export const ADMOB_CONFIG = {
  APP_ID: {
    android: "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
  },
  REWARDED_VIDEO_ID: {
    android: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
  },
  // ...
};
```

**Update API URL** in `.env.local`:

```bash
VITE_API_URL=https://your-production-api.com
```

### 2. Generate Signing Key

```bash
cd android/app
keytool -genkey -v -keystore bootroom-release-key.keystore \
  -alias bootroom-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**IMPORTANT:** Save keystore password and key password securely!

### 3. Configure Signing

Create `android/key.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=bootroom-key
storeFile=bootroom-release-key.keystore
```

### 4. Build Release Bundle

```bash
# Build web app
npm run build

# Sync to Android
npm run cap:sync:android

# Build AAB
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### 5. Upload to Play Console

1. Go to Google Play Console
2. Create new release (Production or Internal Testing)
3. Upload `app-release.aab`
4. Fill in release notes
5. Submit for review

**See:** `PLAY_STORE_GUIDE.md` for detailed submission guide

## 🎨 Customization

### App Icon

Replace icons in `android/app/src/main/res/`:

- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

### Splash Screen

Update in `capacitor.config.ts`:

```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    backgroundColor: "#000000",
    // ...
  },
}
```

### App Name

Update in `android/app/src/main/res/values/strings.xml`:

```xml
<string name="app_name">BootRoom Bot</string>
```

### Bundle ID

Update in `capacitor.config.ts` and `android/app/build.gradle`:

```typescript
appId: "com.kickergpt.app";
```

## 🐛 Troubleshooting

### Ads Not Loading

**Problem:** Ads don't load or show error

**Solutions:**

- Wait 1-2 hours after creating ad units
- Verify AdMob app ID in `AndroidManifest.xml`
- Check device has internet connection
- Ensure ad unit IDs are correct
- Check AdMob account status

### IAP Not Working

**Problem:** Products don't load or purchase fails

**Solutions:**

- Ensure app is published (at least internal testing)
- Use licensed test account
- Verify product IDs match exactly
- Ensure Google Play service account is set up

### Build Errors

**Problem:** Gradle build fails

**Solutions:**

- Clean build: `cd android && ./gradlew clean`
- Invalidate caches in Android Studio
- Update Android SDK
- Check for duplicate resources
- Verify all dependencies installed

### App Crashes

**Problem:** App crashes on startup or during use

**Solutions:**

- Check logcat for errors: `adb logcat`
- Verify all plugins initialized correctly
- Check for missing permissions
- Ensure API endpoints are accessible
- Test on different devices

## 📚 Resources

### Documentation

- [Capacitor Docs](https://capacitorjs.com/docs)
- [AdMob Capacitor Plugin](https://github.com/capacitor-community/admob)
- [Android Developer Guide](https://developer.android.com/)

### Tools

- [Google Play Console](https://play.google.com/console)
- [AdMob Console](https://apps.admob.com/)
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)

### Support

- GitHub Issues: [Your repo]
- Email: support@bootroombot.com
- Documentation: This file and linked guides

## 🔐 Security Notes

1. **Never commit sensitive data:**
   - Keystore files
   - API keys in code (use .env)
   - Service account credentials
   - Passwords

2. **Add to `.gitignore`:**

   ```
   android/key.properties
   android/app/*.keystore
   .env.local
   google-services.json
   ```

3. **Backend verification:**
   - Always verify ad rewards server-side
   - Verify IAP receipts with Google Play API
   - Never trust client-side data

4. **Rate limiting:**
   - Implement on backend for ad rewards
   - Prevent abuse of credit system

## 📝 License

[Your License]

## 👥 Contributors

[Your Name/Team]

---

## Quick Reference

### Key Files

| File                                       | Purpose                      |
| ------------------------------------------ | ---------------------------- |
| `capacitor.config.ts`                      | Capacitor configuration      |
| `android/app/src/main/AndroidManifest.xml` | Android permissions & config |
| `src/lib/config.ts`                        | AdMob IDs                    |
| `src/lib/platform.ts`                      | Platform detection utilities |
| `src/services/ads.service.ts`              | AdMob integration            |
| `src/services/iap.service.ts`              | IAP integration              |
| `BACKEND_API_REQUIREMENTS.md`              | Backend API specs            |
| `PLAY_STORE_GUIDE.md`                      | Submission guide             |
| `TESTING_GUIDE.md`                         | Testing procedures           |

### Important Commands

```bash
# Development
npm run dev                    # Web dev server
npm run cap:sync:android       # Sync to Android
npm run cap:open:android       # Open Android Studio

# Production
npm run build                  # Build web app
cd android && ./gradlew bundleRelease  # Build AAB

# Testing
adb logcat                     # View logs
adb install app-release.apk   # Install APK
adb shell pm clear com.kickergpt.app  # Clear app data
```

### Support Checklist

Before asking for help:

- [ ] Checked this README
- [ ] Checked relevant guide (Testing, Play Store, Backend API)
- [ ] Searched existing issues
- [ ] Tried troubleshooting steps
- [ ] Have error logs ready
- [ ] Know device/Android version

---

**Last Updated:** December 2025

**Version:** 1.0.0

Good luck with your mobile app launch! 🚀📱
