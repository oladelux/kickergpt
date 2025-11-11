import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  LineChart,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const featureHighlights = [
  {
    icon: Sparkles,
    title: "Scenario-aware brain",
    description:
      "Understands tactical match-ups, coaching patterns, and historic duels before suggesting an outcome.",
  },
  {
    icon: Target,
    title: "Condition tracking",
    description:
      "Feeds injury news, pitch reports, weather, travel fatigue, morale, and officiating trends into one verdict.",
  },
  {
    icon: LineChart,
    title: "Live momentum radar",
    description:
      "Reads in-game tempo, xG swings, substitutions, and form curves to reassess probabilities on the fly.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-ready reasoning",
    description:
      "Every recommendation ships with transparent rationale so analysts can trust and act instantly.",
  },
];

const coverageStack = [
  "Squad availability, suspensions, and late fitness calls.",
  "Coaching tactics, formations, and matchup-specific gameplans.",
  "Stadium factors: pitch size, surface, altitude, weather, and travel.",
  "Psychology levers such as rivalry pressure, contract noise, or morale.",
  "Market signals, sharp money movement, and historical close-game data.",
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
            <Badge className="mx-auto w-fit border border-primary/30 bg-primary/10 text-primary">
              Football intelligence copilot
            </Badge>
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                kicker<span className="bold text-primary">GPT</span> delivers the{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  most exhaustive football match analysis
                </span>{" "}
                on the planet.
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                Every scenario that can bend a match result, weather chaos, tired legs, bench depth,
                referees, supporter morale is modeled before Kicker
                <span className="bold text-primary">GPT</span> hands you an insight.
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
                <Link to="/fixtures">See today's brief</Link>
              </Button>
            </div>
            <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-sm sm:grid-cols-3">
              {[
                { label: "Scenarios evaluated / match", value: "2,400+" },
                { label: "Leagues modeled", value: "150+" },
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
                Trusted toolkit
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">
                Everything a modern football desk expects
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

          <footer className="mt-16 rounded-3xl border border-border/60 bg-card/70 p-8 text-sm text-muted-foreground backdrop-blur">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">
                  kicker<span className="bold text-primary">GPT</span>
                </p>
                <p>Scenario-perfect football intelligence for analysts and storytellers.</p>
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
