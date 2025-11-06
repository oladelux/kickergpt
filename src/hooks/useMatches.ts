import { useState, useEffect } from "react";
import { matchesService, Match } from "@/services/matches.service";
import type { SportmonksFixturesRequestOptions } from "@/lib/api";

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = (options?: SportmonksFixturesRequestOptions) => {
    setLoading(true);
    setError(null);

    matchesService.getMatches(options).subscribe({
      next: (data) => {
        setMatches(data);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const toggleFavorite = (matchId: string) => {
    matchesService.toggleFavorite(matchId).subscribe({
      next: (updatedMatch) => {
        setMatches((prev) => prev.map((m) => (m.id === updatedMatch.id ? updatedMatch : m)));
      },
      error: (err) => {
        setError(err.message);
      },
    });
  };

  return {
    matches,
    loading,
    error,
    toggleFavorite,
    reload: loadMatches,
  };
};
