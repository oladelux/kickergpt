import { useState } from "react";
import { Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import ChatDialog from "@/components/ChatDialog";
import { useMatches } from "@/hooks/useMatches";
import { Match } from "@/services/matches.service";
import { LoadingPage } from "@/components/LoadingPage";

export default function Chat() {
  const { matches, loading, toggleFavorite } = useMatches();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  if (loading) return <LoadingPage />;

  // Group matches by league
  const matchesByLeague = matches.reduce((acc, match) => {
    if (!acc[match.league]) {
      acc[match.league] = [];
    }
    acc[match.league].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const handleAnalysisClick = (match: Match) => {
    setSelectedMatch(match);
    setChatOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary pb-16 md:pb-0 md:pt-16">
      <TopNav />
      <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Today's Matches
          </h1>
          <p className="text-sm text-muted-foreground">Select a match to get AI-powered analysis</p>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="max-w-6xl mx-auto space-y-6 pb-4">
          {Object.entries(matchesByLeague).map(([league, leagueMatches]) => (
            <div key={league} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{leagueMatches[0].leagueIcon}</span>
                <h2 className="text-lg font-semibold text-foreground">{league}</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {leagueMatches.map((match) => (
                  <Card key={match.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{match.homeTeamLogo}</span>
                            <span className="font-medium text-foreground">{match.homeTeam}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{match.awayTeamLogo}</span>
                            <span className="font-medium text-foreground">{match.awayTeam}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mb-3">
                        {match.kickoffTime.toLocaleTimeString([], { 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => toggleFavorite(match.id)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              match.isFavorite ? "fill-current text-destructive" : ""
                            }`}
                          />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => handleAnalysisClick(match)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <ChatDialog
        match={selectedMatch}
        open={chatOpen}
        onOpenChange={setChatOpen}
      />

      <BottomNav />
    </div>
  );
}
