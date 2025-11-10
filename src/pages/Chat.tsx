import { useState } from "react";
import { Activity, Clock, Globe, Heart, MessageSquare, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import ChatDialog from "@/components/ChatDialog";
import { useMatches } from "@/hooks/useMatches";
import { Match } from "@/services/matches.service";
import { LoadingPage } from "@/components/LoadingPage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const LIVE_STATUS_CODES = new Set(["1H", "2H", "ET", "BT", "P", "LIVE", "HT"]);
const FINISHED_STATUS_CODES = new Set(["FT", "AET", "PEN", "AW", "WO"]);
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

type StatusFilter = "all" | "live" | "upcoming" | "favorites";

const getInitials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 3)
    .toUpperCase() || "?";

const formatKickoffTime = (date: Date) =>
  date.toLocaleString([], {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const getTimeUntilKickoff = (date: Date) => {
  const diffMs = date.getTime() - Date.now();
  if (diffMs <= 0) {
    return "Live";
  }

  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes < 60) {
    return `in ${diffMinutes}m`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    const minutes = diffMinutes % 60;
    return `in ${diffHours}h${minutes ? ` ${minutes}m` : ""}`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `in ${diffDays}d`;
};

const isLiveMatch = (match: Match) => {
  const short = match.status?.short?.toUpperCase();
  if (!short) return false;
  return LIVE_STATUS_CODES.has(short);
};

const isFinishedMatch = (match: Match) => {
  const short = match.status?.short?.toUpperCase();
  if (!short) return false;
  return FINISHED_STATUS_CODES.has(short);
};

const getMatchStatusLabel = (match: Match) => {
  const short = match.status?.short?.toUpperCase();
  if (!short || short === "NS") {
    return getTimeUntilKickoff(match.kickoffTime);
  }

  if (STATUS_LABELS[short]) {
    if (short === "LIVE" && typeof match.status?.elapsed === "number") {
      return `${STATUS_LABELS[short]} ${match.status.elapsed}'`;
    }
    return STATUS_LABELS[short];
  }

  if (typeof match.status?.elapsed === "number") {
    return `${match.status.elapsed}' ${match.status?.long ?? short}`.trim();
  }

  return match.status?.long ?? short;
};

const getStatusBadgeClasses = (match: Match) => {
  if (isLiveMatch(match)) {
    return "text-destructive border-destructive/60 bg-destructive/5";
  }
  if (isFinishedMatch(match)) {
    return "text-emerald-500 border-emerald-500/50 bg-emerald-500/5";
  }
  return "text-muted-foreground border-border/60";
};

const isUpcomingMatch = (match: Match) => !isLiveMatch(match) && !isFinishedMatch(match);

export default function Chat() {
  const { matches, loading, toggleFavorite } = useMatches();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [matchSearch, setMatchSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  if (loading) return <LoadingPage />;

  const totalMatches = matches.length;
  const liveMatchesCount = matches.filter(isLiveMatch).length;
  const upcomingMatchesCount = matches.filter(isUpcomingMatch).length;
  const favoriteMatchesCount = matches.filter((match) => match.isFavorite).length;

  const summaryCards = [
    {
      label: "Total fixtures",
      value: totalMatches,
      icon: Globe,
      accent: "bg-primary/10 text-primary",
    },
    {
      label: "Live now",
      value: liveMatchesCount,
      icon: Activity,
      accent: "bg-destructive/10 text-destructive",
    },
    {
      label: "Upcoming today",
      value: upcomingMatchesCount,
      icon: Clock,
      accent: "bg-accent/10 text-accent",
    },
    {
      label: "Favorites",
      value: favoriteMatchesCount,
      icon: Star,
      accent: "bg-amber-100/50 text-amber-500",
    },
  ] as const;

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All matches" },
    { value: "live", label: "Live now" },
    { value: "upcoming", label: "Upcoming" },
    { value: "favorites", label: "Favorites" },
  ];

  const normalizedMatchQuery = matchSearch.trim().toLowerCase();

  const filteredMatches = matches.filter((match) => {
    if (statusFilter === "live" && !isLiveMatch(match)) return false;
    if (statusFilter === "upcoming" && !isUpcomingMatch(match)) return false;
    if (statusFilter === "favorites" && !match.isFavorite) return false;

    if (normalizedMatchQuery) {
      const haystack =
        `${match.homeTeam} ${match.awayTeam} ${match.league ?? ""} ${match.country ?? ""}`.toLowerCase();
      if (!haystack.includes(normalizedMatchQuery)) return false;
    }

    return true;
  });

  const filtersApplied = Boolean(
    normalizedMatchQuery || countryFilter.trim() || statusFilter !== "all"
  );

  const handleResetFilters = () => {
    setMatchSearch("");
    setCountryFilter("");
    setStatusFilter("all");
  };

  // Group matches by country, then by league
  const matchesByCountry = filteredMatches.reduce(
    (acc, match) => {
      const country = match.country ?? "International";
      const league = match.league ?? "Other";

      if (!acc[country]) {
        acc[country] = {};
      }

      if (!acc[country][league]) {
        acc[country][league] = [];
      }

      acc[country][league].push(match);
      return acc;
    },
    {} as Record<string, Record<string, Match[]>>
  );

  const normalizedFilter = countryFilter.trim().toLowerCase();
  const countriesData = Object.entries(matchesByCountry)
    .map(([country, leagues]) => {
      const matchCount = Object.values(leagues).reduce(
        (sum, leagueMatches) => sum + leagueMatches.length,
        0
      );
      return {
        country,
        leagues,
        matchCount,
      };
    })
    .filter(({ country }) =>
      normalizedFilter ? country.toLowerCase().includes(normalizedFilter) : true
    )
    .sort((countryA, countryB) => {
      const rankA = PRIORITY_COUNTRY_RANK.get(countryA.country.toLowerCase());
      const rankB = PRIORITY_COUNTRY_RANK.get(countryB.country.toLowerCase());

      if (rankA !== undefined && rankB !== undefined) {
        return rankA - rankB;
      }
      if (rankA !== undefined) {
        return -1;
      }
      if (rankB !== undefined) {
        return 1;
      }
      return countryA.country.localeCompare(countryB.country);
    });

  const renderTeam = (team: {
    name: string;
    logo: string;
    label: string;
    alignRight?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 ${team.alignRight ? "flex-row-reverse text-right" : ""}`}
    >
      <Avatar className="size-11 border border-border/60 shadow-sm">
        <AvatarImage src={team.logo} alt={team.name} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
          {getInitials(team.name)}
        </AvatarFallback>
      </Avatar>
      <div className={`space-y-1 ${team.alignRight ? "text-right" : "text-left"}`}>
        <p className="text-sm font-semibold text-foreground">{team.name}</p>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
          {team.label}
        </Badge>
      </div>
    </div>
  );

  const handleAnalysisClick = (match: Match) => {
    setSelectedMatch(match);
    setChatOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary pt-16 pb-16 md:pb-0">
      <TopNav />
      <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Today's Matches
          </h1>
          <p className="text-sm text-muted-foreground">Select a match to get AI-powered analysis</p>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="max-w-6xl mx-auto space-y-6 pb-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card) => (
              <Card key={card.label} className="border-border/70 bg-card/70 backdrop-blur">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {card.label}
                    </p>
                    <p className="text-2xl font-semibold text-foreground">{card.value}</p>
                  </div>
                  <div className={`rounded-2xl p-3 ${card.accent}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4 rounded-3xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-lg">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  className="pl-10"
                  placeholder="Search clubs, leagues, or matchups..."
                  value={matchSearch}
                  onChange={(event) => setMatchSearch(event.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={statusFilter === option.value ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full ${
                      statusFilter === option.value ? "" : "border-border/60"
                    }`}
                    onClick={() => setStatusFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative w-full md:max-w-sm">
                <Globe
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  className="pl-10"
                  placeholder="Focus on a specific country..."
                  value={countryFilter}
                  onChange={(event) => setCountryFilter(event.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
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
                {filtersApplied && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-xs text-muted-foreground hover:text-primary"
                    onClick={handleResetFilters}
                  >
                    Reset filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          {countriesData.length === 0 ? (
            <Card className="border border-dashed bg-card/40">
              <CardContent className="py-8 text-center text-muted-foreground">
                No matches fit your filters yet. Try adjusting your search or filters.
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {countriesData.map(({ country, leagues, matchCount }) => (
                <AccordionItem
                  key={country}
                  value={country}
                  className="rounded-2xl border bg-card/40 px-4"
                >
                  <AccordionTrigger className="text-lg font-semibold text-foreground">
                    <div className="flex w-full items-center justify-between">
                      <span>{country}</span>
                      <Badge variant="secondary" className="text-xs font-semibold">
                        {matchCount} {matchCount === 1 ? "Match" : "Matches"}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 pt-2">
                      {Object.entries(leagues)
                        .sort(([leagueA], [leagueB]) => leagueA.localeCompare(leagueB))
                        .map(([league, leagueMatches]) => (
                          <div key={league} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="size-8">
                                <AvatarImage
                                  src={leagueMatches[0].leagueIcon}
                                  alt={league}
                                  width={24}
                                  height={24}
                                />
                                <AvatarFallback className="bg-primary/10">
                                  {leagueMatches[0].leagueIcon?.split("/").pop()?.split(".")[0] ??
                                    league
                                      .split(" ")
                                      .map((name) => name[0])
                                      .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <h3 className="text-base font-semibold text-foreground">{league}</h3>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {leagueMatches.map((match) => {
                                const kickoffLabel = formatKickoffTime(match.kickoffTime);
                                const statusLabel = getMatchStatusLabel(match);
                                const statusBadgeClasses = getStatusBadgeClasses(match);

                                return (
                                  <Card
                                    key={match.id}
                                    className="group relative overflow-hidden border border-border/60 bg-card/70 backdrop-blur transition hover:border-primary/50"
                                  >
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    <CardContent className="relative z-10 p-5 space-y-5">
                                      <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                                        <Badge
                                          variant="secondary"
                                          className="text-[11px] font-medium"
                                        >
                                          {kickoffLabel}
                                        </Badge>
                                        <Badge
                                          variant="outline"
                                          className={`text-[11px] font-semibold ${statusBadgeClasses}`}
                                        >
                                          {statusLabel}
                                        </Badge>
                                      </div>

                                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                                        {renderTeam({
                                          name: match.homeTeam,
                                          logo: match.homeTeamLogo,
                                          label: "Home",
                                        })}

                                        <div className="flex flex-col items-center gap-1 text-xs uppercase tracking-[0.4em] text-muted-foreground">
                                          <span>vs</span>
                                          <span className="text-lg font-semibold tracking-normal text-foreground">
                                            {match.kickoffTime.toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })}
                                          </span>
                                        </div>

                                        {renderTeam({
                                          name: match.awayTeam,
                                          logo: match.awayTeamLogo,
                                          label: "Away",
                                          alignRight: true,
                                        })}
                                      </div>

                                      <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          {match.country && (
                                            <Badge variant="outline" className="text-[11px]">
                                              {match.country}
                                            </Badge>
                                          )}
                                          <span className="font-medium text-foreground/80">
                                            {match.league}
                                          </span>
                                        </div>

                                        <div className="ml-auto flex items-center gap-2">
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className={`rounded-full border border-border/60 text-muted-foreground transition-colors ${
                                              match.isFavorite
                                                ? "text-destructive border-destructive/40"
                                                : ""
                                            }`}
                                            onClick={() => toggleFavorite(match.id)}
                                          >
                                            <Heart
                                              className={`h-4 w-4 ${
                                                match.isFavorite
                                                  ? "fill-current text-destructive"
                                                  : ""
                                              }`}
                                            />
                                          </Button>
                                          {!isFinishedMatch(match) && (
                                            <Button
                                              variant="default"
                                              size="sm"
                                              className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 md:flex-none"
                                              onClick={() => handleAnalysisClick(match)}
                                            >
                                              <MessageSquare className="h-4 w-4" />
                                              Match Insight
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </ScrollArea>

      <ChatDialog match={selectedMatch} open={chatOpen} onOpenChange={setChatOpen} />

      <BottomNav />
    </div>
  );
}
