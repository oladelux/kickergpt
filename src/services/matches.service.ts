import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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
  private mockMatches: Match[] = [
    {
      id: '1',
      homeTeam: 'Manchester United',
      awayTeam: 'Liverpool',
      homeTeamLogo: '🔴',
      awayTeamLogo: '🔴',
      league: 'Premier League',
      leagueIcon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      kickoffTime: new Date(Date.now() + 3600000),
      isFavorite: false,
    },
    {
      id: '2',
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea',
      homeTeamLogo: '🔴',
      awayTeamLogo: '🔵',
      league: 'Premier League',
      leagueIcon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      kickoffTime: new Date(Date.now() + 7200000),
      isFavorite: true,
    },
    {
      id: '3',
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      homeTeamLogo: '⚪',
      awayTeamLogo: '🔵',
      league: 'La Liga',
      leagueIcon: '🇪🇸',
      kickoffTime: new Date(Date.now() + 10800000),
      isFavorite: false,
    },
    {
      id: '4',
      homeTeam: 'Bayern Munich',
      awayTeam: 'Borussia Dortmund',
      homeTeamLogo: '🔴',
      awayTeamLogo: '🟡',
      league: 'Bundesliga',
      leagueIcon: '🇩🇪',
      kickoffTime: new Date(Date.now() + 14400000),
      isFavorite: false,
    },
    {
      id: '5',
      homeTeam: 'PSG',
      awayTeam: 'Marseille',
      homeTeamLogo: '🔵',
      awayTeamLogo: '⚪',
      league: 'Ligue 1',
      leagueIcon: '🇫🇷',
      kickoffTime: new Date(Date.now() + 18000000),
      isFavorite: true,
    },
  ];

  getMatches(): Observable<Match[]> {
    return of(this.mockMatches).pipe(delay(500));
  }

  toggleFavorite(matchId: string): Observable<Match> {
    const match = this.mockMatches.find((m) => m.id === matchId);
    if (match) {
      match.isFavorite = !match.isFavorite;
      return of(match).pipe(delay(300));
    }
    throw new Error('Match not found');
  }
}

export const matchesService = new MatchesService();
