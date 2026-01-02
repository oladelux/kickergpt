import { useEffect } from "react";
import { useTheme } from "next-themes";
import { StatusBar, Style } from "@capacitor/status-bar";
import { isNativeMobile } from "@/lib/platform";

/**
 * Component that syncs the native StatusBar style with the current theme
 * Only active on native mobile platforms
 */
export function ThemeStatusBarSync() {
  const { theme } = useTheme();
  const isMobile = isNativeMobile();

  useEffect(() => {
    if (!isMobile) return;

    const updateStatusBar = async () => {
      try {
        const isDark = theme === "dark" || document.documentElement.classList.contains("dark");
        await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
        await StatusBar.setBackgroundColor({ color: isDark ? "#000000" : "#ffffff" });
      } catch (error) {
        console.error("Failed to update status bar:", error);
      }
    };

    updateStatusBar();
  }, [theme, isMobile]);

  return null;
}
