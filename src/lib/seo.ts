export type SeoConfig = {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonical?: string;
  robots?: string;
  type?: string;
  twitterHandle?: string;
  schema?: Record<string, unknown>;
};

export const BASE_URL = "https://www.kickergpt.com";
const OG_IMAGE = "https://www.kickergpt.com/twitter-header.png";

export const DEFAULT_SEO: SeoConfig = {
  title: "KickerGPT | AI Football Predictions & Match Intelligence",
  description:
    "KickerGPT provides AI-powered match predictions and surfaces officiating trends, tactical shifts, and weather context so football bettors can research every market responsibly—probability-based forecasts, not guaranteed outcomes.",
  keywords:
    "AI football predictions, match outcome predictions, probability-based predictions, football betting tips research, soccer picks context, market intelligence, injury tracking, bettor workflow, matchday briefing, data-driven match predictions",
  ogImage: OG_IMAGE,
  canonical: BASE_URL,
  robots: "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1",
  type: "website",
  twitterHandle: "@kickerGPT",
  schema: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KickerGPT",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/fixtures?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
};

export const seoConfig: Record<string, Partial<SeoConfig>> = {
  "/": {
    title: "KickerGPT | AI Football Predictions & Match Intelligence",
    description:
      "Get AI-powered match predictions and scan fixtures for lineup news, pitch conditions, and officiating context so your betting research stays grounded in facts—probability-based forecasts, not guaranteed picks.",
    keywords:
      "AI football predictions, match outcome predictions, premier league betting tips research, la liga picks context, champions league bettor intel, football research app, probability-based predictions, data-driven match predictions",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "KickerGPT Betting Dashboard",
      url: BASE_URL,
      about: ["Football odds", "Betting intelligence", "Sports trading", "AI match predictions", "Probability-based forecasts"],
    },
  },
  "/plans": {
    title: "Plans & Access Passes | Configure KickerGPT Research Feeds",
    description:
      "Choose a plan that matches how you study markets—from quick context pings to deeper match dossiers—without any promise of winning wagers.",
    keywords:
      "football betting subscription, bettor research membership, sportsbook prep plan, market context access",
    schema: {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      name: "KickerGPT Plans",
      itemListElement: [
        {
          "@type": "Offer",
          position: 1,
          availability: "https://schema.org/InStock",
          description: "Baseline market context for casual bettors who want organized research.",
        },
        {
          "@type": "Offer",
          position: 2,
          availability: "https://schema.org/LimitedAvailability",
          description:
            "High-frequency context drops for bettors who review multiple markets daily.",
        },
      ],
    },
  },
  "/fixtures": {
    title: "Live Fixtures Intel | Real-Time Context For Bettors",
    description:
      "Track live status, tactical pivots, and weather or officiating cues so you can monitor markets responsibly in one dashboard.",
    keywords:
      "live football betting tips research, in-play context stream, market-moving match intel, responsible betting insights",
    schema: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Live Football Fixtures",
      itemListOrder: "http://schema.org/ItemListOrderAscending",
      numberOfItems: 10,
    },
  },
  "/favorites": {
    title: "Watchlist | Track Your Preferred Clubs & Markets",
    description:
      "Pin the competitions and prop categories you watch most so relevant context hits your dashboard first.",
    keywords: "betting watchlist, tracked teams research, personalized football intel",
  },
  "/history": {
    title: "Betting History | Audit Past Research & Signals",
    description:
      "Review which insights you acted on to refine your personal betting process without focusing on promised ROI.",
    keywords: "betting research journal, bet tracking workspace, responsible wagering review",
    schema: {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Betting Signal History",
      description: "Historical record of research notes, fixtures, and outcomes from KickerGPT.",
      citation: BASE_URL,
    },
  },
  "/profile": {
    title: "Profile & Alerts | Tune The Context You Receive",
    description:
      "Set preferred leagues, bet types, and risk tolerance so each KickerGPT notification fits your study habits.",
    keywords:
      "personalized betting research alerts, sports betting preferences, punter profile settings",
  },
  "/login": {
    title: "Login | Re-Enter The KickerGPT Command Room",
    description: "Sign back in to sync your research notes, alerts, and chat briefs.",
    keywords: "sports betting login, bettor research account access",
  },
  "/signup": {
    title: "Create Account | Start Getting Responsible Football Intel",
    description:
      "Open a KickerGPT account to receive contextual football insights designed to inform bettors—not guarantee outcomes.",
    keywords: "bettor research signup, football intel registration",
  },
  "/forgot-password": {
    title: "Reset Credentials | Recover Your Research Workspace",
    description: "Reset your password to regain access to AI-driven football context.",
    keywords: "betting account recovery, reset football research login",
  },
};
