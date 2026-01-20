import { memo } from "react";
import { AlertCircle, Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NaturalQueryAnalyzedMatch, ClassifiedIntent } from "@/lib/api";
import { NaturalQueryResultCard } from "./NaturalQueryResultCard";

interface NaturalQueryResultsProps {
  results: NaturalQueryAnalyzedMatch[];
  summary: string | null;
  clarificationNeeded: string | null;
  followUpSuggestions: string[];
  metadata: { query: string; normalizedQuery: string; intent: ClassifiedIntent } | null;
  onResultClick: (match: NaturalQueryAnalyzedMatch) => void;
  onSuggestionClick: (query: string) => void;
  loading: boolean;
  hasSearched: boolean;
  error: string | null;
}

export const NaturalQueryResults = memo(function NaturalQueryResults({
  results,
  summary,
  clarificationNeeded,
  followUpSuggestions,
  metadata,
  onResultClick,
  onSuggestionClick,
  loading,
  hasSearched,
  error,
}: NaturalQueryResultsProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Searching matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="rounded-full bg-muted p-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Search for matches</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Use natural language to find football matches with predictions. Try searches like "BTTS
            from England today" or "High confidence over 2.5 goals tomorrow".
          </p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="space-y-4">
        {clarificationNeeded && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{clarificationNeeded}</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div className="rounded-full bg-muted p-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No matches found</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Try adjusting your search query or expanding the date range.
            </p>
          </div>
          {followUpSuggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Try these instead:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {followUpSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => onSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      {summary && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-primary font-medium">{summary}</p>
        </div>
      )}

      {/* Clarification if ambiguous */}
      {clarificationNeeded && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{clarificationNeeded}</AlertDescription>
        </Alert>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found <span className="font-semibold text-foreground">{results.length}</span> match
          {results.length !== 1 ? "es" : ""}
          {metadata?.intent.filters.dateRange.type && (
            <span> for {metadata.intent.filters.dateRange.type.replace("_", " ")}</span>
          )}
        </p>
        {metadata?.intent.predictionType && metadata.intent.predictionType !== "any" && (
          <Badge variant="outline" className="text-xs">
            {formatPredictionTypeLabel(metadata.intent.predictionType)}
          </Badge>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((match) => (
          <NaturalQueryResultCard
            key={match.fixture.id}
            match={match}
            onAnalyzeClick={onResultClick}
          />
        ))}
      </div>

      {/* Follow-up Suggestions */}
      {followUpSuggestions.length > 0 && (
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Related searches:</p>
          <div className="flex flex-wrap gap-2">
            {followUpSuggestions.map((suggestion, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

function formatPredictionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    over_1_5_goals: "Over 1.5 Goals",
    over_2_5_goals: "Over 2.5 Goals",
    btts: "BTTS",
    result: "Match Result",
    home_win: "Home Win",
    away_win: "Away Win",
    draw: "Draw",
    high_scoring: "High Scoring",
    any: "All Types",
  };
  return labels[type] ?? type;
}
