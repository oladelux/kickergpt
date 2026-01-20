import { useState, useEffect, useCallback } from "react";
import { queryService } from "@/services/query.service";
import { NaturalQueryAnalyzedMatch, ClassifiedIntent } from "@/lib/api";

export interface UseNaturalQueryReturn {
  results: NaturalQueryAnalyzedMatch[];
  summary: string | null;
  clarificationNeeded: string | null;
  followUpSuggestions: string[];
  metadata: { query: string; normalizedQuery: string; intent: ClassifiedIntent } | null;
  exampleQueries: string[];
  supportedCountries: string[];
  supportedLeagues: string[];
  availableCountries: string[];
  availableLeagues: Array<{ id: number; name: string; country: string }>;
  loading: boolean;
  searching: boolean;
  error: string | null;
  hasSearched: boolean;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
  loadSuggestions: () => void;
  loadCountries: () => void;
  loadLeagues: () => void;
}

export const useNaturalQuery = (): UseNaturalQueryReturn => {
  const [results, setResults] = useState<NaturalQueryAnalyzedMatch[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [clarificationNeeded, setClarificationNeeded] = useState<string | null>(null);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<{
    query: string;
    normalizedQuery: string;
    intent: ClassifiedIntent;
  } | null>(null);

  const [exampleQueries, setExampleQueries] = useState<string[]>([]);
  const [supportedCountries, setSupportedCountries] = useState<string[]>([]);
  const [supportedLeagues, setSupportedLeagues] = useState<string[]>([]);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [availableLeagues, setAvailableLeagues] = useState<
    Array<{ id: number; name: string; country: string }>
  >([]);

  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const loadSuggestions = useCallback(() => {
    setLoading(true);
    queryService.getSuggestions().subscribe({
      next: (data) => {
        setExampleQueries(data.examples);
        setSupportedCountries(data.supportedCountries);
        setSupportedLeagues(data.supportedLeagues);
        setLoading(false);
      },
      error: (err) => {
        console.warn("Failed to load suggestions:", err.message);
        setLoading(false);
      },
    });
  }, []);

  const loadCountries = useCallback(() => {
    queryService.getAvailableCountries().subscribe({
      next: (data) => {
        setAvailableCountries(data.countries);
      },
      error: (err) => {
        console.warn("Failed to load countries:", err.message);
      },
    });
  }, []);

  const loadLeagues = useCallback(() => {
    queryService.getAvailableLeagues().subscribe({
      next: (data) => {
        setAvailableLeagues(data.leagues);
      },
      error: (err) => {
        console.warn("Failed to load leagues:", err.message);
      },
    });
  }, []);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  const search = useCallback((query: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setSearching(true);
      setError(null);

      queryService.search(query).subscribe({
        next: (response) => {
          setResults(response.matches);
          setSummary(response.summary ?? null);
          setClarificationNeeded(response.clarificationNeeded ?? null);
          setFollowUpSuggestions(response.suggestions ?? []);
          setMetadata({
            query: response.metadata.query,
            normalizedQuery: response.metadata.normalizedQuery,
            intent: response.metadata.intent,
          });
          setHasSearched(true);
          setSearching(false);
          resolve();
        },
        error: (err) => {
          setError(err.message);
          setSearching(false);
          reject(err);
        },
      });
    });
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setSummary(null);
    setClarificationNeeded(null);
    setFollowUpSuggestions([]);
    setMetadata(null);
    setError(null);
    setHasSearched(false);
  }, []);

  return {
    results,
    summary,
    clarificationNeeded,
    followUpSuggestions,
    metadata,
    exampleQueries,
    supportedCountries,
    supportedLeagues,
    availableCountries,
    availableLeagues,
    loading,
    searching,
    error,
    hasSearched,
    search,
    clearResults,
    loadSuggestions,
    loadCountries,
    loadLeagues,
  };
};
