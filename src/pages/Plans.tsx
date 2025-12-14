import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, ClientError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useSubscriptionData, SubscriptionPlanName } from "@/hooks/useSubscription";
import { Check, CreditCard, Loader2, Sparkles, Zap } from "lucide-react";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { track } from "@vercel/analytics";
import { useGeoCountry } from "@/hooks/useGeoCountry";
import { AddonType, ADDON_PRICING, AddonPurchaseResponse } from "@/types/subscription";

type SelectPlanResponse = {
  checkoutUrl?: string | null;
};

type PendingAction = SubscriptionPlanName | AddonType | null;

const PLAN_OPTIONS = [
  {
    tier: "FREE" as SubscriptionPlanName,
    name: "Free",
    price: "$0",
    cadence: "per month",
    monthlyCredits: 10,
    popular: false,
    features: [
      "Live fixtures dashboard",
      "10 AI prompts every month",
      "Favorites & history sync",
      "Can purchase addon credits anytime",
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
  "All users can purchase extra credits any time.",
  "Addon credits never expire and stack with your monthly allowance.",
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
  const { toast } = useToast();
  const { user } = useAuth();
  const { plan: subscription, usage, loading, error, refreshAll, setError } = useSubscriptionData();
  const { geoLoading, resolvedCountryCode, geoCountryCode } = useGeoCountry();

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

  const handleAddonPurchase = async (addonType: AddonType) => {
    track("buy_addon_click", { addonType });
    setPendingAction(addonType);
    setActionError(null);
    setError(null);
    try {
      const response = (await api.subscriptions.addonPurchase({
        addonType,
      })) as AddonPurchaseResponse | null;
      if (response?.checkoutUrl) {
        toast({
          title: "Redirecting to checkout",
          description: "Complete the addon purchase to unlock more credits.",
        });
        window.location.href = response.checkoutUrl;
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

            <div className="space-y-4">
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-[0.4em]">Add-on credits</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Need more than your monthly bucket?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Purchase extra credits anytime. Credits post immediately after payment so you can
                  keep asking KickerGPT about the next match.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-border/70 bg-card/80 backdrop-blur">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-xl">Starter Pack</CardTitle>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold">
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
                  <Badge className="absolute right-6 top-6 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30">
                    Best Value
                  </Badge>
                  <CardHeader className="space-y-1 pt-12">
                    <CardTitle className="text-xl">Power Pack</CardTitle>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold">
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
                    <CardTitle className="text-xl">Premium Pack</CardTitle>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold">
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
