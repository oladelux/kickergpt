import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface SubscriptionRouteProps {
  children: ReactNode;
}

export const SubscriptionRoute = ({ children }: SubscriptionRouteProps) => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  const loading = authLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
