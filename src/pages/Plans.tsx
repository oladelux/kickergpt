import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api, ClientError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useSubscriptionData, SubscriptionPlanName } from "@/hooks/useSubscription";
import { Check, CreditCard, Loader2, Sparkles, Zap } from "lucide-react";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { track } from "@vercel/analytics";
import { useGeoCountry } from "@/hooks/useGeoCountry";
import { isNativeMobile } from "@/lib/platform";
import { WatchAdButton } from "@/components/WatchAdButton";
import { Browser } from "@capacitor/browser";
import { App as CapacitorApp } from "@capacitor/app";
import { MobileWrapper } from "@/components/MobileWrapper";
import { MobileHeader } from "@/components/MobileHeader";
import { AddonType, ADDON_PRICING, AddonPurchaseResponse } from "@/types/subscription";
import { PluginListenerHandle } from "@capacitor/core";

type SelectPlanResponse = {
  checkoutUrl?: string | null;
};

type PendingAction = SubscriptionPlanName | AddonType | null;

// Nigeria promo: ₦1,000 for PRO if FREE user exhausted prompts (24hr offer)
const NIGERIA_PROMO_EXPIRY = new Date("2025-12-18T23:59:59Z");
const ADD_ON_NOTES = [
  "Each prompt consumes exactly one credit.",
  "All users can purchase extra credits any time.",
  "Addon credits never expire and stack with your monthly allowance.",
] as const;

type PlanOption = {
  tier: SubscriptionPlanName;
  name: string;
  price: string;
  cadence: string;
  monthlyCredits: number;
  popular?: boolean;
  features: string[];
};

const getPlanOptions = (countryCode: string): PlanOption[] => {
  const isNigeria = countryCode === "NG";

  const freePlan: PlanOption = {
    tier: "FREE" as SubscriptionPlanName,
    name: "Free",
    price: "$0",
    cadence: "per month",
    monthlyCredits: isNigeria ? 3 : 10,
    popular: false,
    features: [
      "Live fixtures dashboard",
      isNigeria ? "3 AI prompts every month" : "10 AI prompts every month",
      "Favorites & history sync",
      "Watch ads for extra prompts (mobile)",
    ],
  };

  if (isNigeria) {
    return [
      freePlan,
      {
        tier: "THREE_DAY_PASS" as SubscriptionPlanName,
        name: "3-Day Pass",
        price: "₦700",
        cadence: "for 3 days",
        monthlyCredits: 999999,
        popular: false,
        features: [
          "Unlimited AI prompts for 3 days",
          "Ad-free experience",
          "Priority chat throughput",
          "Email support from the team",
        ],
      },
      {
        tier: "SEVEN_DAY_PASS" as SubscriptionPlanName,
        name: "7-Day Pass",
        price: "₦1,200",
        cadence: "for 7 days",
        monthlyCredits: 999999,
        popular: false,
        features: [
          "Unlimited AI prompts for 7 days",
          "Ad-free experience",
          "Priority chat throughput",
          "Email support from the team",
        ],
      },
      {
        tier: "MONTHLY_UNLIMITED" as SubscriptionPlanName,
        name: "Monthly Unlimited",
        price: "₦3,000",
        cadence: "per month",
        monthlyCredits: 999999,
        popular: true,
        features: [
          "Unlimited AI prompts each month",
          "AI-powered match predictions",
          "Ad-free experience",
          "Priority chat throughput",
          "Email support from the team",
          "Strategy analysis feature",
        ],
      },
    ];
  }

  return [
    freePlan,
    {
      tier: "PRO" as SubscriptionPlanName,
      name: "Pro",
      price: "$7",
      cadence: "per month",
      monthlyCredits: 100,
      features: [
        "100 AI prompts each month",
        "Ad-free experience",
        "Priority chat throughput",
        "Email support from the team",
      ],
      popular: true,
    },
  ];
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof ClientError) {
    const message =
      (typeof error.responseBody?.message === "string" && error.responseBody.message) || null;
    if (message === "Subscription already active") {
      return "You already have an active Pro subscription.";
    }
    if (message) return message;
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong. Please try again.";
};

