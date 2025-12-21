# Testing Guide for BootRoom Bot Mobile App

This guide provides comprehensive testing procedures for the mobile app before Play Store submission.

## Setup for Testing

### 1. Build and Install

```bash
# Terminal 1: Build web app
npm run build

# Terminal 2: Sync with Capacitor
npm run cap:sync:android

# Terminal 3: Open Android Studio
npm run cap:open:android
```

In Android Studio:
- Connect Android device via USB
- Enable Developer Mode on device
- Enable USB Debugging
- Click Run (green play button)
- Select your device

### 2. Test Accounts

Create test accounts for different scenarios:

**Account 1: New Free User**
- Email: test-free@example.com
- No subscription
- 10 monthly credits

**Account 2: Pro User**
- Email: test-pro@example.com
- Pro subscription
- 100 monthly credits

**Account 3: Exhausted Credits**
- Email: test-exhausted@example.com
- Free plan, 0 credits remaining
- Test ad watching and IAP

---

## Test Scenarios

### Scenario 1: First-Time User Flow

**Objective:** Test complete onboarding experience

**Steps:**
1. Launch app for first time
2. Splash screen displays
3. Land on Index/Welcome page
4. Click "Sign Up"
5. Fill in registration form
6. Submit registration
7. Check email for verification link
8. Click verification link
9. Return to app and log in
10. View fixtures dashboard
11. Navigate to Plans page
12. See subscription options

**Expected Results:**
- [ ] Splash screen shows for 2 seconds
- [ ] Welcome page loads correctly
- [ ] Sign up form validates inputs
- [ ] Verification email received
- [ ] Email verification succeeds
- [ ] Login successful after verification
- [ ] Fixtures load correctly
- [ ] Plans page shows Free and Pro options
- [ ] Mobile-only sections visible (Watch Ad, Native IAP)

---

### Scenario 2: Authentication Flow

**Objective:** Test all auth-related features

**Test Cases:**

**2.1 Sign Up**
- [ ] Valid email and password accepted
- [ ] Weak password rejected
- [ ] Duplicate email rejected
- [ ] Form validation works
- [ ] Success message shown
- [ ] Redirected to email verification page

**2.2 Login**
- [ ] Valid credentials accepted
- [ ] Invalid credentials rejected
- [ ] "Remember me" works (if implemented)
- [ ] Redirected to fixtures after login
- [ ] User data loads correctly

**2.3 Email Verification**
- [ ] Verification email received
- [ ] Verification link works
- [ ] Already verified shows appropriate message
- [ ] Resend verification works

**2.4 Password Reset**
- [ ] Reset email sent
- [ ] Reset link works
- [ ] New password accepted
- [ ] Can log in with new password

**2.5 Logout**
- [ ] Logout button works
- [ ] User data cleared
- [ ] Redirected to login page
- [ ] Cannot access protected routes after logout

---

### Scenario 3: Core App Features

**Objective:** Test main functionality

**3.1 Fixtures Dashboard**
- [ ] Fixtures load on app launch
- [ ] Fixtures display correctly (teams, time, league)
- [ ] Can scroll through fixtures
- [ ] Fixtures grouped by date
- [ ] Loading state shows while fetching
- [ ] Error state shows if fetch fails
- [ ] Pull to refresh works (if implemented)

**3.2 Chat/Analysis**
- [ ] Can select a fixture
- [ ] Chat interface opens
- [ ] Can type message
- [ ] Send button enabled when message entered
- [ ] Message sends successfully
- [ ] AI response received
- [ ] Response displays correctly
- [ ] Credits deducted after message
- [ ] Follow-up suggestions shown
- [ ] Can ask follow-up questions

**3.3 Favorites**
- [ ] Can add fixture to favorites
- [ ] Favorite icon updates
- [ ] Favorites page shows saved fixtures
- [ ] Can remove from favorites
- [ ] Favorites persist after app restart

**3.4 History**
- [ ] History page shows past analyses
- [ ] Can view past conversation
- [ ] Can delete history item
- [ ] History persists after app restart

**3.5 Profile**
- [ ] Profile page loads user data
- [ ] Can update name
- [ ] Can update email
- [ ] Changes saved successfully
- [ ] Logout button works

---

### Scenario 4: Subscription & Credits

**Objective:** Test credit system and subscriptions

**4.1 Credit Display**
- [ ] Credit balance shown on Plans page
- [ ] Credit types displayed:
  - Monthly allowance
  - Addon credits
  - Ad credits
  - Purchased credits
  - Total credits
- [ ] Credits update after consumption
- [ ] Credits update after earning/purchasing

**4.2 Free Plan**
- [ ] Shows 10 monthly credits
- [ ] Credits reset monthly
- [ ] Can use all 10 credits
- [ ] Blocked when credits exhausted
- [ ] Prompted to upgrade or buy credits

**4.3 Pro Plan (Web)**
- [ ] Can select Pro plan
- [ ] Redirected to Stripe checkout
- [ ] Payment processed (use test card)
- [ ] Subscription activated
- [ ] 100 monthly credits granted
- [ ] Plan status shows "Pro"

