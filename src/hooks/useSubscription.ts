import { useCallback, useEffect, useState } from "react";
import { api, ClientError, ApiError } from "@/lib/api";

export type SubscriptionPlanName = "FREE" | "PRO";
export type SubscriptionStatus = "ACTIVE" | "INACTIVE";

export type SubscriptionRecord = {
  plan: SubscriptionPlanName;
  status: SubscriptionStatus;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  currentPeriodEnd?: string | null;
};

export type SubscriptionUsage = {
  monthlyAllowance: number;
  monthlyUsed: number;
  monthlyRemaining: number;
  adCreditsRemaining?: number;
  purchasedCreditsRemaining?: number;
  addonCreditsRemaining?: number;
  totalCreditsRemaining: number;
};

const parseErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    if (error.status >= 500) {
      return "We're having trouble loading your subscription right now. Please try again.";
    }
    return "Unable to fetch subscription info. Please try again.";
  }
  if (error instanceof ClientError) {
    const message =
      typeof error.responseBody?.message === "string" ? error.responseBody.message : "";
    return message || "Unable to fetch subscription info.";
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unable to fetch subscription info.";
};

export const useSubscriptionData = () => {
  const [plan, setPlan] = useState<SubscriptionRecord | null>(null);
  const [usage, setUsage] = useState<SubscriptionUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    try {
      const data = await api.subscriptions.getCurrent();
      setPlan(data);
      return data;
    } catch (err) {
      setError(parseErrorMessage(err));
      throw err;
    }
  }, []);

  const fetchUsage = useCallback(async () => {
    try {
      const data = await api.subscriptions.getUsage();
      setUsage(data);
      return data;
    } catch (err) {
      setError(parseErrorMessage(err));
      throw err;
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.allSettled([fetchPlan(), fetchUsage()]);
    } finally {
      setLoading(false);
    }
  }, [fetchPlan, fetchUsage]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return {
    plan,
    usage,
    loading,
    error,
    refreshAll,
    refreshPlan: fetchPlan,
    refreshUsage: fetchUsage,
    setError,
  };
};