export default function Plans() {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlanName | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { plan: subscription, usage, loading, error, refreshAll, setError } = useSubscriptionData();
  const { geoLoading, resolvedCountryCode, geoCountryCode } = useGeoCountry();
  const isMobile = isNativeMobile();

  // Listen for browser close and app state changes to refresh subscription data
  useEffect(() => {
    if (!isNativeMobile()) {
      return; // Only for native apps
    }

    let browserListener: PluginListenerHandle | null = null;
    let appStateListener: PluginListenerHandle | null = null;

    const setupListeners = async () => {
      // Listen for browser finished event (when browser closes)
      browserListener = await Browser.addListener("browserFinished", () => {
        console.log("Browser closed, refreshing subscription data");
        refreshAll();
      });

      // Listen for app state changes (when app comes to foreground)
      appStateListener = await CapacitorApp.addListener("appStateChange", (state) => {
        if (state.isActive) {
          console.log("App came to foreground, refreshing subscription data");
          refreshAll();
        }
      });
    };

    setupListeners();

    // Also refresh when page becomes visible (handles navigation back to Plans)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Plans page became visible, refreshing subscription data");
        refreshAll();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup listeners on unmount
    return () => {
      if (browserListener) {
        browserListener.remove();
      }
      if (appStateListener) {
        appStateListener.remove();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshAll, isMobile]);

  const getPricingForCountry = (countryCode: string) => {
    switch (countryCode) {
      case "US":
        return { symbol: "$", pro: "7" };
      case "GB":
      case "UK":
        return { symbol: "£", pro: "7" };
      case "NG":
        return { symbol: "₦", pro: "10,000" };
      case "DE":
      case "FR":
      case "ES":
      case "IT":
      case "NL":
      case "BE":
      case "AT":
      case "IE":
      case "PT":
      case "FI":
      case "GR":
        return { symbol: "€", pro: "7" };
      default:
        return { symbol: "$", pro: "7" };
    }
  };

  const isNigeriaPromoActive = () => {
    const now = new Date();
    return resolvedCountryCode === "NG" && activePlan === "FREE" && now < NIGERIA_PROMO_EXPIRY;
  };

  const handleAddonPurchase = async (addonType: AddonType) => {
    track("buy_addon_click", { addonType });
    setPendingAction(addonType);
    setActionError(null);
    setError(null);
    try {
      const response = (await api.subscriptions.addonPurchase({
        addonType,
        isNativeUser: isNativeMobile(),
      })) as AddonPurchaseResponse | null;
      if (response?.checkoutUrl) {
        toast({
          title: "Redirecting to checkout",
          description: "Complete the addon purchase to unlock more credits.",
        });
        if (isNativeMobile()) {
          await Browser.open({ url: response.checkoutUrl });
        } else {
          window.location.href = response.checkoutUrl;
        }
        return;
      }
      toast({
        title: "Addon request submitted",
        description: "Your credits will update once the payment completes.",
      });
      await refreshAll();
    } catch (err) {
      const message = getErrorMessage(err);
      setActionError(message);
      setError(message);
      toast({
        variant: "destructive",
        title: "Unable to start addon checkout",
        description: message,
      });
    } finally {
      setPendingAction(null);
    }
  };

  const activePlan: SubscriptionPlanName = subscription?.plan ?? "FREE";

  const getPlanPrice = (tier: SubscriptionPlanName) => {
    // Handle Nigerian plans
    if (tier === "THREE_DAY_PASS") {
      return "₦700";
    }
    if (tier === "SEVEN_DAY_PASS") {
      return "₦1,200";
    }
    if (tier === "MONTHLY_UNLIMITED") {
      return "₦3,000";
    }

    const { symbol, pro } = getPricingForCountry(resolvedCountryCode);
    if (tier === "PRO") {
      // Special Nigeria promo: ₦1,000 for exhausted FREE users
      if (isNigeriaPromoActive()) {
        return "₦1,000";
      }
      return `${symbol}${pro}`;
    }
    return `${symbol}0`;
  };

  const getAddonPrice = (addonType: AddonType) => {
    const addonInfo = ADDON_PRICING[addonType];
    const countryCode = resolvedCountryCode;

    switch (countryCode) {
      case "NG":
        return `₦${addonInfo.priceNGN.toLocaleString()}`;
      case "GB":
      case "UK":
        return `£${addonInfo.priceGBP}`;
      case "DE":
      case "FR":
      case "ES":
      case "IT":
      case "NL":
      case "BE":
      case "AT":
      case "IE":
      case "PT":
      case "FI":
      case "GR":
        return `€${addonInfo.priceEUR}`;
      default:
        return `$${addonInfo.priceUSD}`;
    }
  };

  // Reusable Addon Credits Section Component
  const AddonCreditsSection = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-2 text-primary">
          <CreditCard className="h-4 w-4" />
          <span className="text-xs uppercase tracking-[0.4em]">Add-on credits</span>
        </div>
        <h2
          className={
            isMobile ? "text-2xl font-bold tracking-tight" : "text-3xl font-bold tracking-tight"
          }
        >
          Need more than your monthly bucket?
        </h2>
        <p className={`text-muted-foreground ${isMobile ? "text-sm" : "max-w-2xl mx-auto"}`}>
          Purchase extra credits anytime. Credits post immediately after payment so you can keep
          asking KickerGPT about the next match.
        </p>
      </div>

      <div className={isMobile ? "grid gap-4" : "grid gap-6 md:grid-cols-3"}>
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Starter Pack</CardTitle>
            <div className="flex items-baseline gap-2">
              <span className={isMobile ? "text-2xl font-semibold" : "text-3xl font-semibold"}>
                {getAddonPrice(AddonType.TEN_PROMPT_CREDITS)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">10 extra prompts</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                10 AI prompts
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                Never expires
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                Instant delivery
              </li>
            </ul>
            <Button
              type="button"
              onClick={() => handleAddonPurchase(AddonType.TEN_PROMPT_CREDITS)}
              disabled={pendingAction === AddonType.TEN_PROMPT_CREDITS}
              variant="outline"
              className="w-full"
            >
              {pendingAction === AddonType.TEN_PROMPT_CREDITS ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Buy 10 credits
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80 backdrop-blur shadow-xl shadow-primary/10 ring-1 ring-primary/20 relative">
          <Badge
            className={`absolute ${isMobile ? "right-4 top-4 text-xs" : "right-6 top-6"} bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30`}
          >
            Best Value
          </Badge>
          <CardHeader className={`space-y-1 ${isMobile ? "pt-10" : "pt-12"}`}>
            <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Power Pack</CardTitle>
            <div className="flex items-baseline gap-2">
              <span className={isMobile ? "text-2xl font-semibold" : "text-3xl font-semibold"}>
                {getAddonPrice(AddonType.TWENTY_FIVE_PROMPT_CREDITS)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">25 extra prompts</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                25 AI prompts
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                Never expires
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                Instant delivery
              </li>
            </ul>
            <Button
              type="button"
              onClick={() => handleAddonPurchase(AddonType.TWENTY_FIVE_PROMPT_CREDITS)}
              disabled={pendingAction === AddonType.TWENTY_FIVE_PROMPT_CREDITS}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
            >
              {pendingAction === AddonType.TWENTY_FIVE_PROMPT_CREDITS ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Buy 25 credits
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Premium Pack</CardTitle>
            <div className="flex items-baseline gap-2">
              <span className={isMobile ? "text-2xl font-semibold" : "text-3xl font-semibold"}>
                {getAddonPrice(AddonType.FIFTY_PROMPT_CREDITS)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">50 extra prompts</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                50 AI prompts
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                Never expires
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                Instant delivery
              </li>
            </ul>
            <Button
              type="button"
              onClick={() => handleAddonPurchase(AddonType.FIFTY_PROMPT_CREDITS)}
              disabled={pendingAction === AddonType.FIFTY_PROMPT_CREDITS}
              variant="outline"
              className="w-full"
            >
              {pendingAction === AddonType.FIFTY_PROMPT_CREDITS ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Buy 50 credits
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 bg-card/80 backdrop-blur">
        <CardContent className="pt-6">
          <ul className="space-y-2 text-sm text-foreground/90">
            {ADD_ON_NOTES.map((detail) => (
              <li key={detail} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                {detail}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  const handlePlanSelect = async (plan: SubscriptionPlanName) => {
    // If switching from PRO to FREE, show confirmation dialog first
    if (activePlan === "PRO" && plan === "FREE") {
      setPendingPlan(plan);
      setShowDowngradeDialog(true);
      return;
    }

    await executePlanSelect(plan);
  };

  const executePlanSelect = async (plan: SubscriptionPlanName) => {
    setPendingAction(plan);
    setActionError(null);
    setError(null);
    track("plan_select_click", { plan });
    try {
      // If switching from PRO to FREE, cancel the subscription first
      if (activePlan === "PRO" && plan === "FREE") {
        try {
          await api.subscriptions.cancel();
        } catch (cancelErr) {
          // Log cancel error but continue with plan selection
          console.error("Failed to cancel subscription:", cancelErr);
          // Still proceed with plan selection even if cancel fails
        }
      }

      const response = (await api.subscriptions.selectPlan({
        plan,
        countryCode: resolvedCountryCode,
        isNativeUser: isNativeMobile(),
      })) as SelectPlanResponse | null;
      if (response?.checkoutUrl) {
        toast({
          title: "Redirecting to checkout",
          description: "Finish your upgrade in the secure payment window.",
        });
        if (isNativeMobile()) {
          await Browser.open({ url: response.checkoutUrl });
        } else {
          window.location.href = response.checkoutUrl;
        }
        return;
      }
      await refreshAll();
      toast({ title: "Plan updated", description: `You're now on the ${plan} plan.` });
    } catch (err) {
      const message = getErrorMessage(err);
      setActionError(message);
      setError(message);
      toast({
        variant: "destructive",
        title: "Unable to update plan",
        description: message,
      });
    } finally {
      setPendingAction(null);
    }
  };

  const handleConfirmDowngrade = async () => {
    setShowDowngradeDialog(false);
    if (pendingPlan) {
      await executePlanSelect(pendingPlan);
      setPendingPlan(null);
    }
  };
  const planOptions = getPlanOptions(resolvedCountryCode);
  const planMeta = planOptions.find((plan) => plan.tier === activePlan) ?? planOptions[0];
  const isUnlimitedPlan = usage?.isUnlimited ?? false;
  const monthlyAllowance = usage?.monthlyAllowance ?? planMeta.monthlyCredits;
  const monthlyUsed = usage?.monthlyUsed ?? 0;
  const monthlyRemaining = usage?.monthlyRemaining ?? Math.max(monthlyAllowance - monthlyUsed, 0);
  const addonCredits = usage?.addonCreditsRemaining ?? 0;

  // Nigerian users on unlimited plans should see different display
  const isNigerianUnlimitedUser =
    resolvedCountryCode === "NG" &&
    (activePlan === "THREE_DAY_PASS" ||
      activePlan === "SEVEN_DAY_PASS" ||
      activePlan === "MONTHLY_UNLIMITED");

  // Hide addon credits card for Nigerians with 0 addon credits
  const shouldHideAddonCredits = resolvedCountryCode === "NG" && addonCredits === 0;
  const renewalDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : activePlan === "PRO"
      ? "Renews monthly"
      : "Resets monthly";

  const statusLabel = (subscription?.status ?? "ACTIVE").toLowerCase();

  const isLoadingPlan = (tier: SubscriptionPlanName) => pendingAction === tier;

  const currentPlanBadge = (
    <Badge variant="outline" className="border-primary/40 text-primary">
      Current plan
    </Badge>
  );
  const combinedError = actionError ?? error;

  if (isMobile) {
    return (
      <MobileWrapper>
        <MobileHeader title="Plans" />
        <main className="flex-1 overflow-y-auto px-4 py-6">
          {loading || geoLoading ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="mx-auto max-w-5xl space-y-10">
              {user && (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3 text-sm text-muted-foreground">
                    Signed in as <span className="font-medium text-foreground">{user.email}</span>
                  </div>
                </div>
              )}
              <div className="space-y-4 text-center">
                <Badge
                  variant="outline"
                  className="border-primary/40 text-xs uppercase tracking-[0.4em] text-muted-foreground"
                >
                  Plans
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight text-balance">
                  Manage your KickerGPT plan and credits.
                </h1>
                <p className="mx-auto max-w-3xl text-muted-foreground">
                  Track how many prompts you get each month, upgrade when you need more, and launch
                  checkout to buy extra credits without leaving the console.
                </p>
              </div>

              {combinedError && (
                <div className="rounded-2xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {combinedError}
                </div>
              )}

              <Card className="border-border/70 bg-card/80 backdrop-blur">
                <CardHeader className="flex flex-col gap-2 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                    {currentPlanBadge}
                    <span className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
                      {planMeta.name} · {statusLabel}
                    </span>
                  </div>
                  <CardTitle className="text-2xl">
                    {planMeta.name} plan — {getPlanPrice(planMeta.tier)} {planMeta.cadence}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {isUnlimitedPlan || isNigerianUnlimitedUser
                      ? "Unlimited prompts for the duration of your subscription."
                      : `${planMeta.monthlyCredits} prompts refresh every month. Top up whenever you need more runway.`}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div
                    className={`grid gap-4 ${shouldHideAddonCredits ? "md:grid-cols-3" : "md:grid-cols-4"}`}
                  >
                    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                      <p className="text-sm text-muted-foreground">
                        {isUnlimitedPlan || isNigerianUnlimitedUser
                          ? "Allowance"
                          : "Monthly allowance"}
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {isUnlimitedPlan || isNigerianUnlimitedUser
                          ? "Unlimited"
                          : monthlyAllowance}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                      <p className="text-sm text-muted-foreground">Used this month</p>
                      <p className="text-2xl font-semibold text-foreground">{monthlyUsed}</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                      <p className="text-sm text-muted-foreground">Credits left</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {isNigerianUnlimitedUser ? "Unlimited" : monthlyRemaining}
                      </p>
                    </div>
                    {!shouldHideAddonCredits && (
                      <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                        <p className="text-sm text-muted-foreground">Add-on credits</p>
                        <p className="text-2xl font-semibold text-foreground">{addonCredits}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Renews: {renewalDate}</p>
                </CardContent>
              </Card>

              <div
                className={`grid gap-6 ${resolvedCountryCode === "NG" ? "lg:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-2"}`}
              >
                {planOptions.map((plan) => {
                  const isCurrentPlan = plan.tier === activePlan;
                  const isLoading = isLoadingPlan(plan.tier);
                  return (
                    <Card
                      key={plan.tier}
                      className={`relative border-border/70 bg-card/80 backdrop-blur ${
                        plan.popular ? "shadow-2xl shadow-primary/15 ring-1 ring-primary/20" : ""
                      }`}
                    >
                      {plan.tier === "PRO" && isNigeriaPromoActive() && (
                        <Badge className="absolute right-6 top-6 flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30 animate-pulse">
                          <Sparkles className="h-3 w-3" />
                          24hr Flash Sale! First Month
                        </Badge>
                      )}
                      {plan.popular && !isNigeriaPromoActive() && (
                        <Badge className="absolute right-6 top-6 flex items-center gap-1 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30">
                          <Sparkles className="h-3 w-3" />
                          Most popular
                        </Badge>
                      )}
                      {isCurrentPlan && (
                        <Badge
                          variant="outline"
                          className="absolute left-6 top-6 border-primary/40 text-primary"
                        >
                          Current plan
                        </Badge>
                      )}
                      <CardHeader className="space-y-1 pt-12">
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        <div className="flex items-baseline gap-2">
                          {plan.tier === "PRO" && isNigeriaPromoActive() ? (
                            <>
                              <span className="text-2xl font-semibold text-muted-foreground line-through">
                                ₦10,000
                              </span>
                              <span className="text-4xl font-semibold text-primary">₦1,000</span>
                            </>
                          ) : (
                            <span className="text-4xl font-semibold">
                              {getPlanPrice(plan.tier)}
                            </span>
                          )}
                          <span className="text-muted-foreground text-sm">{plan.cadence}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {plan.tier === "THREE_DAY_PASS" ||
                          plan.tier === "SEVEN_DAY_PASS" ||
                          plan.tier === "MONTHLY_UNLIMITED"
                            ? "Unlimited prompts"
                            : `${plan.monthlyCredits} prompts included`}
                        </p>
                        {plan.tier === "PRO" && isNigeriaPromoActive() && (
                          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                            ₦1,000 first month, then ₦10,000/month
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <ul className="space-y-3 text-sm text-foreground/90">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <Check className="mt-0.5 h-4 w-4 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button
                          type="button"
                          onClick={() => handlePlanSelect(plan.tier)}
                          disabled={isCurrentPlan || isLoading}
                          variant={plan.popular ? "default" : "outline"}
                          className={`w-full ${
                            plan.popular
                              ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                              : ""
                          } ${isCurrentPlan ? "cursor-default opacity-60" : ""}`}
                        >
                          {isCurrentPlan ? (
                            "Current plan"
                          ) : isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : plan.tier === "PRO" && activePlan === "FREE" ? (
                            "Upgrade to Pro"
                          ) : plan.tier === "FREE" && activePlan === "PRO" ? (
                            "Switch to plan"
                          ) : (
                            "Switch to this plan"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Mobile-only: Watch Ads for Free Credits */}
              {isMobile && activePlan === "FREE" && (
                <Card className="border-border/70 bg-card/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Earn Free Credits
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Watch video ads to earn credits for free!
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {usage?.adCreditsRemaining && usage.adCreditsRemaining > 0 && (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
                        <p className="text-foreground">
                          You have{" "}
                          <span className="font-semibold text-primary">
                            {usage.adCreditsRemaining}
                          </span>{" "}
                          ad credits available 🎁
                        </p>
                      </div>
                    )}
                    <WatchAdButton
                      onAdWatched={(credits) => {
                        toast({
                          title: "Credits Earned!",
                          description: `You earned ${credits} credits by watching an ad.`,
                        });
                        refreshAll();
                      }}
                      variant="default"
                      size="lg"
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Add-on Credits Section */}
              {resolvedCountryCode !== "NG" && <AddonCreditsSection isMobile={true} />}

              <div className="text-center text-sm text-muted-foreground">
                Need help with billing?{" "}
                <Link to="/profile" className="text-primary hover:text-accent transition-colors">
                  Contact support from your profile
                </Link>
                .
              </div>
            </div>
          )}
        </main>

        <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Switch to Free Plan?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  Are you sure you want to switch from Pro to Free plan? This will cancel your Pro
                  subscription and you will lose access to:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>
                    100 AI prompts per month (downgrades to{" "}
                    {resolvedCountryCode === "NG" ? "3" : "10"} prompts)
                  </li>
                  <li>Ad-free experience</li>
                  <li>Priority chat throughput</li>
                  <li>Email support from the team</li>
                </ul>
                <p className="pt-2">
                  Your subscription will be cancelled immediately, and you'll be moved to the Free
                  plan.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Pro Plan</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDowngrade}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Switch to Free Plan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </MobileWrapper>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background/95 to-secondary/40 pt-16 pb-16 md:pb-0">
      <TopNav />
      <main className="flex-1 overflow-y-auto px-4 py-6">
        {loading || geoLoading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="mx-auto max-w-5xl space-y-10">
            {user && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3 text-sm text-muted-foreground">
                  Signed in as <span className="font-medium text-foreground">{user.email}</span>
                </div>
              </div>
            )}
            <div className="space-y-4 text-center">
              <Badge
                variant="outline"
                className="border-primary/40 text-xs uppercase tracking-[0.4em] text-muted-foreground"
              >
                Plans
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-balance">
                Manage your KickerGPT plan and credits.
              </h1>
              <p className="mx-auto max-w-3xl text-muted-foreground">
                Track how many prompts you get each month, upgrade when you need more, and launch
                checkout to buy extra credits without leaving the console.
              </p>
            </div>

            {combinedError && (
              <div className="rounded-2xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {combinedError}
              </div>
            )}

            <Card className="border-border/70 bg-card/80 backdrop-blur">
              <CardHeader className="flex flex-col gap-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                  {currentPlanBadge}
                  <span className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
                    {planMeta.name} · {statusLabel}
                  </span>
                </div>
                <CardTitle className="text-2xl">
                  {planMeta.name} plan — {getPlanPrice(planMeta.tier)} {planMeta.cadence}
                </CardTitle>
                <p className="text-muted-foreground">
                  {isUnlimitedPlan || isNigerianUnlimitedUser
                    ? "Unlimited prompts for the duration of your subscription."
                    : `${planMeta.monthlyCredits} prompts refresh every month. Top up whenever you need more runway.`}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className={`grid gap-4 ${shouldHideAddonCredits ? "md:grid-cols-3" : "md:grid-cols-4"}`}
                >
                  <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                    <p className="text-sm text-muted-foreground">
                      {isUnlimitedPlan || isNigerianUnlimitedUser
                        ? "Allowance"
                        : "Monthly allowance"}
                    </p>
                    <p className="text-2xl font-semibold text-foreground">
                      {isUnlimitedPlan || isNigerianUnlimitedUser ? "Unlimited" : monthlyAllowance}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                    <p className="text-sm text-muted-foreground">Used this month</p>
                    <p className="text-2xl font-semibold text-foreground">{monthlyUsed}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                    <p className="text-sm text-muted-foreground">Credits left</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {isNigerianUnlimitedUser ? "Unlimited" : monthlyRemaining}
                    </p>
                  </div>
                  {!shouldHideAddonCredits && (
                    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                      <p className="text-sm text-muted-foreground">Add-on credits</p>
                      <p className="text-2xl font-semibold text-foreground">{addonCredits}</p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Renews: {renewalDate}</p>
              </CardContent>
            </Card>

            <div
              className={`grid gap-6 ${resolvedCountryCode === "NG" ? "lg:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-2"}`}
            >
              {planOptions.map((plan) => {
                const isCurrentPlan = plan.tier === activePlan;
                const isLoading = isLoadingPlan(plan.tier);
                return (
                  <Card
                    key={plan.tier}
                    className={`relative border-border/70 bg-card/80 backdrop-blur ${
                      plan.popular ? "shadow-2xl shadow-primary/15 ring-1 ring-primary/20" : ""
                    }`}
                  >
                    {plan.tier === "PRO" && isNigeriaPromoActive() && (
                      <Badge className="absolute right-6 top-6 flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30 animate-pulse">
                        <Sparkles className="h-3 w-3" />
                        24hr Flash Sale! First Month
                      </Badge>
                    )}
                    {plan.popular && !isNigeriaPromoActive() && (
                      <Badge className="absolute right-6 top-6 flex items-center gap-1 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30">
                        <Sparkles className="h-3 w-3" />
                        Most popular
                      </Badge>
                    )}
                    {isCurrentPlan && (
                      <Badge
                        variant="outline"
                        className="absolute left-6 top-6 border-primary/40 text-primary"
                      >
                        Current plan
                      </Badge>
                    )}
                    <CardHeader className="space-y-1 pt-12">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">{getPlanPrice(plan.tier)}</span>
                        <span className="text-muted-foreground">{plan.cadence}</span>
                      </div>
                      {plan.tier === "PRO" && isNigeriaPromoActive() && (
                        <p className="text-sm text-orange-600 dark:text-orange-400">
                          First month only ₦10,000! Regular price: ₦{getPlanPrice("PRO")}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          {plan.tier === "THREE_DAY_PASS" ||
                          plan.tier === "SEVEN_DAY_PASS" ||
                          plan.tier === "MONTHLY_UNLIMITED"
                            ? "Unlimited prompts"
                            : `${plan.monthlyCredits} monthly prompts`}
                        </div>
                        <ul className="space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex gap-2 text-sm">
                              <Check className="h-5 w-5 shrink-0 text-primary" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        onClick={() => handlePlanSelect(plan.tier)}
                        disabled={isLoading || isCurrentPlan}
                        size="lg"
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {isCurrentPlan ? "Managing..." : "Processing..."}
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            {isCurrentPlan
                              ? "Current plan"
                              : plan.tier === "FREE" && activePlan === "PRO"
                                ? "Switch to plan"
                                : plan.tier === "FREE"
                                  ? "Switch to plan"
                                  : "Upgrade now"}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {resolvedCountryCode !== "NG" && <AddonCreditsSection isMobile={false} />}

            {isMobile && activePlan === "FREE" && (
              <Card className="border-border/70 bg-card/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Earn Free Credits
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Watch video ads to earn credits for free!
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {usage?.adCreditsRemaining && usage.adCreditsRemaining > 0 && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
                      <p className="text-foreground">
                        You have{" "}
                        <span className="font-semibold text-primary">
                          {usage.adCreditsRemaining}
                        </span>{" "}
                        ad credits available 🎁
                      </p>
                    </div>
                  )}
                  <WatchAdButton
                    onAdWatched={(credits) => {
                      toast({
                        title: "Credits Earned!",
                        description: `You earned ${credits} credits by watching an ad.`,
                      });
                      refreshAll();
                    }}
                    variant="default"
                    size="lg"
                    className="w-full"
                  />
                </CardContent>
              </Card>
            )}

            <div className="text-center text-sm text-muted-foreground">
              Need help with billing?{" "}
              <Link to="/profile" className="text-primary hover:text-accent transition-colors">
                Contact support from your profile
              </Link>
              .
            </div>
          </div>
        )}
      </main>
      <BottomNav />

      <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch to Free Plan?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to switch from Pro to Free plan? This will cancel your Pro
                subscription and you will lose access to:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  100 AI prompts per month (downgrades to{" "}
                  {resolvedCountryCode === "NG" ? "3" : "10"} prompts)
                </li>
                <li>Ad-free experience</li>
                <li>Priority chat throughput</li>
                <li>Email support from the team</li>
              </ul>
              <p className="pt-2">
                Your subscription will be cancelled immediately, and you'll be moved to the Free
                plan.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Pro Plan</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDowngrade}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Switch to Free Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
