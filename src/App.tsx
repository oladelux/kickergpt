import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SubscriptionRoute } from "@/components/SubscriptionRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Chat from "./pages/Chat";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import History from "./pages/History";
import Plans from "./pages/Plans";
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/next";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Analytics />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/plans"
            element={
              <ProtectedRoute>
                <Plans />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
