import { useMemo } from "react";
import { Match } from "@/services/matches.service";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface FixturesLeftSidebarProps {
  matches: Match[];
  selectedLeague?: string | null;
  onLeagueSelect?: (league: string | null) => void;
  countryFilter: string;
  onCountryFilterChange: (value: string) => void;
}

export default function FixturesLeftSidebar({
  matches,
  selectedLeague,
  onLeagueSelect,
  countryFilter,
  onCountryFilterChange,
}: FixturesLeftSidebarProps) {
  // Group matches by country, then by league
  const countriesWithLeagues = useMemo(() => {
    const grouped: Record<string, Record<string, Match[]>> = {};
    const normalizedFilter = countryFilter.trim().toLowerCase();

    matches.forEach((match) => {
      const country = match.country ?? "International";
      const league = match.league ?? "Other";

      // Filter by country search if provided
      if (normalizedFilter && !country.toLowerCase().includes(normalizedFilter)) {
        return;
      }

      if (!grouped[country]) {
        grouped[country] = {};
      }

      if (!grouped[country][league]) {
        grouped[country][league] = [];
      }

      grouped[country][league].push(match);
    });

    // Convert to array and sort countries alphabetically
    return Object.entries(grouped)
      .map(([country, leagues]) => ({
        country,
        leagues: Object.entries(leagues)
          .map(([league, leagueMatches]) => ({
            league,
            matches: leagueMatches,
            count: leagueMatches.length,
          }))
          .sort((a, b) => a.league.localeCompare(b.league)),
      }))
      .sort((a, b) => a.country.localeCompare(b.country));
  }, [matches, countryFilter]);

  return (
    <div className="h-full w-64 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
          Countries & Leagues
        </h2>
        <div className="relative">
          <Globe
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            className="pl-10 h-9 text-sm"
            placeholder="Search country..."
            value={countryFilter}
            onChange={(event) => onCountryFilterChange(event.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          <Accordion type="multiple" className="w-full">
            {countriesWithLeagues.map(({ country, leagues }) => (
              <AccordionItem key={country} value={country} className="border-none">
                <AccordionTrigger className="py-2 px-3 text-sm font-medium text-foreground hover:no-underline hover:bg-accent/50 rounded-md">
                  <div className="flex items-center justify-between w-full pr-2">
                    <span>{country}</span>
                    <Badge variant="secondary" className="text-xs">
                      {leagues.reduce((sum, l) => sum + l.count, 0)}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-2">
                  <div className="space-y-1 pl-2">
                    {leagues.map(({ league, matches: leagueMatches, count }) => {
                      const isSelected = selectedLeague === league;
                      return (
                        <button
                          key={league}
                          onClick={() => onLeagueSelect?.(isSelected ? null : league)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-left",
                            isSelected
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                          )}
                        >
                          <Avatar className="size-5">
                            <AvatarImage
                              src={leagueMatches[0]?.leagueIcon}
                              alt={league}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {league
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1 truncate">{league}</span>
                          <Badge variant="outline" className="text-xs">
                            {count}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}

