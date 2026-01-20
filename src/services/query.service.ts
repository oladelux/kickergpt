import { Observable, BehaviorSubject, from, of, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import {
  api,
  NaturalQueryResponse,
  NaturalQuerySuggestionsResponse,
  NaturalQueryAvailableCountries,
  NaturalQueryAvailableLeagues,
  NaturalQueryCacheHealth,
} from "@/lib/api";

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

class QueryService {
  private suggestionsCache$ = new BehaviorSubject<NaturalQuerySuggestionsResponse | null>(null);
  private countriesCache$ = new BehaviorSubject<NaturalQueryAvailableCountries | null>(null);
  private leaguesCache$ = new BehaviorSubject<NaturalQueryAvailableLeagues | null>(null);

  private suggestionsCacheTime = 0;
  private countriesCacheTime = 0;
  private leaguesCacheTime = 0;

  search(query: string): Observable<NaturalQueryResponse> {
    return from(api.query.search({ query })).pipe(
      map((response) => response),
      catchError((error) =>
        throwError(() => new Error(error?.message ?? "Search failed. Please try again."))
      )
    );
  }

  getSuggestions(): Observable<NaturalQuerySuggestionsResponse> {
    const cached = this.suggestionsCache$.getValue();
    const isCacheValid = cached && Date.now() - this.suggestionsCacheTime < CACHE_TTL_MS;

    if (isCacheValid && cached) {
      return of(cached);
    }

    return from(api.query.getSuggestions()).pipe(
      tap((response) => {
        this.suggestionsCache$.next(response);
        this.suggestionsCacheTime = Date.now();
      }),
      catchError((error) =>
        throwError(() => new Error(error?.message ?? "Failed to load suggestions."))
      )
    );
  }

  getAvailableCountries(): Observable<NaturalQueryAvailableCountries> {
    const cached = this.countriesCache$.getValue();
    const isCacheValid = cached && Date.now() - this.countriesCacheTime < CACHE_TTL_MS;

    if (isCacheValid && cached) {
      return of(cached);
    }

    return from(api.query.getAvailableCountries()).pipe(
      tap((response) => {
        this.countriesCache$.next(response);
        this.countriesCacheTime = Date.now();
      }),
      catchError((error) =>
        throwError(() => new Error(error?.message ?? "Failed to load countries."))
      )
    );
  }

  getAvailableLeagues(): Observable<NaturalQueryAvailableLeagues> {
    const cached = this.leaguesCache$.getValue();
    const isCacheValid = cached && Date.now() - this.leaguesCacheTime < CACHE_TTL_MS;

    if (isCacheValid && cached) {
      return of(cached);
    }

    return from(api.query.getAvailableLeagues()).pipe(
      tap((response) => {
        this.leaguesCache$.next(response);
        this.leaguesCacheTime = Date.now();
      }),
      catchError((error) =>
        throwError(() => new Error(error?.message ?? "Failed to load leagues."))
      )
    );
  }

  getCacheHealth(): Observable<NaturalQueryCacheHealth> {
    return from(api.query.getCacheHealth()).pipe(
      catchError((error) =>
        throwError(() => new Error(error?.message ?? "Failed to check cache health."))
      )
    );
  }

  clearCache(): void {
    this.suggestionsCache$.next(null);
    this.countriesCache$.next(null);
    this.leaguesCache$.next(null);
    this.suggestionsCacheTime = 0;
    this.countriesCacheTime = 0;
    this.leaguesCacheTime = 0;
  }
}

export const queryService = new QueryService();
