import { Observable, from, of, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import {
  api,
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
  leagueIcon: string;
  kickoffTime: Date;
  isFavorite: boolean;
}

class MatchesService {
  private favorites = new Set<string>();
  private matchCache = new Map<string, Match>();

  getMatches(options?: SportmonksFixturesRequestOptions): Observable<Match[]> {
    return from(api.matches.getTodayFixtures(options)).pipe(
      map((response) =>
        response.data.map((fixture) => this.mapFixture(fixture))
      ),
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
          () =>
            new Error(
              error?.message ?? "Failed to load today's fixtures. Please try again."
            )
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
    this.matchCache.set(matchId, updated);
    return of(updated);
  }

  private mapFixture(fixture: SportmonksFixture): Match {
    const { homeTeam, awayTeam } = this.extractTeams(fixture.name);
    const id = String(fixture.id);
    const kickoffTime = this.normalizeDate(fixture.starting_at);

    return {
      id,
      homeTeam,
      awayTeam,
      homeTeamLogo: this.emojiForTeam(homeTeam),
      awayTeamLogo: this.emojiForTeam(awayTeam),
      league: fixture.league_id ? `League ${fixture.league_id}` : "Unknown League",
      leagueIcon: "⚽",
      kickoffTime,
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
}

export const matchesService = new MatchesService();
