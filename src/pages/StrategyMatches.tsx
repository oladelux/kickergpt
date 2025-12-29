import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2, MessageCircle, Clock, ArrowLeft, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import { LoadingPage } from "@/components/LoadingPage";
import { FindMatchesResponse } from "@/types/strategy";
import { KickerGPTFixturesResponse } from "@/lib/api";
import ChatDialog from "@/components/ChatDialog";
import { Match } from "@/services/matches.service";
import { useStrategies } from "@/hooks/useStrategies";
import { useToast } from "@/hooks/use-toast";

const formatKickoff = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to convert KickerGPTFixturesResponse to Match for ChatDialog
const convertToMatch = (fixture: KickerGPTFixturesResponse): Match => {
  return {
    id: String(fixture.id),
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    homeTeamLogo: fixture.teams.home.logo || "",
    awayTeamLogo: fixture.teams.away.logo || "",
    league: fixture.league.name,
    leagueId: String(fixture.league.id),
    leagueKey: `id::${fixture.league.id}`,
    country: fixture.league.country,
    leagueIcon: fixture.league.logo || "",
    kickoffTime: new Date(fixture.timestamp * 1000),
    status: fixture.status
      ? {
          id: 0,
          state: fixture.status.short,
          name: fixture.status.long,
          short_name: fixture.status.short,
          developer_name: fixture.status.short.toLowerCase().replace(/\s+/g, "_"),
        }
      : {
          id: 0,
          state: "NS",
          name: "Not Started",
          short_name: "NS",
          developer_name: "not_started",
        },
    isFavorite: false,
  };
};

const conditionTypeLabels: Record<string, string> = {
  HOME_FORM: "Home Form",
  AWAY_FORM: "Away Form",
  WIN_RATE: "Win Rate",
  HEAD_TO_HEAD: "Head to Head",
  INJURIES: "Injuries",
  GOALS_SCORED: "Goals Scored",
  GOALS_CONCEDED: "Goals Conceded",
  RECENT_GOALS_TOTAL: "Recent Goals Total",
  CLEAN_SHEETS: "Clean Sheets",
  BTTS: "Both Teams To Score",
  H2H_GOALS_SCORED: "Head to Head Goals Scored",
};

