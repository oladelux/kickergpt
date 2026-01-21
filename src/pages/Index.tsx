import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, MessageSquare, Trophy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { isNativeMobile } from "@/lib/platform";
import { useAuth } from "@/hooks/useAuth";
import { track } from "@vercel/analytics";

const competitionBadges = [
  "Premier League",
  "LaLiga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Champions League",
  "Europa League",
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
        <title>KickerGPT - AI Football Predictions & Match Analysis</title>
        <meta
          name="description"
          content="Get AI-powered football predictions with win probabilities. Search for BTTS, Over 2.5 goals, home wins across Premier League, La Liga, Serie A and more. Free to start."
        />
        <meta
          name="keywords"
          content="football predictions, AI predictions, BTTS tips, over 2.5 goals, match predictions, Premier League predictions, accumulator tips, betting tips"
        />
        <meta property="og:title" content="KickerGPT | AI Football Predictions" />
        <meta
          property="og:description"
          content="Find winning football predictions with AI. Search by market type, get probabilities, and make smarter bets."
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

          <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-10 space-y-12">
            {/* Header */}
            <header className="flex items-center justify-between gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-3 backdrop-blur">
              <Link to="/" className="text-lg font-semibold tracking-tight">
                kicker<span className="bold text-primary">GPT</span>
              </Link>
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20"
                >
                  <Link to="/signup">Get started free</Link>
                </Button>
              </div>
            </header>

            {/* Hero - Focused on winning */}
            <section className="space-y-6 text-center pt-4">
              <Badge className="border border-primary/30 bg-primary/10 text-primary">
                AI-powered predictions
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Find football predictions{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  that actually win.
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Search "BTTS from England today" or "Over 2.5 goals tomorrow" and get AI predictions with win probabilities. No more guessing.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                  <Link to="/signup">
                    Start finding winners
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/fixtures">See today's predictions</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Free to start. No credit card needed.
              </p>
            </section>

            {/* Two ways to find winners */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight text-center">
                Two ways to find winning bets
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-border/60 bg-card/80">
                  <CardContent className="pt-6 space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Search className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold">Search what you want</h3>
                    <p className="text-muted-foreground">
                      Type "BTTS from Premier League this weekend" or "Home wins from La Liga Saturday" and instantly see matching predictions with probabilities.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">"Over 2.5 goals today"</Badge>
                      <Badge variant="secondary" className="text-xs">"BTTS from Bundesliga"</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/60 bg-card/80">
                  <CardContent className="pt-6 space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold">Ask about any match</h3>
                    <p className="text-muted-foreground">
                      Click any match and ask "Who wins?" or "Is this likely to be high-scoring?" Get straight answers with the stats to back it up.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">"Who's likely to win?"</Badge>
                      <Badge variant="secondary" className="text-xs">"Will both teams score?"</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* What you get - focused on outcomes */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight text-center">
                What you get
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border/60 bg-card/80 p-5 text-center">
                  <p className="text-3xl font-bold text-primary">Win %</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Every prediction shows probability so you know how confident to be
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/80 p-5 text-center">
                  <p className="text-3xl font-bold text-primary">High / Low</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Confidence levels help you decide which bets are worth it
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/80 p-5 text-center">
                  <p className="text-3xl font-bold text-primary">Why</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    See the reasons behind each prediction—form, injuries, H2H
                  </p>
                </div>
              </div>
            </section>

            {/* Leagues covered */}
            <section className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Trophy className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium">Leagues covered</h2>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {competitionBadges.map((league) => (
                  <Badge
                    key={league}
                    variant="outline"
                    className="border-border/60 text-foreground/80"
                  >
                    {league}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Final CTA */}
            <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 text-center space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Stop guessing. Start winning.
              </h2>
              <p className="text-muted-foreground">
                Join bettors who use AI to find better predictions.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                  <Link to="/signup">
                    Get started free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </section>

            {/* Footer - minimal */}
            <footer className="border-t border-border/40 pt-6 text-sm text-muted-foreground">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium text-foreground">
                  kicker<span className="text-primary">GPT</span>
                </p>
                <div className="flex gap-4">
                  <Link to="/fixtures" className="hover:text-primary">
                    Fixtures
                  </Link>
                  <Link to="/login" className="hover:text-primary">
                    Login
                  </Link>
                  <Link to="/terms" className="hover:text-primary">
                    Terms
                  </Link>
                  <Link to="/privacy" className="hover:text-primary">
                    Privacy
                  </Link>
                </div>
              </div>
              <p className="mt-4 text-xs">© {new Date().getFullYear()} KickerGPT. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
