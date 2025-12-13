import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const HELP_ARTICLE_URL =
  "https://help.kickergpt.com/en/articles/13034068-how-to-get-the-best-out-of-kickergpt";
const BANNER_DISMISSED_KEY = "help-banner-dismissed";

export default function HelpBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed in this session
    const dismissed = sessionStorage.getItem(BANNER_DISMISSED_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem(BANNER_DISMISSED_KEY, "true");
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative z-50 w-full border-b border-border/60 bg-gradient-to-r from-primary/10 via-card to-accent/5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href={HELP_ARTICLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-sm font-medium text-foreground hover:text-primary transition-colors sm:text-left"
        >
          Want to Get the Best Out of KickerGPT?
        </a>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
