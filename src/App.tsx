import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SubscriptionRoute } from "@/components/SubscriptionRoute";
import { LoadingPage } from "@/components/LoadingPage";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const Chat = lazy(() => import("./pages/Chat"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Strategies = lazy(() => import("./pages/Strategies"));
const StrategyMatches = lazy(() => import("./pages/StrategyMatches"));
const Profile = lazy(() => import("./pages/Profile"));
const History = lazy(() => import("./pages/History"));
const Plans = lazy(() => import("./pages/Plans"));
const VerifyPayment = lazy(() => import("./pages/VerifyPayment"));
const PaymentSuccessful = lazy(() => import("./pages/PaymentSuccessful"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ControlRoom = lazy(() => import("./pages/ControlRoom"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
import { Analytics } from "@vercel/analytics/react";
import MetaManager from "@/components/MetaManager";
// import Intercom from "@/components/Intercom";
import HelpBanner from "@/components/HelpBanner";
import AfropariPromoBanner from "@/components/AfropariPromoBanner";
import ls from "@livesession/browser";
import { App as CapacitorApp } from "@capacitor/app";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { isNativeMobile } from "@/lib/platform";
import { adsService } from "@/services/ads.service";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useAuth } from "@/hooks/useAuth";
import { ThemeStatusBarSync } from "@/components/ThemeStatusBarSync";
import VerifyAddonPurchase from "./pages/VerifyAddonPurchase";

ls.init("d955c4e2.3d0acf18");
ls.newPageView();

const queryClient = new QueryClient();

const ExternalRedirect = ({ to }: { to: string }) => {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <p className="text-sm text-muted-foreground">Redirecting...</p>
    </div>
  );
};

const ConfirmEmailRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the current URL search params
    const searchParams = new URLSearchParams(window.location.search);
    const hash = searchParams.get("hash");

    // Redirect to verify-email with the hash
    if (hash) {
      navigate(`/verify-email?hash=${hash}`, { replace: true });
    } else {
      navigate("/verify-email", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <p className="text-sm text-muted-foreground">Verifying...</p>
    </div>
  );
};

const ResetPasswordRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the current URL search params
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token") || searchParams.get("hash");

    // Redirect to reset-password with the token
    if (token) {
      navigate(`/reset-password?token=${token}`, { replace: true });
    } else {
      navigate("/forgot-password", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
};

const AppContent = () => {
  const { user } = useAuth();

  // Force light mode for web only - allow theme switching on native mobile
  useEffect(() => {
    if (!isNativeMobile()) {
      // Web: Force light mode - remove dark class and clear theme storage
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.removeItem("theme");
      localStorage.removeItem("vite-ui-theme");

      const loadingScreen = document.getElementById("loading-screen");
      if (loadingScreen) {
        loadingScreen.style.display = "none";
      }
    } else {
      // Native: Allow theme switching, but ensure loading screen is visible initially
      const loadingScreen = document.getElementById("loading-screen");
      if (loadingScreen) {
        loadingScreen.style.display = "flex";
      }
    }
  }, []);

  // Initialize mobile plugins and add mobile-native class
  useEffect(() => {
    const initializeMobilePlugins = async () => {
      if (isNativeMobile()) {
        try {
          // Add mobile-native class to body for mobile-specific styling
          document.body.classList.add("mobile-native");

          // Configure status bar based on initial theme
          // Wait a bit for theme to be applied from localStorage
          await new Promise((resolve) => setTimeout(resolve, 100));
          const isDark = document.documentElement.classList.contains("dark");
          await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
          await StatusBar.setBackgroundColor({ color: isDark ? "#000000" : "#ffffff" });

          // Hide splash screen after app loads
          await SplashScreen.hide();

          // Hide HTML loading screen
          const loadingScreen = document.getElementById("loading-screen");
          if (loadingScreen) {
            loadingScreen.style.opacity = "0";
            loadingScreen.style.transition = "opacity 0.3s ease-out";
            setTimeout(() => {
              loadingScreen.style.display = "none";
            }, 300);
          }

          // Initialize AdMob
          await adsService.initialize();

          // Handle hardware back button on Android
          CapacitorApp.addListener("backButton", ({ canGoBack }) => {
            if (!canGoBack) {
              CapacitorApp.exitApp();
            } else {
              window.history.back();
            }
          });

          // Handle Universal/App Links for payment verification
          CapacitorApp.addListener("appUrlOpen", (data) => {
            try {
              // Parse Universal/App Link URL (format: https://www.kickergpt.com/verify-payment?reference=xxx)
              const urlString = data.url;
              const url = new URL(urlString);
              const path = url.pathname;
              const params = new URLSearchParams(url.search);

              // Handle payment verification links
              if (path === "/verify-payment" || path === "verify-payment") {
                const reference = params.get("reference");
                if (reference) {
                  // Navigate to verification page with reference
                  window.location.href = `/verify-payment?reference=${encodeURIComponent(reference)}&isNative=true`;
                }
              } else if (path === "/verify-addon-purchase" || path === "verify-addon-purchase") {
                const reference = params.get("reference");
                if (reference) {
                  // Navigate to addon verification page with reference
                  window.location.href = `/verify-addon-purchase?reference=${encodeURIComponent(reference)}&isNative=true`;
                }
              }
            } catch (error) {
              console.error("Error handling Universal/App Link:", error);
            }
          });

          console.log("Mobile plugins initialized successfully");
        } catch (error) {
          console.error("Failed to initialize mobile plugins:", error);
        }
      }
    };

    initializeMobilePlugins();

    // Cleanup
    return () => {
      if (isNativeMobile()) {
        document.body.classList.remove("mobile-native");
        CapacitorApp.removeAllListeners();
      }
    };
  }, []);

  return (
    <>
      <ThemeStatusBarSync />
      <MetaManager />
      {/* <Intercom /> */}
      <HelpBanner />
      <AfropariPromoBanner />
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/password-change" element={<ResetPassword />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/confirm-email" element={<ConfirmEmailRedirect />} />
          <Route path="/confirm-reset-password" element={<ResetPasswordRedirect />} />
          <Route
            path="/plans"
            element={
              <ProtectedRoute>
                <Plans />
              </ProtectedRoute>
            }
          />
          <Route path="/verify-payment" element={<VerifyPayment />} />
          <Route path="/verify-addon-purchase" element={<VerifyAddonPurchase />} />
          <Route path="/payment-successful" element={<PaymentSuccessful />} />
          <Route
            path="/fixtures"
            element={
              <SubscriptionRoute>
                <Chat />
              </SubscriptionRoute>
            }
          />
          <Route path="/chat" element={<Navigate to="/fixtures" replace />} />
          <Route
            path="/favorites"
            element={
              <SubscriptionRoute>
                <Favorites />
              </SubscriptionRoute>
            }
          />
          <Route
            path="/strategies"
            element={
              <SubscriptionRoute>
                <Strategies />
              </SubscriptionRoute>
            }
          />
          <Route
            path="/strategies/:strategyId/matches"
            element={
              <SubscriptionRoute>
                <StrategyMatches />
              </SubscriptionRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <SubscriptionRoute>
                <History />
              </SubscriptionRoute>
            }
          />
          <Route
            path="/control-room"
            element={
              <ProtectedRoute>
                <ControlRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/survey"
            element={<ExternalRedirect to="https://form.typeform.com/to/VVskOTGX" />}
          />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Mobile Bottom Navigation - Only show when authenticated */}
      {isNativeMobile() && user && <MobileBottomNav />}
    </>
  );
};

const App = () => {
  // Allow theme switching on native mobile, force light on web
  const isMobile = isNativeMobile();

  return (
    <HelmetProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        forcedTheme={isMobile ? undefined : "light"}
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Analytics />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
