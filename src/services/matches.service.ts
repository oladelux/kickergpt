import { Observable, from, of, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import {
  api,
  ApiFootballFixture,
  SportmonksFixture,
  SportmonksFixturesRequestOptions,
} from "@/lib/api";

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  league: string;
  leagueId?: string;
  country?: string;
  leagueIcon: string;
  kickoffTime: Date;
  status?: {
    short: string;
    long: string;
    elapsed: number | null;
  };
  isFavorite: boolean;
}

const FAVORITES_STORAGE_KEY = "boot-room:favorites";

class MatchesService {
  private favorites = new Set<string>();
  private matchCache = new Map<string, Match>();

  constructor() {
    this.loadFavoritesFromStorage();
  }

  getMatches(): Observable<Match[]> {
    return from(api.fixtures.getTodayFixtures()).pipe(
      map((response) => response.response.map((fixture) => this.mapFixture(fixture))),
      map((matches) => {
        const normalizedMatches = matches.map((match) => {
          const isFavorite = this.favorites.has(match.id);
          return { ...match, isFavorite };
        });

        this.matchCache.clear();
        normalizedMatches.forEach((match) => this.matchCache.set(match.id, match));

        return normalizedMatches;
      }),
      catchError((error) =>
        throwError(
          () => new Error(error?.message ?? "Failed to load today's fixtures. Please try again.")
        )
      )
    );
  }

  toggleFavorite(matchId: string): Observable<Match> {
    const match = this.matchCache.get(matchId);
    if (!match) {
      return throwError(() => new Error("Match not found"));
    }

    const updated = { ...match, isFavorite: !match.isFavorite };
    if (updated.isFavorite) {
      this.favorites.add(matchId);
    } else {
      this.favorites.delete(matchId);
    }
    this.persistFavorites();
    this.matchCache.set(matchId, updated);
    return of(updated);
  }

  private mapFixture(fixture: ApiFootballFixture): Match {
    const { home, away } = fixture.teams;
    const id = String(fixture.fixture.id);
    const kickoffTime = this.normalizeDate(fixture.fixture.date);

    return {
      id,
      homeTeam: home.name,
      awayTeam: away.name,
      homeTeamLogo: home.logo,
      awayTeamLogo: away.logo,
      league: fixture.league.name,
      leagueId: fixture.league.id ? String(fixture.league.id) : undefined,
      country: fixture.league.country ?? undefined,
      leagueIcon: fixture.league.logo,
      kickoffTime,
      status: fixture.fixture.status,
      isFavorite: this.favorites.has(id),
    };
  }

  private extractTeams(name: string): { homeTeam: string; awayTeam: string } {
    if (!name) {
      return { homeTeam: "Home", awayTeam: "Away" };
    }

    const parts = name.split(/\s+vs\.?\s+|\s+v\s+| - /i).map((part) => part.trim());
    if (parts.length >= 2) {
      return { homeTeam: parts[0], awayTeam: parts[1] };
    }

    return { homeTeam: name, awayTeam: name };
  }

  private emojiForTeam(team: string): string {
    const trimmed = team.trim();
    if (!trimmed) return "⚽";
    const firstChar = Array.from(trimmed)[0];
    const codePoint = firstChar.codePointAt(0);
    if (codePoint && codePoint >= 0x1f300 && codePoint <= 0x1f9ff) {
      return firstChar;
    }
    return firstChar.toUpperCase();
  }

  private normalizeDate(dateString?: string | null): Date {
    if (!dateString) {
      return new Date();
    }

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return new Date();
    }

    return date;
  }

  private loadFavoritesFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        parsed.forEach((id) => {
          if (typeof id === "string" && id.trim()) {
            this.favorites.add(id);
          }
        });
      }
    } catch (error) {
      console.warn("Failed to load favorite fixtures from storage:", error);
    }
  }

  private persistFavorites() {
    if (typeof window === "undefined") return;
    try {
      const serialized = JSON.stringify([...this.favorites]);
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, serialized);
    } catch (error) {
      console.warn("Failed to persist favorite fixtures:", error);
    }
  }
}

export const matchesService = new MatchesService();
