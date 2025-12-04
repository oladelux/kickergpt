import { useEffect, useState, useMemo } from "react";
import { Activity, Clock, Globe, Heart, MessageSquare, Search, Star, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import ChatDialog from "@/components/ChatDialog";
import FixturesLeftSidebar from "@/components/FixturesLeftSidebar";
import FixturesRightSidebar from "@/components/FixturesRightSidebar";
import { useMatches } from "@/hooks/useMatches";
import { Match } from "@/services/matches.service";
import { LoadingPage } from "@/components/LoadingPage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSubscriptionData } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";

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

// European league priorities (higher number = higher priority)
const EUROPEAN_LEAGUE_PRIORITIES: Record<string, number> = {
  "Premier League": 100,
  "La Liga": 95,
  "Serie A": 90,
  Bundesliga: 85,
  "Ligue 1": 80,
  "Champions League": 75,
  "Europa League": 70,
  "Conference League": 65,
  Eredivisie: 60,
  "Primeira Liga": 55,
  "Super Lig": 50,
  Premiership: 45,
  Championship: 40,
  "La Liga 2": 35,
  "Serie B": 30,
  "2. Bundesliga": 25,
};

const getLeaguePriority = (league: string): number => {
  return EUROPEAN_LEAGUE_PRIORITIES[league] ?? 0;
};

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

const normalizeStatusCode = (value?: string | null) =>
  (typeof value === "string" ? value.trim().toUpperCase() : null) ?? null;

const getStatusCodes = (match: Match) => {
  const developer = normalizeStatusCode(match.status?.developer_name);
  const short = normalizeStatusCode(match.status?.short_name);
  const state = normalizeStatusCode(match.status?.state);
  const name = normalizeStatusCode(match.status?.name);
  return { developer, short, state, name };
};

const getComparableStatusCodes = (match: Match) => {
  const { developer, short, state, name } = getStatusCodes(match);
  return [developer, short, state, name].filter(Boolean) as string[];
};

const isLiveMatch = (match: Match) => {
  const codes = getComparableStatusCodes(match);
  return codes.some(
    (code) =>
      LIVE_DEVELOPER_CODES.has(code) || LIVE_SHORT_CODES.has(code) || code.startsWith("INPLAY")
  );
};

const isFinishedMatch = (match: Match) => {
  const codes = getComparableStatusCodes(match);
  return codes.some((code) => FINISHED_STATUS_CODES.has(code));
};

const isUpcomingMatch = (match: Match) => {
  const codes = getComparableStatusCodes(match);
  if (!codes.length) return true;
  if (codes.some((code) => UPCOMING_STATUS_CODES.has(code))) return true;
  return !isLiveMatch(match) && !isFinishedMatch(match);
};

const getMatchStatusLabel = (match: Match) => {
  const { developer, short, state } = getStatusCodes(match);
  const codes = [short, developer, state].filter(Boolean) as string[];

  if (!codes.length || codes.some((code) => UPCOMING_STATUS_CODES.has(code))) {
    return getTimeUntilKickoff(match.kickoffTime);
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

  return readableLabel ?? getTimeUntilKickoff(match.kickoffTime);
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

export default function Chat() {
  const { matches, loading, toggleFavorite } = useMatches();
  const { user, isAuthenticated } = useAuth();
  const {
    plan: subscriptionPlan,
    usage,
    loading: subscriptionLoading,
    error: subscriptionError,
    refreshUsage,
    refreshAll,
  } = useSubscriptionData();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [matchSearch, setMatchSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Ensure user data stays fresh when authenticated
      refreshAll();
    }
  }, [isAuthenticated, user, refreshAll]);

  const normalizedMatchQuery = matchSearch.trim().toLowerCase();

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      if (statusFilter === "live" && !isLiveMatch(match)) return false;
      if (statusFilter === "upcoming" && !isUpcomingMatch(match)) return false;
      if (statusFilter === "favorites" && !match.isFavorite) return false;

      if (selectedLeague && match.league !== selectedLeague) return false;

      const normalizedCountryFilter = countryFilter.trim().toLowerCase();
      if (normalizedCountryFilter && match.country?.toLowerCase() !== normalizedCountryFilter) {
        return false;
      }

      if (normalizedMatchQuery) {
        const haystack =
          `${match.homeTeam} ${match.awayTeam} ${match.league ?? ""} ${match.country ?? ""}`.toLowerCase();
        if (!haystack.includes(normalizedMatchQuery)) return false;
      }

      return true;
    });
  }, [matches, statusFilter, selectedLeague, countryFilter, normalizedMatchQuery]);

  // Group matches by league, prioritizing European leagues
  const matchesByLeague = useMemo(() => {
    const grouped: Record<string, Match[]> = {};

    filteredMatches.forEach((match) => {
      const league = match.league ?? "Other";
      if (!grouped[league]) {
        grouped[league] = [];
      }
      grouped[league].push(match);
    });

    // Sort leagues by priority (European leagues first), then alphabetically
    return Object.entries(grouped).sort(([leagueA, matchesA], [leagueB, matchesB]) => {
      const priorityA = getLeaguePriority(leagueA);
      const priorityB = getLeaguePriority(leagueB);

      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Higher priority first
      }

      return leagueA.localeCompare(leagueB);
    });
  }, [filteredMatches]);

  if (loading || subscriptionLoading) return <LoadingPage />;

  const totalMatches = matches.length;
  const liveMatchesCount = matches.filter(isLiveMatch).length;
  const upcomingMatchesCount = matches.filter(isUpcomingMatch).length;
  const favoriteMatchesCount = matches.filter((match) => match.isFavorite).length;

  const summaryCards = [
    {
      label: "Today's fixtures",
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

  const filtersApplied = Boolean(
    normalizedMatchQuery || countryFilter.trim() || statusFilter !== "all" || selectedLeague
  );

  const handleResetFilters = () => {
    setMatchSearch("");
    setCountryFilter("");
    setStatusFilter("all");
    setSelectedLeague(null);
  };

  const renderCompactMatchRow = (match: Match) => {
    const statusLabel = getMatchStatusLabel(match);
    const statusBadgeClasses = getStatusBadgeClasses(match);
    const kickoffTime = match.kickoffTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div
        key={match.id}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 border-b border-border/50 hover:bg-card/50 transition-colors group"
      >
        {/* Mobile: Top row with teams */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 w-full sm:w-auto">
          <Avatar className="size-7 sm:size-8 flex-shrink-0">
            <AvatarImage src={match.homeTeamLogo} alt={match.homeTeam} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(match.homeTeam)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs sm:text-sm font-medium text-foreground truncate flex-1 min-w-0">
            {match.homeTeam}
          </span>
          <span className="text-xs text-muted-foreground sm:hidden flex-shrink-0">vs</span>
          <span className="text-xs sm:text-sm font-medium text-foreground truncate sm:hidden min-w-0 max-w-[100px]">
            {match.awayTeam}
          </span>
        </div>

        {/* Desktop: Status and time */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <Badge variant="outline" className={`text-xs font-semibold ${statusBadgeClasses}`}>
            {statusLabel}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono w-12 text-center">
            {kickoffTime}
          </span>
        </div>

        {/* Mobile: Status and time */}
        <div className="flex sm:hidden items-center gap-1.5 w-full justify-between min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-shrink">
            <Badge
              variant="outline"
              className={`text-[10px] sm:text-xs font-semibold ${statusBadgeClasses} flex-shrink-0`}
            >
              {statusLabel}
            </Badge>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-mono whitespace-nowrap flex-shrink-0">
              {kickoffTime}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex-shrink-0 ${
                match.isFavorite
                  ? "text-destructive"
                  : "text-muted-foreground hover:text-destructive"
              }`}
              onClick={() => toggleFavorite(match.id)}
            >
              <Heart
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${match.isFavorite ? "fill-current" : ""}`}
              />
            </Button>
            {!isFinishedMatch(match) && (
              <Button
                variant="default"
                size="sm"
                className="h-7 sm:h-8 gap-1 px-2 sm:px-3 bg-gradient-to-r from-primary to-accent text-primary-foreground flex-shrink-0"
                onClick={() => handleAnalysisClick(match)}
              >
                <MessageSquare className="h-3 w-3" />
                <span className="text-[10px] sm:text-xs">Analyze</span>
              </Button>
            )}
          </div>
        </div>

        {/* Desktop: Away team */}
        <div className="hidden sm:flex items-center gap-3 flex-1 min-w-0 justify-end">
          <span className="text-sm font-medium text-foreground truncate text-right">
            {match.awayTeam}
          </span>
          <Avatar className="size-8 flex-shrink-0">
            <AvatarImage src={match.awayTeamLogo} alt={match.awayTeam} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(match.awayTeam)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Desktop: Actions */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${
              match.isFavorite ? "text-destructive" : "text-muted-foreground hover:text-destructive"
            }`}
            onClick={() => toggleFavorite(match.id)}
          >
            <Heart className={`h-4 w-4 ${match.isFavorite ? "fill-current" : ""}`} />
          </Button>
          {!isFinishedMatch(match) && (
            <Button
              variant="default"
              size="sm"
              className="h-8 gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"
              onClick={() => handleAnalysisClick(match)}
            >
              <MessageSquare className="h-3 w-3" />
              <span className="text-xs">Analyze</span>
            </Button>
          )}
        </div>
      </div>
    );
  };

  const handleAnalysisClick = (match: Match) => {
    setSelectedMatch(match);
    setChatOpen(true);
  };

  return (
    <>
      <div className="h-screen flex flex-col bg-background pt-16 pb-16 md:pb-0">
        <TopNav />

        {/* Mobile: Filter buttons */}
        <div className="lg:hidden flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 border-b border-border bg-card overflow-x-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-8 sm:h-9 gap-1.5 sm:gap-2 flex-shrink-0"
            onClick={() => setLeftSidebarOpen(true)}
          >
            <Menu className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-[10px] sm:text-xs">Filters</span>
          </Button>
          {selectedLeague && (
            <Badge
              variant="secondary"
              className="text-[10px] sm:text-xs flex-shrink-0 truncate max-w-[150px]"
            >
              {selectedLeague}
            </Badge>
          )}
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Desktop */}
          <div className="hidden lg:block flex-shrink-0">
            <FixturesLeftSidebar
              matches={matches}
              selectedLeague={selectedLeague}
              onLeagueSelect={setSelectedLeague}
              countryFilter={countryFilter}
              onCountryFilterChange={setCountryFilter}
            />
          </div>

          {/* Left Sidebar - Mobile */}
          <Sheet open={leftSidebarOpen} onOpenChange={setLeftSidebarOpen}>
            <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
              <FixturesLeftSidebar
                matches={matches}
                selectedLeague={selectedLeague}
                onLeagueSelect={(league) => {
                  setSelectedLeague(league);
                  setLeftSidebarOpen(false);
                }}
                countryFilter={countryFilter}
                onCountryFilterChange={setCountryFilter}
              />
            </SheetContent>
          </Sheet>

          {/* Main Content */}
          <ScrollArea className="flex-1 p-2 sm:p-4">
            <div className="max-w-full mx-auto space-y-4 sm:space-y-6 pb-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((card) => (
                  <Card key={card.label} className="border-border bg-card">
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

              {subscriptionError && (
                <Card className="border-destructive/50 bg-destructive/5 text-sm text-destructive">
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <span>{subscriptionError}</span>
                    <Button variant="outline" size="sm" onClick={refreshAll}>
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col gap-2 sm:gap-3 rounded-lg border border-border bg-card p-2 sm:p-3">
                <div className="relative flex-1 min-w-0">
                  <Search
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={14}
                  />
                  <Input
                    className="pl-8 sm:pl-10 h-8 sm:h-9 text-xs sm:text-sm"
                    placeholder="Search clubs, leagues..."
                    value={matchSearch}
                    onChange={(event) => setMatchSearch(event.target.value)}
                  />
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  {statusOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={statusFilter === option.value ? "default" : "outline"}
                      size="sm"
                      className={`h-8 sm:h-9 text-[10px] sm:text-xs rounded-full flex-shrink-0 px-2 sm:px-3 ${
                        statusFilter === option.value ? "" : "border-border/60"
                      }`}
                      onClick={() => setStatusFilter(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                  {filtersApplied && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 sm:h-9 text-[10px] sm:text-xs text-muted-foreground hover:text-primary flex-shrink-0 px-2"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {matchesByLeague.length === 0 ? (
                <Card className="border border-dashed bg-card">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No matches fit your filters yet. Try adjusting your search or filters.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {matchesByLeague.map(([league, leagueMatches]) => {
                    const leaguePriority = getLeaguePriority(league);
                    const isPriorityLeague = leaguePriority > 0;

                    return (
                      <Card
                        key={league}
                        className={`border bg-card ${
                          isPriorityLeague ? "border-primary/30" : "border-border"
                        }`}
                      >
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 px-4 py-3 border-b border-border bg-muted/50">
                            <div className="flex items-center flex-1 min-w-0">
                              <Avatar className="size-7 flex-shrink-0 mr-3">
                                <AvatarImage src={leagueMatches[0]?.leagueIcon} alt={league} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {league
                                    .split(" ")
                                    .map((name) => name[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <h3 className="text-sm font-bold text-foreground flex-1 min-w-0 truncate sm:mr-4">
                                {league}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                              {leagueMatches[0]?.country && (
                                <div className="flex items-center gap-3 sm:mr-3">
                                  <div className="hidden sm:block h-5 w-px bg-border flex-shrink-0" />
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-medium px-2.5 py-0.5 flex-shrink-0"
                                  >
                                    {leagueMatches[0].country}
                                  </Badge>
                                </div>
                              )}
                              <div className="flex items-center gap-3">
                                <div className="hidden sm:block h-5 w-px bg-border flex-shrink-0" />
                                <Badge
                                  variant="secondary"
                                  className="text-xs font-semibold px-2.5 py-0.5 flex-shrink-0 bg-muted text-muted-foreground"
                                >
                                  {leagueMatches.length}{" "}
                                  {leagueMatches.length === 1 ? "match" : "matches"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="divide-y divide-border/50">
                            {leagueMatches.map((match) => renderCompactMatchRow(match))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Right Sidebar - Desktop */}
          <div className="hidden xl:block flex-shrink-0">
            <FixturesRightSidebar />
          </div>

          {/* Right Sidebar - Mobile */}
          <Sheet open={rightSidebarOpen} onOpenChange={setRightSidebarOpen}>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
              <FixturesRightSidebar />
            </SheetContent>
          </Sheet>
        </div>

        <ChatDialog
          match={selectedMatch}
          open={chatOpen}
          onOpenChange={setChatOpen}
          usage={usage}
          plan={subscriptionPlan}
          onAnalysisComplete={refreshUsage}
          onPromptLimitReached={refreshUsage}
        />

        <BottomNav />
      </div>
    </>
  );
}
