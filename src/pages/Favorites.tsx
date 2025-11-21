import { useMemo, useState } from "react";
import { Heart, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import { useMatches } from "@/hooks/useMatches";
import { Match } from "@/services/matches.service";
import ChatDialog from "@/components/ChatDialog";
import { LoadingPage } from "@/components/LoadingPage";
import { Link } from "react-router-dom";

const formatKickoff = (date: Date) =>
  date.toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });

export default function Favorites() {
  const { matches, loading, toggleFavorite } = useMatches();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const favorites = useMemo(() => matches.filter((match) => match.isFavorite), [matches]);

  const handleChat = (match: Match) => {
    setSelectedMatch(match);
    setChatOpen(true);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pb-20 md:pb-4 md:pt-20">
      <TopNav />
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Favorite Fixtures
            </h1>
            <p className="text-muted-foreground">
              Quick access to every match you’ve starred for deeper analysis.
            </p>
          </div>
          <Badge
            variant="secondary"
            className="self-start bg-primary/10 text-primary md:self-auto"
          >
            {favorites.length} saved
          </Badge>
        </div>

        {favorites.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="py-12 text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Heart className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">No favorites yet</h3>
                <p className="text-sm text-muted-foreground">
                  Tap the heart icon on any fixture to pin it here.
                </p>
              </div>
              <Button asChild>
                <Link to="/fixtures">Browse fixtures</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {favorites.map((match) => (
              <Card
                key={match.id}
                className="border border-border/60 bg-card/60 backdrop-blur hover:border-primary/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {match.homeTeam} vs {match.awayTeam}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatKickoff(match.kickoffTime)}
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-background/80 text-xs uppercase">
                      {match.league}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div className="space-y-0.5">
                      <p>{match.country ?? "International"}</p>
                      {match.status?.short && (
                      <p className="text-xs uppercase tracking-wide">
                        Status: {match.status.short_name ?? match.status.name}
                      </p>
                    )}
                    </div>
                    <Button
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => toggleFavorite(match.id)}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => handleChat(match)}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => toggleFavorite(match.id)}
                    >
                      <Heart className="h-4 w-4 mr-2 text-destructive" fill="currentColor" />
                      Unfavorite
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ChatDialog match={selectedMatch} open={chatOpen} onOpenChange={setChatOpen} />
      <BottomNav />
    </div>
  );
}
