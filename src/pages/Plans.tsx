import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, ClientError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useSubscriptionData, SubscriptionPlanName } from "@/hooks/useSubscription";
import { Check, CreditCard, Loader2, Sparkles } from "lucide-react";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { track } from "@vercel/analytics";

type SelectPlanResponse = {
  checkoutUrl?: string | null;
};

type PendingAction = SubscriptionPlanName | "ADD_ON" | null;

const PLAN_OPTIONS = [
  {
    tier: "FREE" as SubscriptionPlanName,
    name: "Free",
    price: "$0",
    cadence: "per month",
    monthlyCredits: 5,
    popular: false,
    features: [
      "Live fixtures dashboard",
      "5 AI prompts every month",
      "Favorites & history sync",
      "Upgrade required before buying add-ons",
    ],
  },
  {
    tier: "PRO" as SubscriptionPlanName,
    name: "Pro",
    price: "$15",
    cadence: "per month",
    monthlyCredits: 100,
    features: [
      "100 AI prompts each month",
      "Buy extra credits whenever you need",
      "Priority chat throughput",
      "Email support from the team",
    ],
    popular: true,
  },
] as const;

const ADD_ON_NOTES = [
  "Each prompt consumes exactly one credit.",
  "Pro users can purchase extra credits any time.",
  "Free users must upgrade to Pro before buying add-ons.",
] as const;

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
  const [geoCountryCode, setGeoCountryCode] = useState<string>("US");
  const [geoLoading, setGeoLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { plan: subscription, usage, loading, error, refreshAll, setError } = useSubscriptionData();

  useEffect(() => {
    const detectCountry = async () => {
      setGeoLoading(true);

      try {
        // Primary: ipapi.co (free, no key needed)
        const response = await fetch("https://ipapi.co/country/", {
          signal: AbortSignal.timeout(3000), // 3 second timeout
        });

        if (response.ok) {
          const countryCode = await response.text();
          const trimmed = countryCode.trim().toUpperCase();
          if (trimmed.length === 2) {
            setGeoCountryCode(trimmed);
            setGeoLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn("Primary geo detection failed:", error);
      }

      try {
        // Fallback: ip-api.com
        const response = await fetch("http://ip-api.com/json/?fields=countryCode", {
          signal: AbortSignal.timeout(3000),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.countryCode) {
            setGeoCountryCode(data.countryCode.toUpperCase());
            setGeoLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn("Fallback geo detection failed:", error);
      }

      // Final fallback: browser locale (less reliable)
      const locale = navigator.languages?.[0] ?? navigator.language;
      const parts = (locale || "").split("-");
      if (parts.length > 1) {
        const region = parts[parts.length - 1]?.toUpperCase();
        if (region && region.length === 2) {
          setGeoCountryCode(region);
        }
      }

      setGeoLoading(false);
    };

    detectCountry();
  }, []);

  const resolvedCountryCode = (geoCountryCode ?? "").toUpperCase();

  const getPricingForCountry = (countryCode: string) => {
    switch (countryCode) {
      case "US":
        return { symbol: "$", pro: "15" };
      case "GB":
      case "UK":
        return { symbol: "£", pro: "15" };
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
        return { symbol: "€", pro: "15" };
      default:
        return { symbol: "$", pro: "15" };
    }
  };

  const getPlanPrice = (tier: SubscriptionPlanName) => {
    const { symbol, pro } = getPricingForCountry(resolvedCountryCode);
    if (tier === "PRO") return `${symbol}${pro}`;
    return `${symbol}0`;
  };

  const handlePlanSelect = async (plan: SubscriptionPlanName) => {
    setPendingAction(plan);
    setActionError(null);
    setError(null);
    track("plan_select_click", { plan });
    try {
      const response = (await api.subscriptions.selectPlan({
        plan,
        countryCode: resolvedCountryCode,
      })) as SelectPlanResponse | null;
      if (response?.checkoutUrl) {
        toast({
          title: "Redirecting to checkout",
          description: "Finish your upgrade in the secure payment window.",
        });
        window.location.href = response.checkoutUrl;
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

  const handleBuyCredits = async () => {
    if ((subscription?.plan ?? "FREE") !== "PRO") {
      toast({
        variant: "destructive",
        title: "Upgrade required",
        description: "Switch to Pro before purchasing extra credits.",
      });
      track("buy_addons_click_blocked_not_pro");
      return;
    }
    track("buy_addons_click");
    setPendingAction("ADD_ON");
    try {
      const response = (await api.subscriptions.selectPlan({
        plan: "PRO",
        countryCode: geoCountryCode,
      })) as SelectPlanResponse | null;
      if (response?.checkoutUrl) {
        toast({
          title: "Redirecting to checkout",
          description: "Complete the add-on purchase to unlock more credits.",
        });
        window.location.href = response.checkoutUrl;
        return;
      }
      toast({
        title: "Add-on request submitted",
        description: "Your credits will update once the payment completes.",
      });
      await refreshAll();
    } catch (err) {
      const message = getErrorMessage(err);
      setActionError(message);
      setError(message);
      toast({
        variant: "destructive",
        title: "Unable to start add-on checkout",
        description: message,
      });
    } finally {
      setPendingAction(null);
    }
  };

  const activePlan: SubscriptionPlanName = subscription?.plan ?? "FREE";
  const planMeta = PLAN_OPTIONS.find((plan) => plan.tier === activePlan) ?? PLAN_OPTIONS[0];
  const monthlyAllowance = usage?.monthlyAllowance ?? planMeta.monthlyCredits;
  const monthlyUsed = usage?.monthlyUsed ?? 0;
  const monthlyRemaining = usage?.monthlyRemaining ?? Math.max(monthlyAllowance - monthlyUsed, 0);
  const addonCredits = usage?.addonCreditsRemaining ?? 0;
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
                <div className="flex flex-col gap-2 rounded-2xl border border-primary/50 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/20 px-4 py-3 text-left shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Sparkles className="h-4 w-4" />
                    Black Friday: 90% off Pro
                  </div>
                  <p className="text-sm text-foreground">
                    Use code <span className="font-mono text-primary">KICKERGPTBLACKFRIDAY</span> at
                    checkout to lock in the Black Friday savings on your Pro subscription.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Apply the code during checkout to redeem.
                  </p>
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
                    {activePlan} · {statusLabel}
                  </span>
                </div>
                <CardTitle className="text-2xl">
                  {planMeta.name} plan — {getPlanPrice(planMeta.tier)} {planMeta.cadence}
                </CardTitle>
                <p className="text-muted-foreground">
                  {monthlyAllowance} prompts refresh every month. Top up whenever you need more
                  runway.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                    <p className="text-sm text-muted-foreground">Monthly allowance</p>
                    <p className="text-2xl font-semibold text-foreground">{monthlyAllowance}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                    <p className="text-sm text-muted-foreground">Used this month</p>
                    <p className="text-2xl font-semibold text-foreground">{monthlyUsed}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                    <p className="text-sm text-muted-foreground">Credits left</p>
                    <p className="text-2xl font-semibold text-foreground">{monthlyRemaining}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                    <p className="text-sm text-muted-foreground">Add-on credits</p>
                    <p className="text-2xl font-semibold text-foreground">{addonCredits}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Renews: {renewalDate}</p>
                <div className="flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
                  <p className="text-sm text-muted-foreground">
                    Need more AI prompts before the reset? Start an add-on checkout—Pro members
                    only.
                  </p>
                  <Button
                    type="button"
                    onClick={handleBuyCredits}
                    disabled={pendingAction === "ADD_ON" || activePlan !== "PRO"}
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  >
                    {pendingAction === "ADD_ON" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirecting…
                      </>
                    ) : activePlan !== "PRO" ? (
                      "Upgrade to buy credits"
                    ) : (
                      "Buy extra credits"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {PLAN_OPTIONS.map((plan) => {
                const isCurrentPlan = plan.tier === activePlan;
                const isLoading = isLoadingPlan(plan.tier);
                return (
                  <Card
                    key={plan.tier}
                    className={`relative border-border/70 bg-card/80 backdrop-blur ${
                      plan.popular ? "shadow-2xl shadow-primary/15 ring-1 ring-primary/20" : ""
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute right-6 top-6 flex items-center gap-1 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30">
                        <Sparkles className="h-3 w-3" />
                        Most popular
                      </Badge>
                    )}
                    {isCurrentPlan && (
                      <Badge className="absolute left-6 top-6 border-primary/40 text-primary">
                        Current plan
                      </Badge>
                    )}
                    <CardHeader className="space-y-1 pt-12">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-semibold">{getPlanPrice(plan.tier)}</span>
                        <span className="text-muted-foreground text-sm">{plan.cadence}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {plan.monthlyCredits} prompts included
                      </p>
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
                        ) : (
                          "Switch to this plan"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border-border/70 bg-card/80 backdrop-blur">
              <CardHeader className="flex flex-col gap-2 text-center md:text-left">
                <div className="flex items-center justify-center gap-2 text-primary md:justify-start">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-[0.4em]">Add-on credits</span>
                </div>
                <CardTitle className="text-2xl">Need more than your monthly bucket?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Trigger an add-on checkout whenever you need more prompts. Credits post
                  immediately after payment so you can keep asking Kickergpt about the next match.
                </p>
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
    </div>
  );
}