**4.4 Addon Credits (Web)**
- [ ] Can purchase addon credits
- [ ] Redirected to Stripe checkout
- [ ] Payment processed
- [ ] Credits added to account
- [ ] Addon credits don't expire

---

### Scenario 5: Watch Ads (Mobile Only)

**Objective:** Test rewarded video ads

**5.1 Ad Availability**
- [ ] "Watch Ad" button visible on mobile
- [ ] Button hidden on web
- [ ] Button shows correct state (ready/loading/cooldown)
- [ ] Daily limit displayed

**5.2 Watch Ad Flow**
- [ ] Click "Watch Ad for Credits"
- [ ] Ad loads (may take a few seconds)
- [ ] Ad plays full screen
- [ ] Can close ad after completion
- [ ] Cannot skip ad early
- [ ] Credits granted after watching
- [ ] Success toast shown
- [ ] Credit balance updates

**5.3 Ad Cooldown**
- [ ] Button disabled after watching ad
- [ ] Cooldown timer shown (5 minutes)
- [ ] Button re-enables after cooldown
- [ ] Cooldown persists after app restart

**5.4 Daily Limit**
- [ ] Can watch up to 20 ads per day
- [ ] Counter shows remaining ads
- [ ] Button disabled when limit reached
- [ ] Limit resets at midnight
- [ ] Appropriate message shown when limited

**5.5 Ad Errors**
- [ ] Error shown if ad fails to load
- [ ] Can retry after error
- [ ] No credits granted if ad fails
- [ ] Graceful error handling

---

### Scenario 6: In-App Purchases (Mobile Only)

**Objective:** Test Google Play IAP

**6.1 Product Loading**
- [ ] "View Credit Packs" button visible on mobile
- [ ] Button hidden on web
- [ ] Click opens modal
- [ ] Products load from Google Play
- [ ] Prices shown in local currency
- [ ] Product details displayed correctly

**6.2 Purchase Flow**
- [ ] Click "Buy Now" on a product
- [ ] Google Play purchase dialog opens
- [ ] Can complete purchase (use test account)
- [ ] Purchase confirmation shown
- [ ] Credits added to account immediately
- [ ] Success toast shown
- [ ] Modal closes after purchase

**6.3 Purchase Cancellation**
- [ ] Can cancel purchase dialog
- [ ] No credits granted
- [ ] No error shown
- [ ] Can try again

**6.4 Purchase Errors**
- [ ] Error shown if purchase fails
- [ ] Appropriate error message
- [ ] Can retry after error
- [ ] No credits granted on error

**6.5 Restore Purchases**
- [ ] "Restore Purchases" button works
- [ ] Previous purchases restored
- [ ] Credits added if missing
- [ ] Success message shown

---

### Scenario 7: Platform-Specific Features

**Objective:** Test mobile-specific functionality

**7.1 Hardware Back Button (Android)**
- [ ] Back button navigates to previous page
- [ ] Back button exits app from home page
- [ ] Back button closes modals
- [ ] No unexpected behavior

**7.2 App Lifecycle**
- [ ] App resumes correctly after backgrounding
- [ ] State preserved when returning to app
- [ ] No data loss when app backgrounded
- [ ] Timers/countdowns resume correctly

**7.3 Permissions**
- [ ] Internet permission works
- [ ] Network state permission works
- [ ] Ad ID permission works (for ads)
- [ ] No unnecessary permissions requested

**7.4 Deep Links (if implemented)**
- [ ] Deep links open correct page
- [ ] Authentication required for protected pages
- [ ] Invalid links handled gracefully

---

### Scenario 8: Edge Cases & Error Handling

**Objective:** Test app robustness

**8.1 Network Errors**
- [ ] Offline: Appropriate error shown
- [ ] Slow connection: Loading state shown
- [ ] Network error: Retry option available
- [ ] Timeout: Error message shown

**8.2 Invalid Data**
- [ ] Empty responses handled
- [ ] Malformed data doesn't crash app
- [ ] Missing fields handled gracefully

**8.3 Session Expiry**
- [ ] Expired token detected
- [ ] User logged out automatically
- [ ] Redirected to login
- [ ] Can log back in

**8.4 Low Credits**
- [ ] Warning shown when credits low
- [ ] Blocked when credits exhausted
- [ ] Prompted to earn/buy credits
- [ ] Clear messaging

**8.5 App Updates**
- [ ] App version displayed
- [ ] Update prompt shown (if new version)
- [ ] Can continue using old version
- [ ] Data migrates correctly after update

---

### Scenario 9: Performance & UX

**Objective:** Test app performance and user experience

**9.1 Load Times**
- [ ] App launches in < 3 seconds
- [ ] Fixtures load in < 2 seconds
- [ ] Chat responses in < 5 seconds
- [ ] Navigation feels instant
- [ ] No janky animations

**9.2 Memory Usage**
- [ ] App doesn't consume excessive memory
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] No crashes after extended use

**9.3 Battery Usage**
- [ ] App doesn't drain battery quickly
- [ ] Background usage minimal
- [ ] No unnecessary wake locks

