# Google Play Store Submission Guide

This guide walks you through preparing and submitting your BootRoom Bot Android app to the Google Play Store.

## Prerequisites

- [ ] Google Play Developer account ($25 one-time fee)
- [ ] Android Studio installed
- [ ] App built and tested on physical Android device
- [ ] Backend API endpoints implemented (see BACKEND_API_REQUIREMENTS.md)
- [ ] AdMob account with app registered

---

## Phase 1: Testing the App

### 1.1 Build and Run on Device

```bash
# Build the web app
npm run build

# Sync with Capacitor
npm run cap:sync:android

# Open in Android Studio
npm run cap:open:android
```

In Android Studio:
1. Connect your Android device via USB
2. Enable Developer Mode and USB Debugging on device
3. Click "Run" (green play button)
4. Select your device
5. App should install and launch

### 1.2 Test Checklist

**Authentication:**
- [ ] Sign up with new account
- [ ] Log in with existing account
- [ ] Email verification flow
- [ ] Password reset
- [ ] Log out

**Core Features:**
- [ ] View fixtures dashboard
- [ ] Send chat messages (consume credits)
- [ ] View favorites
- [ ] View history
- [ ] Profile page loads

**Ads (Mobile Only):**
- [ ] Watch Ad button appears on Plans page
- [ ] Ad loads successfully
- [ ] Ad plays to completion
- [ ] Credits granted after ad
- [ ] Cooldown timer works
- [ ] Daily limit enforced

**In-App Purchases (Mobile Only):**
- [ ] Credit packs modal opens
- [ ] Products load from Google Play
- [ ] Purchase flow works (use test account)
- [ ] Credits granted after purchase
- [ ] Restore purchases works

**Edge Cases:**
- [ ] App works offline (shows appropriate errors)
- [ ] Hardware back button works correctly
- [ ] App resumes correctly after backgrounding
- [ ] Deep links work (if applicable)

---

## Phase 2: App Assets & Branding

### 2.1 App Icon

Create app icons in multiple sizes:

**Required Sizes:**
- 512x512 px (Play Store listing)
- 192x192 px (xxxhdpi)
- 144x144 px (xxhdpi)
- 96x96 px (xhdpi)
- 72x72 px (hdpi)
- 48x48 px (mdpi)

**Design Guidelines:**
- Use a simple, recognizable design
- Avoid text (icon should work at small sizes)
- Use your brand colors
- Follow Material Design guidelines
- Consider adaptive icon (foreground + background layers)

