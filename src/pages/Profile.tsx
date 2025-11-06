import { useState } from "react";
import { User, Mail, CreditCard, Crown, Settings, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";

export default function Profile() {
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    subscription: "Premium",
    subscriptionStatus: "active",
    creditsUsed: 47,
    creditsTotal: 100,
  });

  const usagePercentage = (user.creditsUsed / user.creditsTotal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Profile
          </h1>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="h-3 w-3" />
                  {user.email}
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
            <CardDescription>Track your AI query usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Queries Used</span>
                <span className="font-medium">
                  {user.creditsUsed} / {user.creditsTotal}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {user.creditsTotal - user.creditsUsed} queries remaining
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">{user.creditsUsed}</p>
                <p className="text-xs text-muted-foreground">Used</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-accent">{user.creditsTotal - user.creditsUsed}</p>
                <p className="text-xs text-muted-foreground">Remaining</p>
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
                  {user.subscription} - Unlimited AI insights
                </p>
              </div>
              <Badge variant="default" className="bg-gradient-to-r from-primary to-accent">
                {user.subscriptionStatus}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-medium">Premium Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Unlimited AI chat messages
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Advanced match predictions
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Real-time tactical insights
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Historical data analysis
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
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