**9.4 UI/UX**
- [ ] All text readable
- [ ] Buttons large enough to tap
- [ ] Forms easy to fill
- [ ] Error messages clear
- [ ] Success feedback obvious
- [ ] Loading states shown
- [ ] Consistent design throughout

---

### Scenario 10: Security & Privacy

**Objective:** Test security measures

**10.1 Authentication Security**
- [ ] Passwords not visible when typing
- [ ] Tokens stored securely
- [ ] Session expires after inactivity
- [ ] Cannot access protected routes without auth

**10.2 Data Privacy**
- [ ] User data not exposed in logs
- [ ] API calls use HTTPS
- [ ] Sensitive data encrypted
- [ ] No data leaked to third parties

**10.3 Payment Security**
- [ ] IAP uses Google Play (secure)
- [ ] No credit card data stored locally
- [ ] Purchase receipts verified server-side

---

## Device Testing Matrix

Test on multiple devices and Android versions:

| Device | Android Version | Screen Size | Test Status |
|--------|----------------|-------------|-------------|
| Pixel 6 | Android 13 | 6.4" | [ ] |
| Samsung Galaxy S21 | Android 12 | 6.2" | [ ] |
| OnePlus 9 | Android 11 | 6.55" | [ ] |
| Xiaomi Redmi Note 10 | Android 11 | 6.43" | [ ] |
| Budget Phone | Android 10 | 5.5" | [ ] |
| Tablet | Android 12 | 10.1" | [ ] |

**Minimum:** Test on at least 3 different devices with different Android versions.

---

## Automated Testing (Optional)

### Unit Tests

```bash
# Run unit tests
npm test
```

Test coverage for:
- Utility functions (platform.ts, config.ts)
- Service methods (ads.service.ts, iap.service.ts)
- Hooks (useAds.ts, useIAP.ts)

### E2E Tests (Detox/Appium)

```bash
# Setup Detox
npm install --save-dev detox

# Run E2E tests
detox test
```

Test critical flows:
- Login → View fixtures → Send message
- Watch ad → Earn credits
- Purchase credits → Credits added

---

## Bug Reporting Template

When you find a bug, document it:

```
**Bug Title:** [Short description]

**Severity:** Critical / High / Medium / Low

**Device:** [Device model and Android version]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[Attach screenshots if applicable]

**Logs:**
[Attach relevant logs from logcat]
```

---

## Pre-Submission Checklist

Before uploading to Play Store:

**Functionality:**
- [ ] All features work as expected
- [ ] No critical bugs
- [ ] Tested on multiple devices
- [ ] Tested on multiple Android versions
- [ ] Ads load and grant credits
- [ ] IAP works correctly
- [ ] Backend API endpoints working

**Performance:**
- [ ] App launches quickly
- [ ] No crashes
- [ ] No ANRs (App Not Responding)
- [ ] Smooth scrolling
- [ ] Efficient battery usage

**UI/UX:**
- [ ] All text readable
- [ ] No layout issues
- [ ] Consistent design
- [ ] Proper error messages
- [ ] Loading states shown

**Security:**
- [ ] HTTPS for all API calls
- [ ] Tokens stored securely
- [ ] No sensitive data in logs
- [ ] Permissions justified

**Compliance:**
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] GDPR compliant (if applicable)
- [ ] COPPA compliant (if applicable)
- [ ] Ad content appropriate

**Production Config:**
- [ ] Production API URL set
- [ ] Production AdMob IDs set
- [ ] Debug logging disabled
- [ ] Test code removed

---

## Testing Tools

**Android Studio:**
- Logcat for debugging
- Layout Inspector for UI issues
- Profiler for performance

**Chrome DevTools:**
- Inspect WebView
- Debug JavaScript
- Monitor network requests

**ADB Commands:**
```bash
# View logs
adb logcat

# Clear app data
adb shell pm clear com.kickergpt.app

# Uninstall app
adb uninstall com.kickergpt.app

# Install APK
adb install app-release.apk

# Take screenshot
adb shell screencap /sdcard/screenshot.png
adb pull /sdcard/screenshot.png
```

---

## Common Issues & Solutions

**Issue:** Ads not loading
**Solution:** 
- Wait 1-2 hours after creating ad units
- Check AdMob app ID in AndroidManifest.xml
- Verify device has internet connection

**Issue:** IAP not working
**Solution:**
- Ensure app is published (IAP doesn't work in draft)
- Use licensed test account
- Check product IDs match exactly

**Issue:** App crashes on startup
**Solution:**
- Check logcat for errors
- Verify all plugins initialized correctly
- Check for missing permissions

**Issue:** Credits not updating
**Solution:**
- Verify backend API is working
- Check network requests in DevTools
- Ensure token is valid

---

## Sign-Off

After completing all tests:

**Tested By:** _________________

**Date:** _________________

**Devices Tested:** _________________

**Critical Bugs Found:** _________________

**Status:** Ready for Production / Needs Fixes

**Notes:**
_________________________________
_________________________________
_________________________________

---

Happy Testing! 🧪

