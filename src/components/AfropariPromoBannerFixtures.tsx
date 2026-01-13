import { track } from "@vercel/analytics";
import { Smartphone } from "lucide-react";

export default function AfropariPromoBannerFixtures() {
  return (
    <div className="w-full rounded-2xl border border-primary/30 bg-primary/20 dark:bg-primary/30 p-3 sm:p-4 text-center relative">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Smartphone className="h-5 w-5 text-primary" />
        <p className="text-sm sm:text-base font-medium text-foreground">
          Get the <span className="font-bold text-primary">KickerGPT</span> app for a better experience
        </p>
      </div>
      <a
        href="https://play.google.com/store/apps/details?id=com.kickergpt.app"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm font-semibold text-primary hover:underline"
        onClick={() => track("download_app_banner")}
      >
        Download on Google Play
      </a>
    </div>
  );
}