export default function StrategyMatchesPage() {
  const { strategyId } = useParams<{ strategyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { strategies, findMatches } = useStrategies();

  const [matchesResponse, setMatchesResponse] = useState<FindMatchesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const strategy = strategies.find((s) => s.id === strategyId);

  useEffect(() => {
    if (!strategyId) {
      navigate("/strategies");
      return;
    }

    const loadMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await findMatches(strategyId);
        setMatchesResponse(response);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to find matches";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [strategyId, findMatches, navigate, toast]);

  const handleChat = (fixture: KickerGPTFixturesResponse) => {
    const match = convertToMatch(fixture);
    setSelectedMatch(match);
    setChatOpen(true);
  };

  const matchCount = matchesResponse?.matchedCount ?? 0;

  // Group fixtures by league
  const groupedFixtures = matchesResponse?.fixtures.reduce(
    (acc, fixture) => {
      const leagueKey = `${fixture.league.id}-${fixture.league.name}`;
      if (!acc[leagueKey]) {
        acc[leagueKey] = {
          leagueId: fixture.league.id,
          leagueName: fixture.league.name,
          country: fixture.league.country,
          countryFlag: fixture.league.flag || "",
          leagueLogo: fixture.league.logo || "",
          fixtures: [],
        };
      }
      acc[leagueKey].fixtures.push(fixture);
      return acc;
    },
    {} as Record<
      string,
      {
        leagueId: number;
        leagueName: string;
        country: string;
        countryFlag: string;
        leagueLogo: string;
        fixtures: KickerGPTFixturesResponse[];
      }
    >
  );

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pb-20 md:pb-4 md:pt-20">
      <TopNav />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/strategies")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Strategies
          </Button>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold">
                  {strategy?.name || "Strategy Matches"}
                </h1>
              </div>
              {strategy?.description && (
                <p className="text-muted-foreground">{strategy.description}</p>
              )}
              {strategy && (
                <div className="flex flex-wrap gap-2">
                  {strategy.conditions.map((condition) => (
                    <Badge key={condition.id} variant="secondary" className="text-xs">
                      {conditionTypeLabels[condition.type] || condition.type}: {condition.operator}{" "}
                      {condition.value} ({condition.target})
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {matchCount > 0 && (
              <Badge className="text-base px-4 py-2">
                {matchCount} Match{matchCount > 1 ? "es" : ""} Found
              </Badge>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="py-12 text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Error Finding Matches</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button variant="outline" onClick={() => navigate("/strategies")}>
                Back to Strategies
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!error && matchCount === 0 && (
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="py-12 text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">No Matches Found</h3>
                <p className="text-sm text-muted-foreground">
                  No fixtures currently match your strategy conditions.
                  <br />
                  Try adjusting your conditions or check back later.
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate("/strategies")}>
                Back to Strategies
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results - Grouped by League */}
        {!error && matchesResponse && matchesResponse.fixtures.length > 0 && (
          <div className="space-y-6">
            {Object.values(groupedFixtures || {}).map((leagueGroup) => (
              <div key={leagueGroup.leagueId} className="space-y-2">
                {/* League Header - More Distinct */}
                <div className="flex items-center gap-3 px-4 py-3 bg-card/80 backdrop-blur border border-border rounded-lg">
                  {leagueGroup.countryFlag && (
                    <img
                      src={leagueGroup.countryFlag}
                      alt={leagueGroup.country}
                      className="h-6 w-8 object-cover rounded shadow-sm"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{leagueGroup.country}</h3>
                    <p className="text-xs text-muted-foreground">{leagueGroup.leagueName}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {leagueGroup.fixtures.length} match
                    {leagueGroup.fixtures.length > 1 ? "es" : ""}
                  </Badge>
                </div>

                {/* Fixtures in League - Compact Rows */}
                <div className="border border-border/60 bg-card/40 backdrop-blur rounded-lg overflow-hidden divide-y divide-border/50">
                  {leagueGroup.fixtures.map((fixture, index) => {
                    const fixtureDate = new Date(fixture.timestamp * 1000);
                    const kickoffTime = fixtureDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const kickoffDate = fixtureDate.toLocaleDateString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <div
                        key={`${fixture.id}-${index}`}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 px-3 sm:px-4 py-3 hover:bg-card/50 transition-colors group"
                      >
                        {/* Teams display - similar to Chat page */}
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:flex-1 min-w-0">
                          {/* Home Team */}
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Avatar className="size-7 sm:size-8 flex-shrink-0">
                              <AvatarImage
                                src={fixture.teams.home.logo || ""}
                                alt={fixture.teams.home.name}
                              />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(fixture.teams.home.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs sm:text-sm font-medium truncate">
                              {fixture.teams.home.name}
                            </span>
                          </div>

                          {/* VS separator */}
                          <span className="text-xs text-muted-foreground flex-shrink-0 px-1">
                            vs
                          </span>

                          {/* Away Team */}
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Avatar className="size-7 sm:size-8 flex-shrink-0">
                              <AvatarImage
                                src={fixture.teams.away.logo || ""}
                                alt={fixture.teams.away.name}
                              />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(fixture.teams.away.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs sm:text-sm font-medium truncate">
                              {fixture.teams.away.name}
                            </span>
                          </div>
                        </div>

                        {/* Date, Time and Action */}
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-shrink-0">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <div className="flex flex-col sm:flex-row sm:gap-1">
                              <span className="font-medium">{kickoffDate}</span>
                              <span className="font-mono">{kickoffTime}</span>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => handleChat(fixture)} className="h-8">
                            <MessageCircle className="h-3 w-3 mr-1.5" />
                            Analyze
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Dialog */}
      <ChatDialog match={selectedMatch} open={chatOpen} onOpenChange={setChatOpen} />
      <BottomNav />
    </div>
  );
}
