import { useEffect, useState } from "react";

export function useGeoCountry() {
  const [geoCountryCode, setGeoCountryCode] = useState<string>("US");
  const [geoLoading, setGeoLoading] = useState(true);

  useEffect(() => {
    const detectCountry = async () => {
      setGeoLoading(true);

      try {
        // Primary: ipapi.co (free, no key needed)
        const response = await fetch("https://ipapi.co/country/", {
          signal: AbortSignal.timeout(3000), // 3 second timeout
        });

        if (response.ok) {
          const countryCode = await response.text();
          const trimmed = countryCode.trim().toUpperCase();
          if (trimmed.length === 2) {
            setGeoCountryCode(trimmed);
            setGeoLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn("Primary geo detection failed:", error);
      }

      try {
        // Fallback: ip-api.com
        const response = await fetch("http://ip-api.com/json/?fields=countryCode", {
          signal: AbortSignal.timeout(3000),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.countryCode) {
            setGeoCountryCode(data.countryCode.toUpperCase());
            setGeoLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn("Fallback geo detection failed:", error);
      }

      // Final fallback: browser locale (less reliable)
      const locale = navigator.languages?.[0] ?? navigator.language;
      const parts = (locale || "").split("-");
      if (parts.length > 1) {
        const region = parts[parts.length - 1]?.toUpperCase();
        if (region && region.length === 2) {
          setGeoCountryCode(region);
        }
      }

      setGeoLoading(false);
    };

    detectCountry();
  }, []);

  const resolvedCountryCode = (geoCountryCode ?? "").toUpperCase();
  return { resolvedCountryCode, geoLoading, geoCountryCode };
}
