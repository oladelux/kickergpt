# App Logo & Splash Screen Assets Guide

## 📱 App Logo

### Option 1: Simple PNG Icons (Recommended for Quick Setup)

Place your logo PNG files in these directories with these exact sizes:

**Location:** `android/app/src/main/res/`

#### Required Sizes:

- `mipmap-mdpi/ic_launcher.png` → **48x48 pixels**
- `mipmap-hdpi/ic_launcher.png` → **72x72 pixels**
- `mipmap-xhdpi/ic_launcher.png` → **96x96 pixels**
- `mipmap-xxhdpi/ic_launcher.png` → **144x144 pixels**
- `mipmap-xxxhdpi/ic_launcher.png` → **192x192 pixels**

#### Round Icons (Optional but recommended):

- `mipmap-mdpi/ic_launcher_round.png` → **48x48 pixels**
- `mipmap-hdpi/ic_launcher_round.png` → **72x72 pixels**
- `mipmap-xhdpi/ic_launcher_round.png` → **96x96 pixels**
- `mipmap-xxhdpi/ic_launcher_round.png` → **144x144 pixels**
- `mipmap-xxxhdpi/ic_launcher_round.png` → **192x192 pixels**

**Note:** Round icons are the same as regular icons, but Android will automatically apply a circular mask.

### Option 2: Adaptive Icons (Better for Modern Android)

If you want to use adaptive icons (foreground + background), you'll need:

1. **Foreground image** (your logo, transparent background):
   - `mipmap-mdpi/ic_launcher_foreground.png` → **108x108 pixels** (safe area: 72x72)
   - `mipmap-hdpi/ic_launcher_foreground.png` → **162x162 pixels** (safe area: 108x108)
   - `mipmap-xhdpi/ic_launcher_foreground.png` → **216x216 pixels** (safe area: 144x144)
   - `mipmap-xxhdpi/ic_launcher_foreground.png` → **324x324 pixels** (safe area: 216x216)
   - `mipmap-xxxhdpi/ic_launcher_foreground.png` → **432x432 pixels** (safe area: 288x288)

2. **Background color** (already configured in `values/ic_launcher_background.xml`)

The adaptive icon XML files are already set up in `mipmap-anydpi-v26/`.

### Design Tips:

- **Square format** (Android will handle rounding)
- **Transparent background** (for adaptive icons)
- **Centered logo** with padding (about 10-15% on each side)
- **High contrast** for visibility on various backgrounds
- **Simple design** that works at small sizes

---

## 🎨 Splash Screen

### Option 1: Single Image (Simplest)

Replace the current XML-based splash with your image:

**Location:** `android/app/src/main/res/drawable/`

1. **Delete or rename** `splash.xml` (or keep it as backup)
2. **Add your image** as `splash.png` in these directories:

#### Required Sizes (Portrait):

- `drawable-port-mdpi/splash.png` → **320x480 pixels**
- `drawable-port-hdpi/splash.png` → **480x800 pixels**
- `drawable-port-xhdpi/splash.png` → **720x1280 pixels**
- `drawable-port-xxhdpi/splash.png` → **1080x1920 pixels**
- `drawable-port-xxxhdpi/splash.png` → **1440x2560 pixels**

#### Optional Sizes (Landscape):

- `drawable-land-mdpi/splash.png` → **480x320 pixels**
- `drawable-land-hdpi/splash.png` → **800x480 pixels**
- `drawable-land-xhdpi/splash.png` → **1280x720 pixels**
- `drawable-land-xxhdpi/splash.png` → **1920x1080 pixels**
- `drawable-land-xxxhdpi/splash.png` → **2560x1440 pixels**

**Note:** The splash screen uses `CENTER_CROP` scaling, so your image will be cropped to fit. Design with important content in the center.

### Option 2: Update XML Drawable (Keep Current Structure)

If you want to keep the XML structure but use your image:

1. **Add your splash image** to `drawable/splash_image.png`
2. **Update** `drawable/splash.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Background color -->
    <item>
        <color android:color="#000000" />
    </item>
    <!-- Your splash image centered -->
    <item
        android:drawable="@drawable/splash_image"
        android:gravity="center" />
</layer-list>
```