**Tools:**
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)
- Figma/Sketch/Adobe XD
- [Canva](https://www.canva.com/)

**Location:**
Place icons in: `android/app/src/main/res/`
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

### 2.2 Feature Graphic

**Size:** 1024 x 500 px

**Purpose:** Displayed at top of Play Store listing

**Design Tips:**
- Showcase key features
- Include app name/logo
- Use high-quality images
- Avoid small text
- Test how it looks on mobile

### 2.3 Screenshots

**Required:** Minimum 2, maximum 8 screenshots

**Sizes:**
- Phone: 1080 x 1920 px (or actual device resolution)
- 7-inch Tablet: 1200 x 1920 px
- 10-inch Tablet: 1600 x 2560 px

**Content Ideas:**
1. Fixtures dashboard with live matches
2. Chat interface with AI analysis
3. Plans page showing subscription options
4. Watch ad for credits feature
5. Favorites/History view
6. Profile/settings page

**Tools:**
- Take screenshots on physical Android device (Power + Volume Down)
- [Screely](https://www.screely.com/) for adding device frames
- [Figma](https://www.figma.com/) for mockups
- Transfer screenshots via USB or Google Photos

### 2.4 Promotional Video (Optional)

**Length:** 30 seconds to 2 minutes

**Content:**
- Show app in action
- Highlight key features
- Include call-to-action
- Add captions (many watch without sound)

---

## Phase 3: Play Store Listing

### 3.1 App Information

**App Name:** BootRoom Bot (max 50 characters)

**Short Description:** (max 80 characters)
```
AI-powered football match analysis. Get instant insights on fixtures, odds, and predictions.
```

**Full Description:** (max 4000 characters)
```
⚽ BootRoom Bot - Your AI Football Analysis Companion

Get instant, AI-powered insights for football matches around the world. Whether you're a casual fan or serious bettor, BootRoom Bot helps you make informed decisions.

🔥 KEY FEATURES

📊 Live Fixtures Dashboard
• View upcoming matches from top leagues worldwide
• Real-time odds and match statistics
• Filter by league, date, and favorites

🤖 AI-Powered Analysis
• Ask questions about any match
• Get detailed predictions and insights
• Analyze team form, head-to-head records, injuries
• Weather conditions, referee stats, and more

💬 Natural Language Chat
• Chat with AI about matches like talking to an expert
• Follow-up questions for deeper analysis
• Save favorite insights for later

⭐ Personalized Experience
• Save favorite teams and matches
• View your analysis history
• Sync across all devices

💎 Flexible Credit System
• Free plan: 10 AI prompts per month
• Pro plan: 100 prompts per month
• Watch ads to earn free credits
• Buy credit packs as needed

📱 Mobile-First Design
• Beautiful, intuitive interface
• Fast and responsive
• Works on phone and tablet

🎯 Perfect For:
• Football fans wanting deeper match insights
• Sports bettors making informed decisions
• Fantasy football players
• Anyone curious about match outcomes

Download BootRoom Bot today and never miss a match insight again!

---

Note: BootRoom Bot provides analysis and insights for entertainment purposes. Always gamble responsibly.
```

**Category:** Sports

**Tags:** football, soccer, AI, match analysis, predictions, sports betting, fixtures

### 3.2 Contact Information

**Email:** support@bootroombot.com (or your support email)

**Website:** https://bootroombot.com (or your website)

**Privacy Policy URL:** (REQUIRED - see section 3.4)

### 3.3 Content Rating

Complete the IARC questionnaire:

1. Go to Play Console → Content rating
2. Answer questions honestly:
   - Does app contain violence? No
   - Does app contain sexual content? No
   - Does app contain profanity? No
   - Does app involve gambling? No (you provide analysis, not gambling)
   - Does app have ads? Yes
   - Does app have in-app purchases? Yes
3. Submit and receive rating

Expected Rating: **Everyone** or **Teen**

### 3.4 Privacy Policy

**REQUIRED** for apps with ads or IAP.

**Must Include:**
- What data you collect (email, usage data, etc.)
- How you use the data
- Third-party services (AdMob, Analytics)
- User rights (access, deletion, etc.)
- Contact information

**Host At:** Your website or use free hosting:
- GitHub Pages
- Google Sites
- Netlify

**Template:** (Customize for your app)
```
Privacy Policy for BootRoom Bot

Last updated: [DATE]

1. Information We Collect
- Account information (email, name)
- Usage data (matches viewed, prompts used)
- Device information (for analytics)

2. How We Use Information
- Provide and improve our service
- Process payments and subscriptions
- Send important updates
- Analyze app usage

3. Third-Party Services
- AdMob (Google) for advertisements
- Vercel Analytics for usage tracking
- LiveSession for support

4. Data Security
We use industry-standard security measures to protect your data.

5. Your Rights
You can request access to or deletion of your data by contacting support@bootroombot.com

6. Children's Privacy
Our app is not intended for children under 13.

7. Changes to Privacy Policy
We may update this policy. Check this page for updates.

8. Contact Us
Email: support@bootroombot.com
```

---

## Phase 4: Configure Google Play Console

### 4.1 Create App Listing

1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in:
   - App name: BootRoom Bot
   - Default language: English (US)
   - App or game: App
   - Free or paid: Free
4. Accept declarations
5. Click "Create app"

### 4.2 Store Listing

1. Go to Store presence → Main store listing
2. Upload:
   - App icon (512x512)
   - Feature graphic (1024x500)
   - Phone screenshots (at least 2)
3. Fill in descriptions (from section 3.1)
4. Select category: Sports
5. Add contact details
6. Save

### 4.3 App Content

Complete all sections:

**Privacy Policy:**
- Add your privacy policy URL

**Ads:**
- Yes, app contains ads

**App Access:**
- All functionality available without restrictions
- (Or provide test credentials if needed)

**Content Rating:**
- Complete questionnaire (see 3.3)

**Target Audience:**
- Age range: 13+ (or appropriate for your app)

**News Apps:**
- Not a news app

**COVID-19 Contact Tracing:**
- Not a contact tracing app

**Data Safety:**
- Complete data safety form:
  - Collects: Email, name, usage data
  - Shares: With analytics providers
  - Security: Data encrypted in transit
  - Can request deletion: Yes

### 4.4 Set Up In-App Products

1. Go to Monetization → In-app products
2. Create three products:

**Product 1:**
- Product ID: `credits_10`
- Name: 10 Credits
- Description: 10 prompt credits for BootRoom Bot
- Price: $2.99 (or equivalent in other currencies)
- Status: Active

**Product 2:**
- Product ID: `credits_50`
- Name: 50 Credits
- Description: 50 prompt credits for BootRoom Bot
- Price: $9.99
- Status: Active

**Product 3:**
- Product ID: `credits_100`
- Name: 100 Credits
- Description: 100 prompt credits for BootRoom Bot
- Price: $17.99
- Status: Active

---

## Phase 5: Build Release APK/AAB

### 5.1 Generate Signing Key

**IMPORTANT:** Keep this key safe! You'll need it for all future updates.

```bash
cd android/app

# Generate keystore
keytool -genkey -v -keystore bootroom-release-key.keystore \
  -alias bootroom-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Follow prompts:
# - Enter keystore password (SAVE THIS!)
# - Enter key password (SAVE THIS!)
# - Enter your name, organization, etc.
```

**Store Keystore Safely:**
- Keep `bootroom-release-key.keystore` in a secure location
- Back up to encrypted cloud storage
- Never commit to Git!

### 5.2 Configure Gradle for Signing

Create `android/key.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=bootroom-key
storeFile=bootroom-release-key.keystore
```

Add to `android/app/build.gradle`:

```gradle
// Add before android { block
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... existing config ...
    
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 5.3 Update App Version

Edit `android/app/build.gradle`:

```gradle
defaultConfig {
    applicationId "com.kickergpt.app"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 1  // Increment for each release
    versionName "1.0.0"  // User-facing version
    // ...
}
```

### 5.4 Build Release Bundle

```bash
# Build web app
npm run build

# Sync with Android
npm run cap:sync:android

# Build release AAB
cd android
./gradlew bundleRelease

# Output will be at:
# android/app/build/outputs/bundle/release/app-release.aab
```

**AAB vs APK:**
- AAB (Android App Bundle) is preferred by Google Play
- Smaller download sizes for users
- Google Play generates optimized APKs

### 5.5 Test Release Build

Before uploading, test the release build:

```bash
# Build release APK for testing
cd android
./gradlew assembleRelease

# Install on device
adb install app/build/outputs/apk/release/app-release.apk
```

Test thoroughly - release builds behave differently than debug builds!

---

## Phase 6: Upload to Play Console

### 6.1 Create Release

1. Go to Play Console → Production
2. Click "Create new release"
3. Upload `app-release.aab`
4. Fill in release notes:

```
Version 1.0.0 - Initial Release

🎉 Welcome to BootRoom Bot!

Features:
• AI-powered football match analysis
• Live fixtures from leagues worldwide
• Watch ads to earn free credits
• Purchase credit packs via Google Play
• Save favorite matches and insights
• View analysis history

We're excited to bring you the best football analysis experience!
```

5. Click "Save" then "Review release"

### 6.2 Internal Testing (Recommended)

Before production release, test with internal testers:

1. Go to Testing → Internal testing
2. Create release
3. Upload AAB
4. Add testers (email addresses)
5. Share testing link with testers
6. Collect feedback
7. Fix any issues
8. Repeat until stable

### 6.3 Production Release

1. Complete all required sections in Play Console
2. Go to Production → Create new release
3. Upload AAB
4. Add release notes
5. Click "Review release"
6. Review all information
7. Click "Start rollout to Production"

**Review Process:**
- Google reviews app (usually 1-3 days)
- You'll receive email when approved
- App goes live on Play Store!

---

## Phase 7: Post-Launch

### 7.1 Monitor Performance

**Play Console Dashboards:**
- Installs and uninstalls
- Ratings and reviews
- Crashes and ANRs
- Revenue (IAP)

**Respond to Reviews:**
- Reply to user feedback
- Address issues quickly
- Thank positive reviewers

### 7.2 Update AdMob IDs

Replace test AdMob IDs with production IDs:

1. Go to [AdMob Console](https://apps.admob.com/)
2. Get your production Ad Unit IDs
3. Update `src/lib/config.ts`:

```typescript
export const ADMOB_CONFIG = {
  APP_ID: {
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX', // Your real app ID
  },
  REWARDED_VIDEO_ID: {
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // Your real ad unit ID
  },
  // ...
};
```

4. Update `android/app/src/main/AndroidManifest.xml`:

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
```

5. Build and release update

### 7.3 Release Updates

For each update:

1. Increment `versionCode` and `versionName`
2. Build new AAB
3. Create new release in Play Console
4. Add release notes describing changes
5. Upload and publish

**Update Frequency:**
- Bug fixes: As needed
- New features: Monthly or quarterly
- Security updates: Immediately

---

## Troubleshooting

### Build Errors

**Error: "Execution failed for task ':app:processReleaseResources'"**
- Check for duplicate resources
- Clean build: `./gradlew clean`

**Error: "Failed to find Build Tools revision"**
- Update Android SDK in Android Studio
- Sync Gradle files

### Upload Errors

**Error: "Upload failed: Version code X has already been used"**
- Increment `versionCode` in `build.gradle`

**Error: "The APK must be signed with the same certificate"**
- Use the same keystore for all releases
- Never lose your keystore!

### Runtime Errors

**Ads not loading:**
- Check AdMob app ID in AndroidManifest.xml
- Verify ad unit IDs in config.ts
- Check device has internet connection
- Wait 1-2 hours after creating ad units

**IAP not working:**
- Verify products are active in Play Console
- Test with licensed test account
- Ensure app is published (IAP doesn't work in draft)

---

## Checklist Before Submission

- [ ] App tested on multiple devices
- [ ] All features work correctly
- [ ] No crashes or major bugs
- [ ] Privacy policy published
- [ ] App icon and graphics ready
- [ ] Screenshots taken
- [ ] Store listing complete
- [ ] Content rating obtained
- [ ] In-app products created
- [ ] Release AAB built and signed
- [ ] Release notes written
- [ ] Backend API endpoints deployed
- [ ] AdMob account configured

---

## Resources

- [Google Play Console](https://play.google.com/console)
- [Android Developer Documentation](https://developer.android.com/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [AdMob Documentation](https://developers.google.com/admob)
- [Material Design Guidelines](https://material.io/design)

---

Good luck with your launch! 🚀

