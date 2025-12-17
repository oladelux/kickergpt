import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SubscriptionRoute } from "@/components/SubscriptionRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import EmailVerification from "./pages/EmailVerification";
import Chat from "./pages/Chat";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import History from "./pages/History";
import Plans from "./pages/Plans";
import VerifyPayment from "./pages/VerifyPayment";
import VerifyAddonPurchase from "./pages/VerifyAddonPurchase";
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/react";
import MetaManager from "@/components/MetaManager";
// import Intercom from "@/components/Intercom";
import HelpBanner from "@/components/HelpBanner";
import ControlRoom from "./pages/ControlRoom";
import ls from "@livesession/browser";

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

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Analytics />
          <BrowserRouter>
            <MetaManager />
            {/* <Intercom /> */}
            <HelpBanner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/confirm-email" element={<ConfirmEmailRedirect />} />
              <Route
                path="/plans"
                element={
                  <ProtectedRoute>
                    <Plans />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/verify-payment"
                element={
                  <ProtectedRoute>
                    <VerifyPayment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/verify-addon-purchase"
                element={
                  <ProtectedRoute>
                    <VerifyAddonPurchase />
                  </ProtectedRoute>
                }
              />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
