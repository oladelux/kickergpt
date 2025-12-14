import { Observable, from, of, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { api, SportmonksFixture, SportmonksFixtureState } from "@/lib/api";

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  league: string;
  leagueId?: string;
  leagueKey: string;
  country?: string;
  leagueIcon: string;
  kickoffTime: Date;
  status?: SportmonksFixtureState;
  isFavorite: boolean;
}

// Utility function to generate unique league keys
const generateLeagueKey = (leagueId?: string, country?: string, leagueName?: string): string => {
  // Use leagueId as the primary unique identifier when available
  if (leagueId) {
    return `id::${leagueId}`;
  }
  // Fall back to composite key using country and league name
  const countryPart = country ?? "unknown";
  const leaguePart = leagueName ?? "Unknown League";
  return `${countryPart}::${leaguePart}`;
};

const FAVORITES_STORAGE_KEY = "boot-room:favorites";

class MatchesService {
  private favorites = new Set<string>();
  private matchCache = new Map<string, Match>();

  constructor() {
    this.loadFavoritesFromStorage();
  }

  getMatches(): Observable<Match[]> {
    return from(api.fixtures.getTodayFixtures({ timezone: this.getUserTimezone() })).pipe(
      map((response) => response.data.map((fixture) => this.mapFixture(fixture))),
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

  private mapFixture(fixture: SportmonksFixture): Match {
    const id = String(fixture.id);
    const kickoffTime = this.normalizeDate(fixture.starting_at);
    const participants = this.resolveParticipants(fixture.participants, fixture.name);
    const leagueName = fixture.league?.name ?? "Unknown League";
    const leagueId = fixture.league?.id ? String(fixture.league.id) : undefined;
    const country = fixture.league?.country?.name ?? undefined;

    return {
      id,
      homeTeam: participants.home.name,
      awayTeam: participants.away.name,
      homeTeamLogo: participants.home.logo,
      awayTeamLogo: participants.away.logo,
      league: leagueName,
      leagueId,
      leagueKey: generateLeagueKey(leagueId, country, leagueName),
      country,
      leagueIcon: fixture.league?.image_path ?? "",
      kickoffTime,
      status: this.normalizeState(fixture.state),
      isFavorite: this.favorites.has(id),
    };
  }

  private resolveParticipants(
    participants: SportmonksFixture["participants"] = [],
    fallbackName: string
  ) {
    const teamsFromName = this.extractTeams(fallbackName);
    const home =
      participants.find((participant) => this.getParticipantLocation(participant) === "home") ??
      participants[0];
    const away =
      participants.find((participant) => this.getParticipantLocation(participant) === "away") ??
      participants[1];

    return {
      home: {
        name: home?.name ?? home?.meta?.name ?? teamsFromName.homeTeam,
        logo: home?.image_path ?? "",
      },
      away: {
        name: away?.name ?? away?.meta?.name ?? teamsFromName.awayTeam,
        logo: away?.image_path ?? "",
      },
    };
  }

  private getParticipantLocation(
    participant?: SportmonksFixture["participants"][number]
  ): string | null {
    const location = participant?.meta?.location;
    if (typeof location === "string") {
      return location.toLowerCase();
    }
    return null;
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

  private normalizeState(
    state?: SportmonksFixtureState | null
  ): SportmonksFixtureState | undefined {
    if (!state) return undefined;

    return {
      ...state,
      state: typeof state.state === "string" ? state.state.trim() : state.state,
      name: typeof state.name === "string" ? state.name.trim() : state.name,
      short_name: typeof state.short_name === "string" ? state.short_name.trim() : state.short_name,
      developer_name:
        typeof state.developer_name === "string"
          ? state.developer_name.trim()
          : state.developer_name,
    };
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

  private getUserTimezone(): string | undefined {
    if (typeof Intl === "undefined" || typeof Intl.DateTimeFormat !== "function") {
      return undefined;
    }
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return undefined;
    }
  }
}

export const matchesService = new MatchesService();
