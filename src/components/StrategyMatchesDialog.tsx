import { useState } from "react";
import { Loader2, MessageCircle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Strategy, FindMatchesResponse } from "@/types/strategy";
import { KickerGPTFixturesResponse } from "@/lib/api";
import ChatDialog from "./ChatDialog";
import { Match } from "@/services/matches.service";

interface StrategyMatchesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategy: Strategy | null;
  matchesResponse: FindMatchesResponse | null;
  loading: boolean;
  error: string | null;
}

const formatKickoff = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
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
    status: {
      id: 0,
      state: fixture.status.short,
      name: fixture.status.long,
      short_name: fixture.status.short,
      developer_name: fixture.status.short.toLowerCase().replace(/\s+/g, "_"),
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

export function StrategyMatchesDialog({
  open,
  onOpenChange,
  strategy,
  matchesResponse,
  loading,
  error,
}: StrategyMatchesDialogProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {loading
                ? "Finding Matches..."
                : error
                  ? "Error Finding Matches"
                  : `Matches for "${strategy?.name}"`}
            </DialogTitle>
            <DialogDescription>
              {loading
                ? "Evaluating fixtures against your strategy conditions..."
                : error
                  ? "There was an error finding matches for your strategy."
                  : matchCount > 0
                    ? `Found ${matchCount} fixture${matchCount > 1 ? "s" : ""} that match your strategy.`
                    : "No fixtures match your strategy conditions at this time."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Searching for matching fixtures...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="py-12 text-center space-y-4">
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
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && matchCount === 0 && (
              <div className="py-12 text-center space-y-4">
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
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            )}

            {/* Results State */}
            {!loading && !error && matchesResponse && matchesResponse.fixtures.length > 0 && (
              <div className="space-y-6">
                {Object.values(groupedFixtures || {}).map((leagueGroup) => (
                  <div key={leagueGroup.leagueId} className="space-y-3">
                    {/* League Header */}
                    <div className="flex items-center gap-3 pb-2 border-b border-border">
                      {leagueGroup.countryFlag && (
                        <img
                          src={leagueGroup.countryFlag}
                          alt={leagueGroup.country}
                          className="h-5 w-7 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{leagueGroup.country}</h3>
                        <p className="text-xs text-muted-foreground">{leagueGroup.leagueName}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {leagueGroup.fixtures.length} match
                        {leagueGroup.fixtures.length > 1 ? "es" : ""}
                      </Badge>
                    </div>

                    {/* Fixtures in League */}
                    <div className="space-y-3">
                      {leagueGroup.fixtures.map((fixture, index) => (
                        <Card
                          key={`${fixture.id}-${index}`}
                          className="border border-border/60 bg-card/60 backdrop-blur hover:border-primary/50 transition-colors"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1 flex-1">
                                <CardTitle className="text-base flex items-center gap-2">
                                  <span className="flex items-center gap-2">
                                    {fixture.teams.home.logo && (
                                      <img
                                        src={fixture.teams.home.logo}
                                        alt={fixture.teams.home.name}
                                        className="h-5 w-5 object-contain"
                                      />
                                    )}
                                    <span>{fixture.teams.home.name}</span>
                                  </span>
                                  <span className="text-muted-foreground">vs</span>
                                  <span className="flex items-center gap-2">
                                    {fixture.teams.away.logo && (
                                      <img
                                        src={fixture.teams.away.logo}
                                        alt={fixture.teams.away.name}
                                        className="h-5 w-5 object-contain"
                                      />
                                    )}
                                    <span>{fixture.teams.away.name}</span>
                                  </span>
                                </CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {formatKickoff(fixture.timestamp)}
                                </div>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            {/* Strategy Info */}
                            <div className="space-y-2">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Strategy Conditions
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {strategy?.conditions.map((condition) => (
                                  <Badge key={condition.id} variant="secondary" className="text-xs">
                                    {conditionTypeLabels[condition.type] || condition.type}:{" "}
                                    {condition.operator} {condition.value} ({condition.target})
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button className="flex-1" onClick={() => handleChat(fixture)}>
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Analyze Match
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <ChatDialog match={selectedMatch} open={chatOpen} onOpenChange={setChatOpen} />
    </>
  );
}
