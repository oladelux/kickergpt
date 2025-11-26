import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, MessageSquare, Send, Bot, User } from "lucide-react";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { api, SportmonksFixture, SportmonksFixtureState } from "@/lib/api";
import { MarkdownContent } from "@/components/MarkdownContent";

type OutcomeResponse = {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  finalScore: { home: number; away: number; winner: "home" | "away" | "draw" } | null;
  analysis: string;
};

type MatchLite = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoffTime: Date;
  league: string;
  country: string;
  status?: SportmonksFixtureState;
};

const LIVE_DEVELOPER_CODES = new Set([
  "INPLAY_1ST_HALF",
  "INPLAY_2ND_HALF",
  "INPLAY_EXTRA_TIME",
  "INPLAY_PENALTIES",
  "INPLAY_BREAK",
  "INPLAY_SUSPENSION",
  "INPLAY_ABANDONED",
  "INPLAY_AWARDED",
  "INPLAY_TO_BE_DECIDED",
]);
const LIVE_SHORT_CODES = new Set([
  "LIVE",
  "1H",
  "2H",
  "ET",
  "AET",
  "PEN",
  "1ST",
  "2ND",
  "1ST HALF",
  "2ND HALF",
]);
const FINISHED_STATUS_CODES = new Set(["FT", "AET", "PEN", "AW", "WO", "FINISHED", "FULLTIME"]);
const UPCOMING_STATUS_CODES = new Set(["NS", "NOTSTARTED", "NOT_STARTED"]);
const STATUS_LABELS: Record<string, string> = {
  FT: "Full Time",
  HT: "Half Time",
  ET: "Extra Time",
  AET: "After ET",
  PEN: "Penalties",
  BT: "Break",
  PST: "Postponed",
  CANC: "Cancelled",
  INT: "Interrupted",
  SUSP: "Suspended",
  ABD: "Abandoned",
  AWD: "Awarded",
  TBD: "To Be Decided",
  LIVE: "Live",
  INPLAY_1ST_HALF: "1st Half",
  INPLAY_2ND_HALF: "2nd Half",
  INPLAY_EXTRA_TIME: "Extra Time",
  INPLAY_PENALTIES: "Penalties",
  INPLAY_BREAK: "Break",
  INPLAY_SUSPENSION: "Suspended",
  INPLAY_ABANDONED: "Abandoned",
  INPLAY_AWARDED: "Awarded",
  INPLAY_TO_BE_DECIDED: "To Be Decided",
};
const PRIORITY_COUNTRIES = [
  "England",
  "Spain",
  "France",
  "Germany",
  "Italy",
  "Netherlands",
  "Portugal",
  "Turkey",
] as const;

const PRIORITY_COUNTRY_RANK = new Map(
  PRIORITY_COUNTRIES.map((country, index) => [country.toLowerCase(), index])
);
type StatusFilter = "all" | "live" | "upcoming";

const normalizeStatusCode = (value?: string | null) =>
  (typeof value === "string" ? value.trim().toUpperCase() : null) ?? null;

const getStatusCodes = (match: MatchLite) => {
  const developer = normalizeStatusCode(match.status?.developer_name);
  const short = normalizeStatusCode(match.status?.short_name);
  const state = normalizeStatusCode(match.status?.state);
  const name = normalizeStatusCode(match.status?.name);
  return { developer, short, state, name };
};

const getComparableStatusCodes = (match: MatchLite) => {
  const { developer, short, state, name } = getStatusCodes(match);
  return [developer, short, state, name].filter(Boolean) as string[];
};

const isLiveMatch = (match: MatchLite) => {
  const codes = getComparableStatusCodes(match);
  return codes.some(
    (code) =>
      LIVE_DEVELOPER_CODES.has(code) || LIVE_SHORT_CODES.has(code) || code.startsWith("INPLAY")
  );
};

const isFinishedMatch = (match: MatchLite) => {
  const codes = getComparableStatusCodes(match);
  return codes.some((code) => FINISHED_STATUS_CODES.has(code));
};

const isUpcomingMatch = (match: MatchLite) => {
  const codes = getComparableStatusCodes(match);
  if (!codes.length) return true;
  if (codes.some((code) => UPCOMING_STATUS_CODES.has(code))) return true;
  return !isLiveMatch(match) && !isFinishedMatch(match);
};

