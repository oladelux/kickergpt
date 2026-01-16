import { Link, useNavigate } from "react-router-dom";
import {
  CalendarClock,
  ArrowRight,
  CloudSun,
  HeartPulse,
  LineChart,
  MapPin,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  TrendingUp,
  Users,
  Zap,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { isNativeMobile } from "@/lib/platform";
import { useAuth } from "@/hooks/useAuth";
import { track } from "@vercel/analytics";

const featureHighlights = [
  {
    icon: CalendarClock,
    title: "Pre-match intelligence",
    description:
      "Venue, weather, referee, and odds analyzed together. Get data-backed insights on any upcoming match.",
  },
  {
    icon: HeartPulse,
    title: "Form & availability",
    description:
      "Recent results, scoring trends, injuries, and squad depth in one comprehensive view.",
  },
  {
    icon: Target,
    title: "Pattern recognition",
    description:
      "Day-of-week performance, kickoff trends, home/away splits, and H2H history automatically surfaced.",
  },
  {
    icon: TrendingUp,
    title: "AI-powered predictions",
    description:
      "Probability-based match predictions with confidence levels powered by historical patterns and current form.",
  },
];

const coverageStack = [
  "Match context: venue, weather, odds, and referee assignments.",
  "Head-to-head history with win rates, goal patterns, and recent trends.",
  "Current form: recent matches, scoring trends, BTTS rates, and home/away splits.",
  "Squad availability: injuries, suspensions, and their impact on recent results.",
  "Temporal patterns: weekday performance, kickoff time records, and form analysis.",
];

const signalBuckets = [
  {
    icon: CloudSun,
    title: "Conditions & context",
    description:
      "Weather impact, venue history, rest days, and schedule congestion analysis.",
  },
  {
    icon: LineChart,
    title: "Form & momentum",
    description:
      "Current streaks, goals trends, BTTS and over/under records from recent matches.",
  },
  {
    icon: ShieldCheck,
    title: "Squad reality",
    description:
      "Injuries with impact analysis, squad depth comparison, and performance effects.",
  },
  {
    icon: Radar,
    title: "Historical patterns",
    description:
      "Referee history, head-to-head records, and day/time performance patterns.",
  },
];

const dossierSnapshot = [
  {
    title: "Pre-match read",
    points: [
      "Venue, weather, and referee mapped to team performance in similar conditions.",
      "Day-of-week and time-slot performance patterns.",
    ],
  },
  {
    title: "Team form",
    points: [
      "Recent results with scoring trends, clean sheets, and BTTS likelihood.",
      "Injury impact analysis and squad availability.",
    ],
  },
  {
    title: "Head-to-head history",
    points: [
      "Win/draw/loss rates, goal patterns, and recent meeting trends.",
      "Referee history and performance patterns.",
    ],
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Pick a match",
    description: "Browse today's fixtures or search for upcoming games across European leagues.",
  },
  {
    step: "2",
    title: "Ask anything",
    description: "Ask about form, injuries, H2H, weather impact, day patterns—or just 'Who wins?'",
  },
  {
    step: "3",
    title: "Get data-backed insights",
    description: "Receive analysis with specific stats from historical data, not generic opinions.",
  },
  {
    step: "4",
    title: "Dig deeper",
    description: "Ask follow-up questions. The AI remembers context and focuses on what you asked.",
  },
];

const exampleQuestions = [
  "Who's likely to win and why?",
  "What's the predicted match outcome?",
  "How do both teams perform on Saturdays?",
  "What's the head-to-head history?",
  "How are injuries affecting the squads?",
  "Is this likely to be high-scoring?",
  "Could the underdog cause an upset?",
  "What's the probability of a draw?",
];

const competitionBadges = [
  "Premier League",
  "LaLiga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Champions League",
  "Europa League",
  "Conference League",
  "Eredivisie",
  "Primeira Liga",
  "And more...",
];

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect mobile users to login or fixtures
  useEffect(() => {
    if (isNativeMobile()) {
      if (user) {
        navigate("/fixtures", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [user, navigate]);

  // Track UTM source visits
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source");

    if (utmSource) {
      track("referral_visit", { source: utmSource });
      localStorage.setItem("utm_source", utmSource);
    }
  }, []);

  // Show loading screen for mobile while redirecting
  if (isNativeMobile()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>KickerGPT - AI Football Match Analysis & Predictions</title>
        <meta
          name="description"
          content="Pre-match intelligence and AI-powered match predictions powered by historical data patterns. Analyze form, injuries, H2H, weather, and day/time patterns for European football with probability-based outcome forecasts."
        />
        <meta
          name="keywords"
          content="football analysis, match prediction, AI football predictions, probability-based predictions, match outcome predictions, pre-match analysis, data-driven predictions, Premier League, LaLiga, Serie A, Bundesliga"
        />
        <meta property="og:title" content="KickerGPT | AI Football Match Analysis & Predictions" />
        <meta
          property="og:description"
          content="Pre-match intelligence and AI-powered match predictions powered by data patterns, not opinions. Get probability-based forecasts with confidence levels."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kickergpt.com" />
        <link rel="canonical" href="https://kickergpt.com" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-secondary/30 text-foreground">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute -top-10 left-1/4 h-64 w-64 bg-primary/10 blur-3xl" />
            <div className="absolute top-32 right-10 h-72 w-72 bg-accent/10 blur-[120px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-10 space-y-16">
            <header className="flex items-center justify-between gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-3 backdrop-blur">
              <Link to="/" className="text-lg font-semibold tracking-tight">
                kicker<span className="bold text-primary">GPT</span>
              </Link>
              <div className="hidden gap-6 text-sm text-muted-foreground md:flex"></div>
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20"
                >
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            </header>

            <section className="space-y-8 text-center">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge className="w-fit border border-primary/30 bg-primary/10 text-primary">
                  AI-powered match analysis
                </Badge>
                <Badge variant="outline" className="w-fit border-foreground/20 text-foreground/80">
                  Free forever · No credit card needed
                </Badge>
                <Badge className="w-fit border border-accent/40 bg-accent/10 text-accent">
                  AI predictions
                </Badge>
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  Pre-match intelligence{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    powered by data patterns, not opinions.
                  </span>
                </h1>
                <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                  AI-powered football match analysis combining form, injuries, H2H history, and patterns into conversational insights with probability-based predictions.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                  <Link to="/signup">
                    Start analyzing matches
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-dashed">
                  <Link to="/fixtures">View today's fixtures</Link>
                </Button>
              </div>
              <p className="text-sm font-medium text-foreground/80">
                Free tier available. No credit card required to get started.
              </p>
              <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-sm sm:grid-cols-3">
                {[
                  { label: "Data points analyzed per match", value: "50+" },
                  { label: "European leagues covered", value: "Top 5 + more" },
                  { label: "Analysis tools available", value: "20+" },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* How It Works Section */}
            <section className="space-y-8">
              <div className="flex flex-col gap-3 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  How it works
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">
                  From question to insight in seconds
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-4">
                {howItWorks.map((item) => (
                  <Card key={item.step} className="border-border/60 bg-card/80 text-center">
                    <CardHeader>
                      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
                        {item.step}
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {item.description}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex flex-col gap-3 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  Core capabilities
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">
                  What KickerGPT does for you
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {featureHighlights.map((feature) => (
                  <Card key={feature.title} className="border-border/70 bg-card/80 backdrop-blur">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2 text-muted-foreground">
                      {feature.description}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Strategies Section */}
            <section className="space-y-6">
              <div className="flex flex-col gap-3 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  Strategies
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">
                  Your personal match-finding assistant
                </h2>
                <p className="mx-auto max-w-2xl text-muted-foreground">
                  Create custom strategies and automatically find matches that meet your criteria.
                </p>
              </div>
              <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 shadow-xl shadow-primary/10">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl">Strategies</CardTitle>
                        <Badge className="bg-primary/10 text-primary border-primary/20">PRO</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Automate your match research with intelligent filters
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/80 p-4">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Custom conditions</h3>
                        <p className="text-sm text-muted-foreground">
                          Set criteria based on form, goals, win rates, and more.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/80 p-4">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Auto-discovery</h3>
                        <p className="text-sm text-muted-foreground">
                          Instantly find matching fixtures across multiple leagues.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 p-4">
                    <p className="text-sm font-medium text-foreground mb-3">
                      Example strategy conditions:
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <p>Home team has won 3+ of their last 5 matches</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <p>Away team has conceded 2+ goals in 4 of their last 5 matches</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <p>Both teams have scored in 60%+ of recent meetings</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      asChild
                      className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    >
                      <Link to="/signup">
                        Try Strategies with PRO
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Example Questions Section */}
            <section className="space-y-6">
              <div className="flex flex-col gap-3 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  Ask anything
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">
                  Questions KickerGPT can answer
                </h2>
                <p className="mx-auto max-w-2xl text-muted-foreground">
                  Ask natural questions and get data-driven answers.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {exampleQuestions.map((q) => (
                  <Badge
                    key={q}
                    variant="outline"
                    className="border-border/60 px-4 py-2 text-sm text-foreground/80"
                  >
                    "{q}"
                  </Badge>
                ))}
              </div>
            </section>

            <section className="space-y-10">
              <div className="flex flex-col gap-3 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  Data signals
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">What gets analyzed</h2>
                <p className="mx-auto max-w-3xl text-muted-foreground">
                  Comprehensive analysis from multiple data dimensions for the complete picture.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {signalBuckets.map((signal) => (
                  <Card
                    key={signal.title}
                    className="border-border/60 bg-gradient-to-br from-card/80 via-card to-card/90"
                  >
                    <CardHeader className="flex flex-row items-center gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-primary/10 text-primary">
                        <signal.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{signal.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                      {signal.description}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mx-auto grid gap-10 justify-center">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/5 shadow-xl shadow-primary/10">
                <CardHeader>
                  <Badge variant="outline" className="w-fit border-primary/40 text-primary">
                    Full coverage
                  </Badge>
                  <CardTitle className="text-2xl">Every angle covered in one analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  {coverageStack.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Radar className="mt-1 h-5 w-5 text-primary" />
                      <p>{item}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            <section className="space-y-8">
              <div className="flex flex-col gap-3 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  Analysis breakdown
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">
                  What you get in every analysis
                </h2>
                <p className="mx-auto max-w-3xl text-muted-foreground">
                  Structured breakdown covering match context and team form for quick insights.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {dossierSnapshot.map((block) => (
                  <Card key={block.title} className="border-border/60 bg-card/80">
                    <CardHeader className="flex flex-row items-center gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-accent/10 text-accent-foreground">
                        {block.title === "Pre-match read" && <MapPin className="h-5 w-5" />}
                        {block.title === "Team form" && <Users className="h-5 w-5" />}
                        {block.title === "Head-to-head history" && <Users className="h-5 w-5" />}
                      </div>
                      <CardTitle className="text-lg">{block.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      {block.points.map((point) => (
                        <div key={point} className="flex items-start gap-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          <p>{point}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex flex-col gap-3 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  League coverage
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">
                  Global football competitions coverage
                </h2>
                <p className="mx-auto max-w-3xl text-muted-foreground">
                  Coverage of major European leagues and competitions from around the globe with comprehensive historical data.
                </p>
              </div>
              <Card className="border-border/70 bg-card/80">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Competitions coverage</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Data across domestic, European, and global competitions.
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="border border-border/60 bg-primary/10 text-primary"
                  >
                    Global coverage
                  </Badge>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  {competitionBadges.map((item) => (
                    <Badge
                      key={item}
                      variant="outline"
                      className="border-border/60 text-foreground/80"
                    >
                      {item}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* CTA Section */}
            <section className="space-y-6 text-center">
              <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-10">
                <h2 className="text-3xl font-semibold tracking-tight">
                  Ready to analyze your next match?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                  Pre-match intelligence powered by data patterns. Start for free.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  >
                    <Link to="/signup">
                      Create free account
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-dashed">
                    <Link to="/fixtures">Browse today's fixtures</Link>
                  </Button>
                </div>
              </div>
            </section>

            <footer className="mt-16 rounded-3xl border border-border/60 bg-card/70 p-8 text-sm text-muted-foreground backdrop-blur">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">
                    kicker<span className="bold text-primary">GPT</span>
                  </p>
                  <p>
                    AI-powered football match analysis for fans, analysts, and content creators.
                  </p>
                </div>
                <div className="flex flex-wrap gap-6 text-foreground/80">
                  <Link to="/fixtures" className="hover:text-primary">
                    Explore fixtures
                  </Link>
                  <Link to="/login" className="hover:text-primary">
                    login
                  </Link>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
                <p>© {new Date().getFullYear()} Kickergpt. All rights reserved.</p>
                <div className="flex gap-4">
                  <Link to="/terms" className="hover:text-primary">
                    Terms
                  </Link>
                  <Link to="/privacy" className="hover:text-primary">
                    Privacy
                  </Link>
                  <a href="mailto:admin@kickergpt.com" className="hover:text-primary">
                    Contact
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
