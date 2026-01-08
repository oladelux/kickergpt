import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { track } from "@vercel/analytics";
import {
  User,
  Mail,
  CreditCard,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Moon,
  Sun,
  Shield,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { isNativeMobile } from "@/lib/platform";
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
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import { firstValueFrom } from "rxjs";
import { profileService, type ProfileData } from "@/services/profile.service";
import { useSubscriptionData } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { useGeoCountry } from "@/hooks/useGeoCountry";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isMountedRef = useRef(true);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const isMobile = isNativeMobile();
  const {
    plan: subscription,
    usage,
    loading: subscriptionLoading,
    error: subscriptionError,
    refreshAll: refreshSubscription,
  } = useSubscriptionData();
  const { resolvedCountryCode } = useGeoCountry();

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

  // Get plan display name
  const getPlanDisplayName = () => {
    if (!subscription) return profile?.planName?.trim() || "Free plan";
    const plan = subscription.plan;
    if (plan === "PRO") return "Pro plan";
    if (plan === "MONTHLY_UNLIMITED") return "Monthly Unlimited plan";
    if (plan === "THREE_DAY_PASS") return "3-Day Pass plan";
    if (plan === "SEVEN_DAY_PASS") return "7-Day Pass plan";
    return "Free plan";
  };

  const planName = getPlanDisplayName();

  // Get plan tier display name (for the "Plan tier" field)
  const getPlanTierDisplayName = () => {
    if (!subscription) return "FREE";
    const plan = subscription.plan;
    if (plan === "PRO") return "PRO";
    if (plan === "MONTHLY_UNLIMITED") return "Monthly Unlimited";
    if (plan === "THREE_DAY_PASS") return "3-Day Pass";
    if (plan === "SEVEN_DAY_PASS") return "7-Day Pass";
    return "FREE";
  };

  const planTierDisplayName = getPlanTierDisplayName();
  const subscriptionStatusLabel =
    subscription?.status === "ACTIVE"
      ? "Active"
      : subscription?.status === "INACTIVE"
        ? "Inactive"
        : profile?.isActive
          ? "Active"
          : "Inactive";

  // Get usage display based on plan and country
  const getUsageDisplay = () => {
    const isNigerian = resolvedCountryCode === "NG";
    const planName = subscription?.plan;
    const monthlyAllowance = usage?.monthlyAllowance ?? profile?.creditsTotal ?? 0;
    const monthlyUsed = usage?.monthlyUsed ?? profile?.creditsUsed ?? 0;
    const monthlyRemaining = usage?.monthlyRemaining ?? Math.max(monthlyAllowance - monthlyUsed, 0);

    // For Nigerian users on Monthly Unlimited or PRO, show unlimited
    if (isNigerian && (planName === "MONTHLY_UNLIMITED" || planName === "PRO")) {
      return {
        monthlyAllowance: Infinity,
        monthlyUsed,
        monthlyRemaining: Infinity,
        isUnlimited: true,
        usageDisplay: `${monthlyUsed} prompts`,
        usageHelper: "Unlimited prompts available",
        usageProgress: 0,
      };
    }

    // For 3-day or 7-day passes (Nigerian), show unlimited
    if (isNigerian && (planName === "THREE_DAY_PASS" || planName === "SEVEN_DAY_PASS")) {
      return {
        monthlyAllowance: Infinity,
        monthlyUsed,
        monthlyRemaining: Infinity,
        isUnlimited: true,
        usageDisplay: `${monthlyUsed} prompts`,
        usageHelper: "Unlimited prompts available",
        usageProgress: 0,
      };
    }

    // For FREE and other plans, show actual numbers
    return {
      monthlyAllowance,
      monthlyUsed,
      monthlyRemaining,
      isUnlimited: false,
      usageDisplay:
        monthlyAllowance > 0 ? `${monthlyUsed} / ${monthlyAllowance}` : `${monthlyUsed} prompts`,
      usageHelper:
        monthlyAllowance > 0 ? `${monthlyRemaining} prompts remaining` : "Prompts refresh monthly.",
      usageProgress:
        monthlyAllowance > 0 ? Math.min(100, (monthlyUsed / monthlyAllowance) * 100) : 0,
    };
  };

  const usageData = getUsageDisplay();
  const monthlyAllowance = usageData.monthlyAllowance;
  const monthlyUsed = usageData.monthlyUsed;
  const monthlyRemaining = usageData.monthlyRemaining;
  const usageDisplay = usageData.usageDisplay;
  const usageHelper = usageData.usageHelper;
  const usageProgress = usageData.usageProgress;
  const adCredits = usage?.adCreditsRemaining ?? 0;
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

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.auth.delete();
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
      await logout();
      window.location.href = "/";
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete account. Please try again.";
      toast({
        variant: "destructive",
        title: "Unable to delete account",
        description: message,
      });
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

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
                  {!usageData.isUnlimited && <Progress value={usageProgress} className="h-2" />}
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
                      {usageData.isUnlimited ? "∞" : monthlyAllowance > 0 ? monthlyRemaining : "∞"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {usageData.isUnlimited
                        ? "Unlimited"
                        : monthlyAllowance > 0
                          ? "Remaining"
                          : "Included"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Monthly allowance:{" "}
                    {usageData.isUnlimited ? "Unlimited" : monthlyAllowance || "Included"}
                  </span>
                  {adCredits > 0 && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Ad credits: +{adCredits} 🎁
                    </span>
                  )}
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
                    <p className="text-foreground">{planTierDisplayName}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em]">Status</p>
                    <p className="text-foreground">{subscriptionStatusLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em]">Credits used</p>
                    <p className="text-foreground">{monthlyUsed}</p>
                  </div>
                  {adCredits > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em]">Ad credits</p>
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        +{adCredits} 🎁
                      </p>
                    </div>
                  )}
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
                {isMobile && (
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50">
                    <div className="flex items-center gap-3">
                      {theme === "dark" ? (
                        <Moon className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Sun className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Dark Mode</span>
                        <span className="text-xs text-muted-foreground">
                          {theme === "dark" ? "Dark theme enabled" : "Light theme enabled"}
                        </span>
                      </div>
                    </div>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => {
                        setTheme(checked ? "dark" : "light");
                      }}
                    />
                  </div>
                )}
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
                <Button asChild variant="outline" className="w-full justify-start">
                  <a
                    href="https://adssettings.google.com/authenticated"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Manage ad preferences
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={async () => {
                    await logout();
                    window.location.href = "/login";
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete account
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <BottomNav />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? This action cannot be undone. All your
              data, including your subscription, prompts, and saved insights will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