const getMatchStatusLabel = (match: MatchLite) => {
  const { developer, short, state } = getStatusCodes(match);
  const codes = [short, developer, state].filter(Boolean) as string[];

  if (!codes.length || codes.some((code) => UPCOMING_STATUS_CODES.has(code))) {
    return match.kickoffTime.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const labelFromMap = codes.map((code) => STATUS_LABELS[code]).find(Boolean);
  const readableLabel = labelFromMap ?? match.status?.name ?? short ?? developer ?? state;

  if (isLiveMatch(match)) {
    const isHalfInPlay = codes.some((code) =>
      [
        "INPLAY_1ST_HALF",
        "INPLAY_2ND_HALF",
        "1ST",
        "2ND",
        "1ST HALF",
        "2ND HALF",
        "1H",
        "2H",
      ].includes(code)
    );
    if (isHalfInPlay) {
      return readableLabel ?? "Live";
    }

    const elapsedMinutes = Math.max(
      0,
      Math.round((Date.now() - match.kickoffTime.getTime()) / 60000)
    );
    const liveLabel = readableLabel ?? "Live";
    return elapsedMinutes ? `${liveLabel} ${elapsedMinutes}'` : liveLabel;
  }

  return (
    readableLabel ?? match.kickoffTime.toLocaleString([], { hour: "2-digit", minute: "2-digit" })
  );
};

const getStatusBadgeClasses = (match: MatchLite) => {
  if (isLiveMatch(match)) {
    return "text-destructive border-destructive/60 bg-destructive/5";
  }
  if (isFinishedMatch(match)) {
    return "text-emerald-500 border-emerald-500/50 bg-emerald-500/5";
  }
  return "text-muted-foreground border-border/60";
};
const mapFixture = (fixture: SportmonksFixture): MatchLite => {
  const participants = fixture.participants ?? [];
  const home =
    participants.find((p) => p.meta?.location?.toLowerCase() === "home") ?? participants[0];
  const away =
    participants.find((p) => p.meta?.location?.toLowerCase() === "away") ?? participants[1];
  return {
    id: String(fixture.id),
    homeTeam: home?.name ?? fixture.name?.split(" vs ")[0] ?? "Home",
    awayTeam: away?.name ?? fixture.name?.split(" vs ")[1] ?? "Away",
    kickoffTime: new Date(fixture.starting_at),
    league: fixture.league?.name ?? "Unknown league",
    country: fixture.league?.country?.name ?? "International",
    status: fixture.state,
  };
};

const formatDateInput = (date: Date) => date.toISOString().slice(0, 10);

const ControlRoomDialog = ({
  match,
  date,
  open,
  onOpenChange,
}: {
  match: MatchLite | null;
  date: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [messages, setMessages] = useState<
    { id: string; role: "user" | "assistant"; content: string; timestamp: Date }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!open || !match) {
      setMessages([]);
      setError(null);
      setLoading(false);
      setInput("");
      setConversationId(null);
      return;
    }
    setMessages([
      {
        id: "intro",
        role: "assistant",
        content:
          "Outcome requests here go straight to the control room endpoint. No suggestions are shown—just click “Get outcome”.",
        timestamp: new Date(),
      },
    ]);
  }, [match, open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!match || loading) return;
    const trimmed = input.trim() || "Get outcome";
    setLoading(true);
    setError(null);
    setInput("");
    const userMessage = {
      id: String(Date.now()),
      role: "user" as const,
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const result = await api.fixtures.getControlRoomOutcome(
        match.id,
        date,
        trimmed,
        conversationId ?? undefined
      );

      if (result.conversationId) {
        setConversationId(result.conversationId);
      }

      const parts = [
        result.finalScore
          ? `Final score: ${result.finalScore.home} - ${result.finalScore.away} (${result.finalScore.winner})`
          : "Final score: not available",
        result.analysis,
      ]
        .filter(Boolean)
        .join("\n\n");
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: parts,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setError("Couldn't fetch outcome for this fixture. Please try again.");
      toast({
        variant: "destructive",
        title: "Request failed",
        description: "Couldn't fetch outcome for this fixture.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 sm:rounded-3xl max-sm:left-0 max-sm:right-0 max-sm:bottom-0 max-sm:top-auto max-sm:w-full max-sm:max-w-full max-sm:h-[min(88vh,600px)] max-sm:rounded-t-3xl max-sm:border-t max-sm:translate-x-0 max-sm:translate-y-0 max-sm:shadow-2xl">
        <div className="sm:hidden flex justify-center pt-3">
          <span className="h-1.5 w-12 rounded-full bg-muted-foreground/40" />
        </div>
        <DialogHeader className="relative px-6 py-4 border-b max-sm:px-4 text-center sm:text-center">
          <DialogTitle className="text-base font-semibold leading-tight sm:text-lg">
            {match ? `${match.homeTeam} vs ${match.awayTeam}` : "Control room"}
          </DialogTitle>
          {match && (
            <p className="text-xs text-muted-foreground">
              {match.league} •{" "}
              {match.kickoffTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4 max-sm:px-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}

                <div
                  className={`rounded-2xl p-4 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border"
                  }`}
                >
                  <MarkdownContent content={message.content} />
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-foreground" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 animate-fade-in justify-start">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                  <MessageSquare className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="rounded-2xl p-4 bg-card border border-border flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Requesting outcome...</p>
                </div>
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t bg-card/50 backdrop-blur-sm p-4">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSend();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a note or just hit send to get the outcome..."
              className="flex-1 rounded-md border border-border bg-card px-3 py-2 text-sm"
              disabled={loading || !match}
            />
            <Button
              type="submit"
              size="icon"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
              disabled={loading || !match}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function ControlRoom() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [fixtures, setFixtures] = useState<MatchLite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchLite | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dateParam = searchParams.get("date") || formatDateInput(new Date());
  const [countryFilter, setCountryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    if (meta) {
      meta.setAttribute("content", "noindex,nofollow");
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "robots";
      newMeta.content = "noindex,nofollow";
      document.head.appendChild(newMeta);
    }
  }, []);

  const loadFixtures = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fixtures.getControlRoomFixtures({
        date: dateParam,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      const mapped = data.data.map(mapFixture);
      setFixtures(mapped);
    } catch (err) {
      console.error(err);
      setError("Failed to load control room fixtures.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFixtures().catch(() => {});
  }, [dateParam]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("date", value);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const normalizedCountry = countryFilter.trim().toLowerCase();
    const normalizedSearch = search.trim().toLowerCase();
    return fixtures.filter((match) => {
      if (normalizedCountry && !match.country.toLowerCase().includes(normalizedCountry)) {
        return false;
      }
      if (normalizedSearch) {
        const haystack =
          `${match.homeTeam} ${match.awayTeam} ${match.league} ${match.country}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) return false;
      }
      if (statusFilter === "live" && !isLiveMatch(match)) return false;
      if (statusFilter === "upcoming" && !isUpcomingMatch(match)) return false;
      return true;
    });
  }, [countryFilter, fixtures, search, statusFilter]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Record<string, MatchLite[]>>>((acc, match) => {
      const country = match.country || "International";
      const league = match.league || "Other";
      if (!acc[country]) acc[country] = {};
      if (!acc[country][league]) acc[country][league] = [];
      acc[country][league].push(match);
      return acc;
    }, {});
  }, [filtered]);

  return (
    <div className="min-h-screen bg-background pt-16 pb-16 md:pb-0">
      <TopNav />
      <main className="mx-auto max-w-5xl space-y-6 p-4">
        <header className="flex flex-col gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <Badge>Internal</Badge>
            <h1 className="text-2xl font-semibold">Control room</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-muted-foreground">
              Date
              <input
                type="date"
                value={dateParam}
                onChange={handleDateChange}
                className="ml-2 rounded-md border border-border bg-card px-3 py-2 text-sm"
              />
            </label>
            <label className="text-sm text-muted-foreground">
              Country
              <input
                type="text"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                placeholder="Filter by country"
                className="ml-2 rounded-md border border-border bg-card px-3 py-2 text-sm"
              />
            </label>
            <label className="text-sm text-muted-foreground flex-1 min-w-[200px]">
              Search
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Teams or leagues"
                className="ml-2 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
              />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {(["all", "live", "upcoming"] as StatusFilter[]).map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={statusFilter === value ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setStatusFilter(value)}
                >
                  {value === "all" ? "All" : value === "live" ? "Live" : "Upcoming"}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={loadFixtures} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reload"}
            </Button>
            {(countryFilter || search || statusFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCountryFilter("");
                  setSearch("");
                  setStatusFilter("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {PRIORITY_COUNTRIES.map((country) => (
              <Button
                type="button"
                key={country}
                size="sm"
                variant={countryFilter === country ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setCountryFilter((prev) => (prev === country ? "" : country))}
              >
                {country}
              </Button>
            ))}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </header>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading fixtures…</span>
          </div>
        ) : fixtures.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No fixtures for this date.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([country, leagues]) => (
              <Card key={country} className="border-border/70 bg-card/70">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{country}</CardTitle>
                  <Badge variant="secondary">
                    {Object.values(leagues).reduce((sum, matches) => sum + matches.length, 0)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(leagues).map(([league, leagueMatches]) => (
                    <div key={league} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{league}</p>
                        <Badge variant="outline">{leagueMatches.length}</Badge>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {leagueMatches.map((match) => (
                          <div
                            key={match.id}
                            className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-4"
                          >
                            <div className="space-y-1">
                              <p className="text-sm font-semibold">
                                {match.homeTeam} vs {match.awayTeam}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="secondary">
                                  {match.kickoffTime.toLocaleString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </Badge>
                                <Badge variant="outline" className={getStatusBadgeClasses(match)}>
                                  {getMatchStatusLabel(match)}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="default"
                              className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                              onClick={() => {
                                setSelectedMatch(match);
                                setDialogOpen(true);
                              }}
                            >
                              <MessageSquare className="h-4 w-4" />
                              Outcome
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <ControlRoomDialog
        match={selectedMatch}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        date={dateParam}
      />
      <BottomNav />
    </div>
  );
}