---

## 🛠️ Tools to Generate Sizes

### App Icon Generators:

1. **Android Asset Studio** (Recommended):
   - https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
   - Upload your logo, it generates all sizes automatically
   - Download and extract to the correct directories

2. **App Icon Generator**:
   - https://www.appicon.co/
   - Upload one image, get all sizes

3. **Icon Kitchen**:
   - https://icon.kitchen/
   - Google's official tool

### Splash Screen Generators:

1. **NextNative** (Recommended - Free):
   - https://nextnative.dev/free-tools/app-icon-splash-generator
   - Upload a single image, generates all required splash screen sizes for Android and iOS
   - Instant generation, supports both icons and splash screens

2. **React Native Pro**:
   - https://www.reactnativepro.com/free-icon-and-splash-generator
   - Generates production-ready icons and splash screens
   - Supports iOS, Android, Windows, and Ionic
   - Includes free Figma template

3. **Utility Hub**:
   - https://utilitytoolshub.com/splash-screen-generator
   - Create professional splash screens with customizable colors, logos, and text
   - Supports Android and iOS

4. **Kloudbean**:
   - https://www.kloudbean.com/splash-screen-generator
   - Create beautiful splash screens for mobile apps and web
   - Adjust titles, colors, logos, and layout options

5. **Hotpot**:
   - https://hotpot.ai/templates/splash-screen
   - Easy-to-use platform with templates
   - Supports iOS, Android, Windows, Unity, and PhoneGap
   - Customize templates or create from scratch

### Command Line (ImageMagick):

If you have ImageMagick installed:

```bash
# Generate app icon sizes from source.png
convert source.png -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert source.png -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert source.png -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert source.png -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert source.png -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Generate splash screen sizes
convert splash_source.png -resize 320x480 android/app/src/main/res/drawable-port-mdpi/splash.png
convert splash_source.png -resize 480x800 android/app/src/main/res/drawable-port-hdpi/splash.png
# ... etc
```

### Using Figma/Sketch:

1. Create artboards at each size
2. Export as PNG
3. Place in correct directories

---

## 📋 Quick Checklist

### App Logo:

- [ ] Create/obtain logo source file (recommended: 1024x1024px)
- [ ] Generate 5 sizes (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- [ ] Place PNG files in `mipmap-*/` directories
- [ ] Test on device to verify appearance

### Splash Screen:

- [ ] Create/obtain splash image (recommended: 1080x1920px for source)
- [ ] Generate portrait sizes (5 sizes minimum)
- [ ] Optionally generate landscape sizes
- [ ] Place PNG files in `drawable-port-*/` directories
- [ ] Test on device to verify appearance

---

## 🧪 Testing After Adding Assets

1. **Clean build:**

   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. **Rebuild web app:**

   ```bash
   npm run build
   ```

3. **Sync with Capacitor:**

   ```bash
   npm run cap:sync:android
   ```

4. **Test on device:**

   ```bash
   npm run cap:run:android
   ```

5. **Verify:**
   - App icon appears correctly in launcher
   - Splash screen displays correctly on app launch
   - No build errors

---

## 💡 Recommendations

1. **Start with a high-resolution source** (1024x1024 for logo, 1080x1920 for splash)
2. **Use Android Asset Studio** for automatic size generation
3. **Test on multiple devices** with different screen densities
4. **Keep source files** in a separate folder for future updates
5. **Use PNG format** (not JPEG) for best quality
6. **Optimize file sizes** (use tools like TinyPNG after generating)

---

## 📁 File Structure Summary

```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48)
│   └── ic_launcher_round.png (48x48)
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72)
│   └── ic_launcher_round.png (72x72)
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96)
│   └── ic_launcher_round.png (96x96)
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144)
│   └── ic_launcher_round.png (144x144)
├── mipmap-xxxhdpi/
│   ├── ic_launcher.png (192x192)
│   └── ic_launcher_round.png (192x192)
├── drawable-port-mdpi/
│   └── splash.png (320x480)
├── drawable-port-hdpi/
│   └── splash.png (480x800)
├── drawable-port-xhdpi/
│   └── splash.png (720x1280)
├── drawable-port-xxhdpi/
│   └── splash.png (1080x1920)
└── drawable-port-xxxhdpi/
    └── splash.png (1440x2560)
```

---

## 📸 App Store Screenshots

### Google Play Store Requirements:

**Minimum Requirements:**

- At least 2 screenshots required (up to 8)
- Portrait orientation: 16:9 or 9:16 aspect ratio
- Minimum dimensions: 320px (shortest side)
- Maximum dimensions: 3840px (longest side)
- File format: PNG or JPEG (24-bit RGB)
- File size: Max 8MB per image

**Recommended Sizes:**

- Phone: 1080x1920px (portrait) or 1920x1080px (landscape)
- Tablet: 1200x1920px (portrait) or 1920x1200px (landscape)

**Best Practices:**

- Show key features and functionality
- Include text overlays highlighting benefits
- Use consistent branding/colors
- First screenshot is most important (shown in search results)
- Show real app content, not mockups

### Apple App Store Requirements:

**iPhone Screenshots:**

- 6.7" Display (iPhone 14 Pro Max, etc.): 1290x2796px
- 6.5" Display (iPhone 11 Pro Max, etc.): 1242x2688px
- 5.5" Display (iPhone 8 Plus, etc.): 1242x2208px

**iPad Screenshots:**

- 12.9" iPad Pro: 2048x2732px
- 11" iPad Pro: 1668x2388px

**Requirements:**

- At least 1 screenshot required (up to 10)
- Must match device type (iPhone/iPad)
- PNG or JPEG format
- No borders or device frames in the image itself

### Screenshot Generator Tools:

1. **Kvick** (Recommended - Free):
   - https://kvick.io
   - Free, no account required
   - Upload screenshots, select device mockups
   - Supports iOS and Android
   - Easy customization

2. **Striking**:
   - https://striking.app
   - No account required
   - Pre-made templates
   - Quick customization
   - High-quality mockups

3. **Appure**:
   - https://appure.io
   - Comprehensive solution
   - Multiple device frames
   - Portrait and landscape support
   - Localization in 26+ languages

4. **DaVinci Apps**:
   - https://www.davinciapps.com
   - Customizable templates
   - Color options
   - Device mockups
   - No design skills needed

5. **LaunchMatic**:
   - https://www.launchmatic.app
   - Pre-made templates
   - All iOS and Android devices
   - Caption translation features
   - Batch generation

### Quick Workflow:

1. **Take Screenshots:**
   - Use Android Studio emulator or physical device
   - Capture key features and screens
   - Ensure high quality and clear content

2. **Choose a Tool:**
   - Start with **Kvick** (free, easy to use)
   - Upload your screenshots
   - Select device mockup (phone/tablet)

3. **Customize:**
   - Add text overlays highlighting features
   - Use your brand colors
   - Add call-to-action text
   - Ensure readability

4. **Export:**
   - Download in required sizes
   - Verify dimensions match requirements
   - Optimize file sizes if needed

### Tips for Great Screenshots:

- **First Screenshot:** Show your app's main value proposition
- **Feature Highlights:** Use text overlays to explain benefits
- **Consistency:** Use same style/colors across all screenshots
- **Real Content:** Show actual app screens, not generic mockups
- **Readability:** Ensure text is large enough to read on small screens
- **Call to Action:** Include compelling text that encourages downloads

### Taking Screenshots from Your App:

**Using Android Studio:**

1. Run your app in emulator
2. Navigate to desired screen
3. Click camera icon in emulator toolbar
4. Save screenshot

**Using Physical Device:**

1. Connect device via USB
2. Enable USB debugging
3. Use `adb shell screencap` command:
   ```bash
   adb shell screencap -p /sdcard/screenshot.png
   adb pull /sdcard/screenshot.png
   ```

**Using Chrome DevTools (for web preview):**

1. Open app in Chrome
2. F12 → Toggle device toolbar
3. Select device size
4. Screenshot using browser tools

---

## ❓ Need Help?

If you have your logo/splash images ready, I can help you:

1. Set up the file structure
2. Update the XML files if needed
3. Test the build after adding assets

Just let me know where your source images are located!
