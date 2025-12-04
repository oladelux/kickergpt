import { Link } from "react-router-dom";
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
  Users,
  Zap,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const featureHighlights = [
  {
    icon: CalendarClock,
    title: "Pre-match intelligence",
    description:
      "Date, venue, referee, weather, and odds analyzed together. Ask any question about upcoming matches and get data-backed insights.",
  },
  {
    icon: HeartPulse,
    title: "Form & availability",
    description:
      "Recent results, scoring trends, clean sheets, injuries, and squad depth—stitched into one view with win/draw/loss records.",
  },
  {
    icon: Target,
    title: "Pattern recognition",
    description:
      "Day-of-week performance, kickoff time trends, home/away splits, H2H history, and referee tendencies surfaced automatically.",
  },
];

const coverageStack = [
  "Match context: date, venue, weather conditions, opening odds, and referee assignments.",
  "Head-to-head history with win rates, goal patterns, and recent meeting trends.",
  "Current form: last 5-10 matches, scoring trends, BTTS rates, clean sheets, home/away splits.",
  "Squad availability: injuries, suspensions, and how absences have affected recent results.",
  "Temporal patterns: weekday performance, kickoff time records, monthly form, and fatigue analysis.",
];

const signalBuckets = [
  {
    icon: CloudSun,
    title: "Conditions & context",
    description:
      "Weather impact, venue history, rest days between matches, and schedule congestion for both sides.",
  },
  {
    icon: LineChart,
    title: "Form & momentum",
    description:
      "Current streaks, goals scored/conceded trends, BTTS and over/under records from recent matches.",
  },
  {
    icon: ShieldCheck,
    title: "Squad reality",
    description:
      "Injured players listed with reasons, squad depth comparison, and impact on recent performances.",
  },
  {
    icon: Radar,
    title: "Historical patterns",
    description:
      "Referee history with both teams, head-to-head records, and day/time performance patterns.",
  },
];

const dossierSnapshot = [
  {
    title: "Pre-match read",
    points: [
      "Venue, weather, kickoff time, and referee mapped to each team's historical results in similar conditions.",
      "Day-of-week and time-slot performance to spot scheduling edges or disadvantages.",
    ],
  },
  {
    title: "Team form",
    points: [
      "Last match results with scoring trends, clean sheet rates, and BTTS likelihood.",
      "Injury list with player names, reasons, and how absences affect the starting XI.",
    ],
  },
  {
    title: "Head-to-head history",
    points: [
      "Win/draw/loss rates, goal patterns, and recent meeting trends.",
      "Referee history with both teams, head-to-head records, and day/time performance patterns.",
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
  "How do both teams perform on Saturdays?",
  "What's the head-to-head history?",
  "How are injuries affecting the squads?",
  "Is this likely to be high-scoring?",
  "Could the underdog cause an upset?",
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Helmet>
        <title>KickerGPT - AI Football Match Analysis</title>
        <meta
          name="description"
          content="Pre-match intelligence powered by historical data patterns. Analyze form, injuries, H2H, weather, and day/time patterns for European football."
        />
        <meta
          name="keywords"
          content="football analysis, match prediction, pre-match analysis, Premier League, LaLiga, Serie A, Bundesliga"
        />
        <meta property="og:title" content="KickerGPT | AI Football Match Analysis" />
        <meta
          property="og:description"
          content="Pre-match intelligence explanations powered by data patterns, not opinions."
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
                {mounted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 rounded-md"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                )}
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
                  Pre-match insights
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
                  KickerGPT combines match context, current form, head-to-head history, injuries,
                  and day/time patterns into conversational pre-match analysis. Ask questions, get
                  follow-ups, and dig deeper into the data.
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
                  Every analysis draws from multiple data dimensions to give you the full
                  picture—not cherry-picked stats
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
                  A structured breakdown covering match context, team form so you can spot what
                  matters in seconds.
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
                  Major European competitions and beyond
                </h2>
                <p className="mx-auto max-w-3xl text-muted-foreground">
                  From title races to relegation battles, KickerGPT covers the leagues that matter
                  with deep historical data.
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
                        Data across domestic and European competitions.
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="border border-border/60 bg-primary/10 text-primary"
                  >
                    European focus
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
                  Get pre-match intelligence powered by real data patterns. Start for free.
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
