import { useCallback, KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { track } from "@vercel/analytics";

interface NaturalQuerySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions: string[];
  loading: boolean;
  placeholder?: string;
  promptsRemainingText?: string | null;
  limitReached?: boolean;
  onDismissLimit?: () => void;
}

export function NaturalQuerySearchBar({
  value,
  onChange,
  onSearch,
  suggestions,
  loading,
  placeholder = 'Try "BTTS from England today" or "Over 2.5 goals tomorrow"',
  promptsRemainingText,
  limitReached,
  onDismissLimit,
}: NaturalQuerySearchBarProps) {
  const handleSearch = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && !loading) {
      onSearch(trimmed);
    }
  }, [value, loading, onSearch]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      onChange(suggestion);
      onSearch(suggestion);
    },
    [onChange, onSearch]
  );

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <div className="w-full space-y-4">
      {/* Prompt limit reached banner */}
      {limitReached && (
        <div className="space-y-3 rounded-2xl border border-destructive/60 bg-destructive/5 p-4">
          <p className="text-sm font-semibold text-destructive">Prompt limit reached</p>
          <p className="text-sm text-muted-foreground">
            Upgrade to Pro or buy add-on credits to continue searching.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
              onClick={() => track("upgrade_click_search_limit_reached")}
            >
              <Link to="/plans">Upgrade / Buy credits</Link>
            </Button>
            {onDismissLimit && (
              <Button variant="outline" size="sm" onClick={onDismissLimit}>
                Dismiss
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-10 pr-10 h-12 text-base"
            disabled={loading || limitReached}
          />
          {value && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} disabled={!value.trim() || loading || limitReached} className="h-12 px-6">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      {/* Prompts remaining display */}
      {promptsRemainingText && !limitReached && (
        <div className="text-center">
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{promptsRemainingText}</span>
          </span>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Try these searches:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 6).map((suggestion, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
