import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  User,
  Mail,
  CreditCard,
  Crown,
  TrendingUp,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import { firstValueFrom } from "rxjs";
import { profileService, type ProfileData } from "@/services/profile.service";

type UsageStats = {
  used: number;
  total: number;
  percentage: number;
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, usageData] = await Promise.all([
        firstValueFrom(profileService.getProfile()),
        firstValueFrom(profileService.getUsage()).catch(() => null),
      ]);

      if (!isMountedRef.current) return;

      setProfile(profileData);
      setUsage(usageData);
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load your profile. Please try again."
      );
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadProfile();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadProfile]);

  const resolvedUsage = useMemo<UsageStats | null>(() => {
    if (usage) return usage;
    if (!profile) return null;

    const used = Math.max(0, profile.creditsUsed ?? 0);
    const total = profile.creditsTotal ?? 0;

    if (!total || total <= 0) {
      return { used, total: 0, percentage: 0 };
    }

    return {
      used,
      total,
      percentage: Math.min(100, (used / total) * 100),
    };
  }, [usage, profile]);

  const planName = profile?.planName?.trim() || "Free plan";
  const subscriptionStatusLabel = profile?.isActive ? "Active" : "Inactive";
  const usageDisplay = resolvedUsage
    ? resolvedUsage.total > 0
      ? `${resolvedUsage.used} / ${resolvedUsage.total}`
      : `${resolvedUsage.used} analyses`
    : "--";
  const usageHelper = resolvedUsage
    ? resolvedUsage.total > 0
      ? `${Math.max(resolvedUsage.total - resolvedUsage.used, 0)} analyses remaining`
      : "Unlimited analyses included"
    : "Usage data unavailable right now.";
  const usageProgress =
    resolvedUsage && resolvedUsage.total > 0 ? resolvedUsage.percentage : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 pb-20 md:pb-4 md:pt-20">
      <TopNav />
      <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Profile
          </h1>
          <Button variant="outline" size="icon" onClick={loadProfile} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>

        {loading ? (
          <StatusMessage
            title="Loading your profile"
            description="Give us a moment while we fetch your details."
          />
        ) : error ? (
          <StatusMessage
            variant="error"
            title="Unable to load profile"
            description={error}
            actionLabel="Try again"
            onAction={loadProfile}
          />
        ) : !profile ? (
          <StatusMessage
            title="No profile data"
            description="We couldn’t find your details. Refresh to try again."
            actionLabel="Refresh"
            onAction={loadProfile}
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

            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Usage This Month
                </CardTitle>
                <CardDescription>Track how many analyses you’ve requested</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Analyses Used</span>
                    <span className="font-medium">{usageDisplay}</span>
                  </div>
                  <Progress value={usageProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{usageHelper}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary">
                      {resolvedUsage?.used ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Used</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-accent">
                      {resolvedUsage && resolvedUsage.total > 0
                        ? Math.max(resolvedUsage.total - resolvedUsage.used, 0)
                        : "∞"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {resolvedUsage && resolvedUsage.total > 0 ? "Remaining" : "Included"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Subscription
                </CardTitle>
                <CardDescription>Manage your subscription plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Plan</p>
                    <p className="text-sm text-muted-foreground">
                      {planName} {resolvedUsage?.total === 0 ? "— Unlimited access" : ""}
                    </p>
                  </div>
                  <Badge variant="default" className="bg-gradient-to-r from-primary to-accent">
                    {subscriptionStatusLabel}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-medium">Premium Features</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Match-specific AI reports
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Tactical and betting insights
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Head-to-head & form breakdowns
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Priority analysis queue
                    </li>
                  </ul>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Update Payment
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Cancel Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Notification Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  Delete Account
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
