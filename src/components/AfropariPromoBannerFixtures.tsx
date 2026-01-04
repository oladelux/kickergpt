import { useGeoCountry } from "@/hooks/useGeoCountry";
import { track } from "@vercel/analytics";

export default function AfropariPromoBannerFixtures() {
  const { resolvedCountryCode } = useGeoCountry();

  // Only show for Nigerian users
  if (resolvedCountryCode !== "NG") {
    return null;
  }

  return (
    <div className="w-full rounded-2xl border border-primary/30 bg-primary/20 dark:bg-primary/30 p-3 sm:p-4 text-center relative">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-2xl">🇳🇬</span>
        <p className="text-sm sm:text-base font-medium text-foreground">
          Deposit and get <span className="font-bold text-green-600 dark:text-green-400">300%</span>{" "}
          bonus on Afropari, using the promo code{" "}
          <span className="font-semibold text-primary">KICKERGPT</span>
        </p>
      </div>
      <a
        href="https://refpa84423.com/L?tag=d_5072438m_70055c_&site=5072438&ad=70055&r=Registration"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm font-semibold text-primary hover:underline"
        onClick={() => track("signup_afropari")}
      >
        Sign up here
      </a>
    </div>
  );
}
