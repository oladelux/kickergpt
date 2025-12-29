import { useState, useEffect } from "react";
import { Target, Sparkles, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { track } from "@vercel/analytics";

const BANNER_DISMISSED_KEY = "strategies-announcement-banner-dismissed";
const JUST_LOGGED_IN_KEY = "just-logged-in";

const strategyFeatures = [
  "Create custom conditions based on team form, goals, and stats",
  "Automatically find fixtures matching your exact criteria",
  "Save unlimited strategies and get instant match alerts",
];

export default function AfropariPromoBanner() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  useEffect(() => {
    // Only show if:
    // 1. User is authenticated
    // 2. User just logged in (sessionStorage flag is set)
    // 3. Banner hasn't been dismissed (localStorage check)
    if (
      isAuthenticated &&
      user &&
      sessionStorage.getItem(JUST_LOGGED_IN_KEY) === "true" &&
      !localStorage.getItem(BANNER_DISMISSED_KEY)
    ) {
      setIsOpen(true);
      // Clear the "just logged in" flag so it only shows once per login
      sessionStorage.removeItem(JUST_LOGGED_IN_KEY);
    }
  }, [isAuthenticated, user]);

  const handleClose = () => {
    setIsOpen(false);
    // If "do not show again" is checked, save to localStorage
    if (doNotShowAgain) {
      localStorage.setItem(BANNER_DISMISSED_KEY, "true");
    }
  };

  const handleExploreClick = () => {
    track("strategies_announcement_explore_click");
    handleClose();
    navigate("/strategies");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-3 relative">
              <Target className="h-6 w-6 text-primary" />
              <Sparkles className="h-3 w-3 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Introducing Strategies
            </DialogTitle>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">PRO</Badge>
          </div>
          <DialogDescription className="text-center text-base text-muted-foreground">
            Your personal match-finding assistant
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4 space-y-5">
          <div className="w-full rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-lg bg-primary/10 p-2 mt-0.5">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2 text-base">
                  Stop manually searching for matches
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Set your betting criteria once, and let Strategies automatically find fixtures
                  that match your exact requirements. Save hours of research every week.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 mt-4">
              {strategyFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground/90">{feature}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={handleExploreClick}
              className="w-full mt-5 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold shadow-md"
            >
              Explore Strategies
              <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="do-not-show-again"
              checked={doNotShowAgain}
              onCheckedChange={(checked) => setDoNotShowAgain(checked === true)}
            />
            <Label
              htmlFor="do-not-show-again"
              className="text-sm font-normal cursor-pointer text-muted-foreground"
            >
              Don't show this again
            </Label>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/50 bg-muted/30">
          <Button onClick={handleClose} variant="outline" className="w-full sm:w-auto">
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
