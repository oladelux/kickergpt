import { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { track } from "@vercel/analytics";

const AFROPARI_URL =
  "https://refpa84423.com/L?tag=d_5072438m_70055c_&site=5072438&ad=70055&r=Registration";
const BANNER_DISMISSED_KEY = "afropari-promo-banner-dismissed";
const JUST_LOGGED_IN_KEY = "just-logged-in";

export default function AfropariPromoBanner() {
  const { user, isAuthenticated } = useAuth();
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

  const handleLinkClick = () => {
    track("signup_afropari");
    handleClose();
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
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="rounded-full bg-primary/10 p-2">
              <Gift className="h-5 w-5 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-semibold">Special Promotion</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4 space-y-4">
          <div className="w-full rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 p-5 text-center shadow-sm">
            <p className="text-sm font-medium text-foreground leading-relaxed">
              Deposit and get{" "}
              <span className="font-bold text-green-600 dark:text-green-400 text-base">300%</span>{" "}
              bonus on Afropari, using the promo code{" "}
              <span className="font-semibold text-primary">KICKERGPT</span>
            </p>
            <Button
              asChild
              className="mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold"
            >
              <a
                href={AFROPARI_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
              >
                Sign up here
              </a>
            </Button>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="do-not-show-again"
              checked={doNotShowAgain}
              onCheckedChange={(checked) => setDoNotShowAgain(checked === true)}
            />
            <Label
              htmlFor="do-not-show-again"
              className="text-sm font-normal cursor-pointer text-muted-foreground"
            >
              Do not show again
            </Label>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/50 bg-muted/30">
          <Button onClick={handleClose} variant="outline" className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
