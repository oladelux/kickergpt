import { memo, useState, useCallback } from "react";
import { MessageSquare, ChevronDown, ChevronUp, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NaturalQueryAnalyzedMatch } from "@/lib/api";
import { getConfidenceColorClasses } from "@/lib/utils";

interface NaturalQueryResultCardProps {
  match: NaturalQueryAnalyzedMatch;
  onAnalyzeClick: (match: NaturalQueryAnalyzedMatch) => void;
}

const getInitials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 3)
    .toUpperCase() || "?";

const formatPredictionType = (type: string): string => {
  const typeLabels: Record<string, string> = {
    over_1_5_goals: "Over 1.5 Goals",
    over_2_5_goals: "Over 2.5 Goals",
    btts: "BTTS",
    result: "Match Result",
    home_win: "Home Win",
    away_win: "Away Win",
    draw: "Draw",
    high_scoring: "High Scoring",
  };
  return typeLabels[type] ?? type;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const NaturalQueryResultCard = memo(function NaturalQueryResultCard({
  match,
  onAnalyzeClick,
}: NaturalQueryResultCardProps) {
  const [showFactors, setShowFactors] = useState(false);

  const { fixture, prediction, relevantFactors } = match;

  const toggleFactors = useCallback(() => {
    setShowFactors((prev) => !prev);
  }, []);

  const handleAnalyze = useCallback(() => {
    onAnalyzeClick(match);
  }, [match, onAnalyzeClick]);

  return (
    <div className="rounded-lg border border-border bg-card p-3 sm:p-4 space-y-3">
      {/* Teams Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Home Team */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar className="size-8 sm:size-10 flex-shrink-0">
              <AvatarImage src={fixture.homeTeam.logo ?? undefined} alt={fixture.homeTeam.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {getInitials(fixture.homeTeam.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm sm:text-base font-medium truncate">
              {fixture.homeTeam.name}
            </span>
          </div>

          <span className="text-muted-foreground text-sm flex-shrink-0 px-2">vs</span>

          {/* Away Team */}
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className="text-sm sm:text-base font-medium truncate text-right">
              {fixture.awayTeam.name}
            </span>
            <Avatar className="size-8 sm:size-10 flex-shrink-0">
              <AvatarImage src={fixture.awayTeam.logo ?? undefined} alt={fixture.awayTeam.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {getInitials(fixture.awayTeam.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* League and Date Info */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          {fixture.league.logo && (
            <img
              src={fixture.league.logo}
              alt={fixture.league.name}
              className="h-4 w-4 object-contain"
            />
          )}
          <span>{fixture.league.name}</span>
          {fixture.league.country && (
            <>
              <span>-</span>
              <span>{fixture.league.country}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(fixture.date)}</span>
        </div>
        {fixture.venue?.name && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{fixture.venue.name}</span>
          </div>
        )}
      </div>

      {/* Prediction */}
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="text-xs font-medium">
            {formatPredictionType(prediction.type)}
          </Badge>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-xs font-semibold bg-primary/20 text-primary border-primary/30"
            >
              {Math.round(prediction.probability)}%
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs font-semibold capitalize ${getConfidenceColorClasses(prediction.confidence)}`}
            >
              {prediction.confidence}
            </Badge>
          </div>
        </div>

        <p className="text-sm font-medium text-primary">{prediction.predictedOutcome}</p>

        {/* Key Factors */}
        {relevantFactors && relevantFactors.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <button
              type="button"
              onClick={toggleFactors}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {showFactors ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  <span>Hide key factors</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  <span>See key factors ({relevantFactors.length})</span>
                </>
              )}
            </button>
            {showFactors && (
              <div className="space-y-1.5 mt-2">
                {relevantFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-sm text-muted-foreground mt-0.5">-</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{factor.name}</p>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {factor.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action */}
      <Button
        variant="default"
        size="sm"
        className="w-full gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"
        onClick={handleAnalyze}
      >
        <MessageSquare className="h-4 w-4" />
        Analyze Match
      </Button>
    </div>
  );
});
