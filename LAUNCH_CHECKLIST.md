# BootRoom Bot Mobile App - Launch Checklist

Use this checklist to track your progress from implementation to Play Store launch.

## ✅ Phase 1: Implementation (COMPLETE)

- [x] Install Capacitor and dependencies
- [x] Initialize Android platform
- [x] Configure Android manifest and build files
- [x] Create platform detection utilities
- [x] Implement AdMob service and hook
- [x] Implement IAP service and hook
- [x] Create UI components (WatchAdButton, CreditPurchaseModal)
- [x] Update Plans page with mobile features
- [x] Update App.tsx with mobile initialization
- [x] Extend credit system for multiple types
- [x] Add API endpoints to api.ts
- [x] Create comprehensive documentation
- [x] Test build successfully

## 🔧 Phase 2: Backend Implementation (TODO)

- [ ] Add `ad_credits_remaining` column to users table
- [ ] Add `purchased_credits_remaining` column to users table
- [ ] Add `last_ad_watched_at` column to users table
- [ ] Add `ads_watched_today` and `ads_watch_date` columns
- [ ] Create `mobile_purchases` table
- [ ] Implement `POST /ads/reward` endpoint
- [ ] Implement `POST /purchases/verify-mobile` endpoint
- [ ] Implement `POST /purchases/sync` endpoint
- [ ] Update `GET /subscriptions/usage` endpoint
- [ ] Update credit consumption logic (priority order)
- [ ] Set up Google Play Developer API credentials
- [ ] Test backend endpoints with Postman/curl
- [ ] Deploy backend changes to production

## 🎮 Phase 3: Third-Party Service Setup (TODO)

### AdMob

- [ ] Create AdMob account
- [ ] Register BootRoom Bot app
- [ ] Create Rewarded Video ad unit
- [ ] Note production App ID
- [ ] Note production Ad Unit ID
- [ ] Update `src/lib/config.ts` with production IDs
- [ ] Update `AndroidManifest.xml` with production App ID
- [ ] Test ads load correctly

### Google Play Console

- [ ] Create Google Play Developer account ($25)
- [ ] Create new app in Play Console
- [ ] Set app name: BootRoom Bot
- [ ] Set package name: com.kickergpt.app
- [ ] Create in-app products:
  - [ ] credits_10 ($2.99)
  - [ ] credits_50 ($9.99)
  - [ ] credits_100 ($17.99)
- [ ] Activate all products
- [ ] Set up service account for API access
- [ ] Download service account JSON
- [ ] Add test users for testing

## 🧪 Phase 4: Testing (TODO)

**Note:** Testing requires a physical Android device with USB debugging enabled. See "Install on Physical Device" section below.

### Device Testing

- [ ] Test on Android 10 physical device
- [ ] Test on Android 11 physical device
- [ ] Test on Android 12+ physical device
- [ ] Test on tablet (optional)

### Feature Testing

- [ ] Sign up new account
- [ ] Log in existing account
- [ ] View fixtures dashboard
- [ ] Send chat message (consume credit)
- [ ] Watch rewarded video ad
- [ ] Verify credits granted after ad
- [ ] Test ad cooldown (5 minutes)
- [ ] Test daily ad limit (20 ads)
- [ ] Open credit purchase modal
- [ ] View products from Google Play
- [ ] Complete test purchase
- [ ] Verify credits granted after purchase
- [ ] Test restore purchases
- [ ] Test with exhausted credits
- [ ] Test hardware back button
- [ ] Test app backgrounding/resuming
- [ ] Test offline behavior
- [ ] Test error states

### Performance Testing

- [ ] App launches in < 3 seconds
- [ ] No crashes during testing
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] Reasonable battery usage

### Install on Physical Device

**Prerequisites:**

- [ ] Java 21 installed (required for Android builds)
- [ ] Physical Android device available
- [ ] USB cable for connecting device to computer

**Enable Developer Mode on Android Phone:**

1. Go to Settings → About Phone
2. Tap "Build Number" 7 times
3. Go back to Settings
4. Open Developer Options
5. Enable "USB Debugging"

**Install App via USB:**

```bash
# Build the app
npm run build
npm run cap:sync:android

# Connect phone via USB and install
npx cap run android
```

The app will automatically:

- Detect your connected device
- Build and install the APK
- Launch the app

**Alternative - Build and Transfer APK:**

If USB installation doesn't work, build an APK and transfer it:

```bash
cd android
./gradlew assembleDebug
```

The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

Transfer via:

- WhatsApp
- Google Drive
- AirDrop (to Mac, then to phone)
- Email

Then install the APK on your phone.

## 🎨 Phase 5: Assets & Branding (TODO)

### App Icon

- [ ] Design app icon (512x512)
- [ ] Generate adaptive icon layers
- [ ] Create all required sizes:
  - [ ] mdpi (48x48)
  - [ ] hdpi (72x72)
  - [ ] xhdpi (96x96)
  - [ ] xxhdpi (144x144)
  - [ ] xxxhdpi (192x192)
- [ ] Replace icons in `android/app/src/main/res/`
- [ ] Test icon appearance on device

### Play Store Graphics

- [ ] Create feature graphic (1024x500)
- [ ] Take screenshots (minimum 2):
  - [ ] Fixtures dashboard
  - [ ] Chat interface
  - [ ] Plans page
  - [ ] Watch ad feature
  - [ ] Credit purchase modal
- [ ] Add device frames to screenshots (optional)
- [ ] Create promotional video (optional)

### Legal Documents

