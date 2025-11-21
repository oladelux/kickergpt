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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const featureHighlights = [
  {
    icon: CalendarClock,
    title: "Matchday context locked-in",
    description:
      "Date, venue, referee crew, pricing drift, and weather are baked into every starting probability.",
  },
  {
    icon: HeartPulse,
    title: "Form plus availability",
    description:
      "Recent results, scoring trends, clean sheets, squad depth, injuries, and suspensions stitched together.",
  },
  {
    icon: Target,
    title: "Situational edges",
    description:
      "Home vs away splits, weekday records, favorite vs underdog profiles, upset history, and referee bias.",
  },
  {
    icon: Sparkles,
    title: "Texture the data",
    description:
      "News and sentiment, travel fatigue, weather-fit, and schedule congestion layered into one view.",
  },
];

const coverageStack = [
  "Basic match DNA: date, venue, weather, opening odds, and referee assignments.",
  "Historical meetings, favorite vs underdog returns, upset history, and rivalry temperature.",
  "Current form: recent matches, scoring trends, BTTS/over-under, clean sheets, home/away splits.",
  "Squad reality: injuries, suspensions, bench depth, and how absences hit patterns of play.",
  "Contextual edges: weekday tendencies, travel and rest days, fatigue risk, and referee impact.",
];

const signalBuckets = [
  {
    icon: CloudSun,
    title: "Conditions & confidence",
    description:
      "Weather fit, pitch comfort, travel distance, and day-of-week tendencies for both clubs.",
  },
  {
    icon: LineChart,
    title: "Form in motion",
    description:
      "Recent streaks, goal flow, BTTS/over-under records, and how momentum shifts on similar opponents.",
  },
  {
    icon: ShieldCheck,
    title: "Availability reality",
    description:
      "Suspensions, injuries, late fitness calls, and how depth covers the gaps across positions.",
  },
  {
    icon: Radar,
    title: "Referee & matchup bias",
    description:
      "Officiating history, bookings profile, and head-to-head trends that tilt the risk surface.",
  },
];

const dossierSnapshot = [
  {
    title: "Baseline read",
    points: [
      "Venue, surface, expected weather, kickoff timing, and referee crew mapped to historical results.",
      "Performance by weekday plus rest-day deltas to flag fatigue or freshness edges.",
    ],
  },
  {
    title: "Team pulse",
    points: [
      "Recent form with scoring trends, clean sheets, and BTTS likelihoods for each side.",
      "Injury/suspension impact on preferred XI, bench quality, and formation flexibility.",
    ],
  },
  {
    title: "Risk and edge",
    points: [
      "Favorite vs underdog behavior, upset history, and price drift versus implied strength.",
      "Referee history with either club, card cadence, and potential influence on defensive setups.",
    ],
  },
];

const competitionBadges = [
  "Premier League",
  "LaLiga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "UCL / UEL / UECL",
  "Eredivisie",
  "Primeira Liga",
  "MLS + additional European domestic leagues",
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-secondary/30 text-foreground">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute -top-10 left-1/4 h-64 w-64 bg-primary/10 blur-3xl" />
          <div className="absolute top-32 right-10 h-72 w-72 bg-accent/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-10 space-y-16">
          <header className="flex items-center justify-between gap-4 rounded-full border border-border/60 bg-card/60 px-6 py-3 backdrop-blur">
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
                <Link to="/signup">Request access</Link>
              </Button>
            </div>
          </header>

          <section className="space-y-8 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge className="w-fit border border-primary/30 bg-primary/10 text-primary">
                Football intelligence copilot
              </Badge>
              <Badge variant="outline" className="w-fit border-foreground/20 text-foreground/80">
                Free forever · No credit card needed
              </Badge>
              <Badge className="w-fit border border-accent/40 bg-accent/10 text-accent-foreground">
                Most European competitions covered
              </Badge>
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                See the angles before the odds move —{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  one pre-match read with every factor that bends the result.
                </span>
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                Kickergpt blends context, current form, officiating trends, and availability into
                one shareable pre-match read—asked for in chat, answered with angles—so analysts,
                writers, and edge-seekers move faster.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"
              >
                <Link to="/signup">
                  Unlock match intelligence
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-dashed">
                <Link to="/fixtures">Ask about today's matches</Link>
              </Button>
            </div>
            <p className="text-sm font-medium text-foreground/80">
              Free access. No credit card required to get started.
            </p>
            <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-sm sm:grid-cols-3">
              {[
                { label: "Signals parsed / match", value: "2,400+" },
                { label: "European + global comps", value: "150+" },
                { label: "Analyst hours saved weekly", value: "~12" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex flex-col gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Quietly obsessive toolkit
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">
                Built for people who need an edge without flashing it
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

          <section className="space-y-10">
            <div className="flex flex-col gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Coverage map
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">Signals before the whistle</h2>
              <p className="mx-auto max-w-3xl text-muted-foreground">
                Built around the signals sharp readers look for: match fundamentals, historical
                relationships, form, availability, and contextual edges that hint at where value may sit.
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
                  <CardContent className="text-muted-foreground">{signal.description}</CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mx-auto grid gap-10 justify-center">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/5 shadow-xl shadow-primary/10">
              <CardHeader>
                <Badge variant="outline" className="w-fit border-primary/40 text-primary">
                  Scenario coverage
                </Badge>
                <CardTitle className="text-2xl">No variable left out of the equation</CardTitle>
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
                Dossier snippet
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">
                What a pre-match read looks like
              </h2>
              <p className="mx-auto max-w-3xl text-muted-foreground">
                A compact pre-match outline referencing historical meetings, current form, squad realities,
                and officiating context—so you can spot storylines in seconds.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {dossierSnapshot.map((block) => (
                <Card key={block.title} className="border-border/60 bg-card/80">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-accent/10 text-accent-foreground">
                      {block.title === "Baseline read" && <MapPin className="h-5 w-5" />}
                      {block.title === "Team pulse" && <Users className="h-5 w-5" />}
                      {block.title === "Risk and edge" && <Zap className="h-5 w-5" />}
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
                European coverage
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">
                Built for continental nights and weekend chaos
              </h2>
              <p className="mx-auto max-w-3xl text-muted-foreground">
                From title races to relegation scraps, Kickergpt follows most European competitions
                plus key global leagues so every match analysis starts with useful context.
              </p>
            </div>
            <Card className="border-border/70 bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">League coverage</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Deep data plus fast snapshots for over 150 competitions.
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="border border-border/60 bg-primary/10 text-primary">
                  European focus
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {competitionBadges.map((item) => (
                  <Badge key={item} variant="outline" className="border-border/60 text-foreground/80">
                    {item}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </section>

          <footer className="mt-16 rounded-3xl border border-border/60 bg-card/70 p-8 text-sm text-muted-foreground backdrop-blur">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">
                  kicker<span className="bold text-primary">GPT</span>
                </p>
                <p>Scenario-perfect football intelligence for analysts, storytellers, and edge-hunters.</p>
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
                <a href="mailto:hello@kickergpt.com" className="hover:text-primary">
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
