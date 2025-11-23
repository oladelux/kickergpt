import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { track } from "@vercel/analytics";
import { User, Mail, CreditCard, Loader2, RefreshCw, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import { firstValueFrom } from "rxjs";
import { profileService, type ProfileData } from "@/services/profile.service";
import { useSubscriptionData } from "@/hooks/useSubscription";

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const {
    plan: subscription,
    usage,
    loading: subscriptionLoading,
    error: subscriptionError,
    refreshAll: refreshSubscription,
  } = useSubscriptionData();

  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const profileData = await firstValueFrom(profileService.getProfile());
      if (!isMountedRef.current) return;
      setProfile(profileData);
    } catch (err) {
      if (!isMountedRef.current) return;
      setProfileError(
        err instanceof Error ? err.message : "Failed to load your profile. Please try again."
      );
    } finally {
      if (isMountedRef.current) {
        setProfileLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadProfile();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadProfile]);

  const planName =
    subscription?.plan === "PRO"
      ? "Pro plan"
      : subscription?.plan === "FREE"
        ? "Free plan"
        : profile?.planName?.trim() || "Free plan";
  const subscriptionStatusLabel =
    subscription?.status === "ACTIVE"
      ? "Active"
      : subscription?.status === "INACTIVE"
        ? "Inactive"
        : profile?.isActive
          ? "Active"
          : "Inactive";

  const monthlyAllowance = usage?.monthlyAllowance ?? profile?.creditsTotal ?? 0;
  const monthlyUsed = usage?.monthlyUsed ?? profile?.creditsUsed ?? 0;
  const monthlyRemaining = usage?.monthlyRemaining ?? Math.max(monthlyAllowance - monthlyUsed, 0);
  const addonCredits = usage?.addonCreditsRemaining ?? 0;
  const usageDisplay =
    monthlyAllowance > 0 ? `${monthlyUsed} / ${monthlyAllowance}` : `${monthlyUsed} prompts`;
  const usageHelper =
    monthlyAllowance > 0 ? `${monthlyRemaining} prompts remaining` : "Prompts refresh monthly.";
  const usageProgress =
    monthlyAllowance > 0 ? Math.min(100, (monthlyUsed / monthlyAllowance) * 100) : 0;
  const renewalDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : subscription?.plan === "PRO"
      ? "Renews monthly"
      : "Resets monthly";

  const combinedLoading = profileLoading || subscriptionLoading;
  const combinedError = profileError ?? subscriptionError ?? null;

  const handleRefreshAll = useCallback(() => {
    loadProfile();
    refreshSubscription();
  }, [loadProfile, refreshSubscription]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 pb-20 md:pb-4 md:pt-20">
      <TopNav />
      <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Profile
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefreshAll}
            disabled={combinedLoading}
          >
            {combinedLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>

        {combinedLoading ? (
          <StatusMessage
            title="Loading your profile"
            description="Give us a moment while we fetch your details."
          />
        ) : combinedError ? (
          <StatusMessage
            variant="error"
            title="Unable to load profile"
            description={combinedError}
            actionLabel="Try again"
            onAction={handleRefreshAll}
          />
        ) : !profile ? (
          <StatusMessage
            title="No profile data"
            description="We couldn’t find your details. Refresh to try again."
            actionLabel="Refresh"
            onAction={handleRefreshAll}
          />
        ) : (
          <>
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{profile.name || "Unnamed user"}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Mail className="h-3 w-3" />
                      {profile.email || "No email on file"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Prompt Usage This Month
                </CardTitle>
                <CardDescription>Track how many prompts you’ve consumed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Prompts Used</span>
                    <span className="font-medium">{usageDisplay}</span>
                  </div>
                  <Progress value={usageProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{usageHelper}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary">{monthlyUsed}</p>
                    <p className="text-xs text-muted-foreground">Used</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-accent">
                      {monthlyAllowance > 0 ? monthlyRemaining : "∞"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {monthlyAllowance > 0 ? "Remaining" : "Included"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span>Monthly allowance: {monthlyAllowance || "Included"}</span>
                  <span>Add-on credits: {addonCredits}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Subscription
                </CardTitle>
                <CardDescription>Your current plan and billing status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Plan</p>
                    <p className="text-sm text-muted-foreground">{planName}</p>
                    <p className="text-xs text-muted-foreground">Renews: {renewalDate}</p>
                  </div>
                  <Badge variant="default" className="bg-gradient-to-r from-primary to-accent">
                    {subscriptionStatusLabel}
                  </Badge>
                </div>

                <Separator />

                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em]">Plan tier</p>
                    <p className="text-foreground">{subscription?.plan ?? "FREE"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em]">Status</p>
                    <p className="text-foreground">{subscriptionStatusLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em]">Add-on credits</p>
                    <p className="text-foreground">{addonCredits}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    asChild
                    className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    onClick={() => track("manage_plan_click_profile_primary")}
                  >
                    <Link to="/plans">Manage plan</Link>
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={refreshSubscription}>
                    Refresh subscription
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Quick links for common account tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => track("upgrade_click_profile_quicklink")}
                >
                  <Link to="/plans">Upgrade or buy credits</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/forgot-password">Change password</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  Delete account
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

type StatusMessageProps = {
  variant?: "default" | "error";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

function StatusMessage({
  variant = "default",
  title,
  description,
  actionLabel,
  onAction,
}: StatusMessageProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardContent className="py-12 text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {variant === "error" ? (
            <AlertTriangle className="h-6 w-6 text-destructive" />
          ) : (
            <Loader2 className="h-6 w-6 animate-spin" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button variant="default" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