- [ ] Write privacy policy
- [ ] Host privacy policy online
- [ ] Write terms of service
- [ ] Host terms of service online
- [ ] Note privacy policy URL
- [ ] Note terms of service URL

## 📝 Phase 6: Play Store Listing (TODO)

### App Information

- [ ] App name: BootRoom Bot
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Category: Sports
- [ ] Tags/keywords
- [ ] Contact email
- [ ] Website URL
- [ ] Privacy policy URL

### Content Rating

- [ ] Complete IARC questionnaire
- [ ] Receive content rating
- [ ] Expected: Everyone or Teen

### Data Safety

- [ ] Complete data safety form
- [ ] List data collected
- [ ] List data shared
- [ ] Describe security practices
- [ ] Confirm data deletion policy

### Store Presence

- [ ] Upload app icon
- [ ] Upload feature graphic
- [ ] Upload screenshots
- [ ] Upload promotional video (optional)
- [ ] Review all information
- [ ] Save store listing

## 🔨 Phase 7: Build Release (TODO)

### Generate Signing Key

- [ ] Generate keystore file
- [ ] Save keystore password securely
- [ ] Save key password securely
- [ ] Back up keystore to secure location
- [ ] Create `android/key.properties`
- [ ] Add key.properties to .gitignore

### Configure Signing

- [ ] Update `android/app/build.gradle` with signing config
- [ ] Test signing configuration
- [ ] Verify keystore accessible

### Update Version

- [ ] Set versionCode to 1
- [ ] Set versionName to "1.0.0"
- [ ] Update in `android/app/build.gradle`

### Build AAB

- [ ] Run `npm run build`
- [ ] Run `npm run cap:sync:android`
- [ ] Run `cd android && ./gradlew bundleRelease`
- [ ] Locate AAB at `android/app/build/outputs/bundle/release/app-release.aab`
- [ ] Verify AAB file size reasonable

### Test Release Build

- [ ] Build release APK: `./gradlew assembleRelease`
- [ ] Install on device: `adb install app-release.apk`
- [ ] Test all features on release build
- [ ] Verify no debug code/logging
- [ ] Verify production API URL
- [ ] Verify production AdMob IDs

## 🚀 Phase 8: Play Store Submission (TODO)

### Internal Testing (Recommended)

- [ ] Create internal testing release
- [ ] Upload AAB
- [ ] Add internal testers
- [ ] Share testing link
- [ ] Collect feedback
- [ ] Fix any issues
- [ ] Repeat until stable

### Production Release

- [ ] Go to Production in Play Console
- [ ] Create new release
- [ ] Upload AAB
- [ ] Write release notes
- [ ] Review all information
- [ ] Submit for review
- [ ] Wait for Google review (1-3 days)
- [ ] Receive approval email
- [ ] App goes live!

## 📊 Phase 9: Post-Launch (TODO)

### Monitor Performance

- [ ] Check install numbers daily
- [ ] Monitor crash reports
- [ ] Read user reviews
- [ ] Respond to reviews
- [ ] Track ad revenue in AdMob
- [ ] Track IAP revenue in Play Console
- [ ] Monitor backend API usage
- [ ] Check for errors in logs

### Marketing

- [ ] Announce on social media
- [ ] Email existing users
- [ ] Update website with app links
- [ ] Create app landing page
- [ ] Submit to app review sites
- [ ] Reach out to influencers

### Iterate

- [ ] Collect user feedback
- [ ] Plan feature updates
- [ ] Fix bugs
- [ ] Optimize performance
- [ ] A/B test monetization
- [ ] Update regularly

## 🎯 Success Metrics

Track these KPIs:

- [ ] Installs per day
- [ ] Daily active users (DAU)
- [ ] Weekly active users (WAU)
- [ ] Retention rate (Day 1, 7, 30)
- [ ] Average revenue per user (ARPU)
- [ ] Ad watch rate
- [ ] IAP conversion rate
- [ ] Average rating
- [ ] Crash-free rate

## 🔄 Update Checklist (For Future Updates)

When releasing updates:

- [ ] Increment versionCode
- [ ] Update versionName
- [ ] Write changelog
- [ ] Test thoroughly
- [ ] Build new AAB
- [ ] Create new release in Play Console
- [ ] Upload AAB
- [ ] Add release notes
- [ ] Submit for review

---

## 📞 Help & Resources

**Documentation:**

- `MOBILE_APP_README.md` - Complete mobile app docs
- `BACKEND_API_REQUIREMENTS.md` - Backend implementation
- `PLAY_STORE_GUIDE.md` - Detailed submission guide
- `TESTING_GUIDE.md` - Testing procedures
- `IMPLEMENTATION_SUMMARY.md` - What was implemented

**External Resources:**

- [Capacitor Docs](https://capacitorjs.com/docs)
- [AdMob Help](https://support.google.com/admob)
- [Play Console Help](https://support.google.com/googleplay/android-developer)

**Tools:**

- [Google Play Console](https://play.google.com/console)
- [AdMob Console](https://apps.admob.com/)
- [Android Studio](https://developer.android.com/studio)

---

## 🎉 Launch Day Checklist

On the day your app goes live:

- [ ] Verify app is live on Play Store
- [ ] Test download and install
- [ ] Test all features on fresh install
- [ ] Announce on social media
- [ ] Email users
- [ ] Update website
- [ ] Monitor for issues
- [ ] Celebrate! 🎊

---

**Created:** December 2025

**Last Updated:** December 2025

**Status:** Ready for Phase 2 (Backend Implementation)

Good luck with your launch! 🚀
