import { useState } from "react";
import { Clock, Tag, Trash2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";

type SavedInsight = {
  id: string;
  title: string;
  preview: string;
  date: Date;
  tags: string[];
};

export default function History() {
  const [insights] = useState<SavedInsight[]>([
    {
      id: "1",
      title: "Manchester United vs Liverpool Analysis",
      preview: "Based on recent form and head-to-head statistics, this match is likely to be closely contested...",
      date: new Date(2024, 0, 15),
      tags: ["Premier League", "Match Prediction"],
    },
    {
      id: "2",
      title: "Haaland Performance Stats",
      preview: "Erling Haaland's goal-scoring rate this season stands at an impressive 1.2 goals per game...",
      date: new Date(2024, 0, 14),
      tags: ["Player Analysis", "Statistics"],
    },
    {
      id: "3",
      title: "Arsenal Tactical Breakdown",
      preview: "Arsenal's possession-based style under Arteta focuses on building from the back with...",
      date: new Date(2024, 0, 13),
      tags: ["Tactics", "Premier League"],
    },
    {
      id: "4",
      title: "Champions League Quarter-Final Predictions",
      preview: "Looking at the remaining teams, Bayern Munich and Manchester City appear to be the favorites...",
      date: new Date(2024, 0, 12),
      tags: ["Champions League", "Predictions"],
    },
  ]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pb-20 md:pb-4 md:pt-20">
      <TopNav />
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Saved Insights
          </h1>
          <p className="text-muted-foreground">
            Your previously saved football analysis and predictions
          </p>
        </div>

        {insights.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="py-12 text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">No saved insights yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start chatting with the AI to save your first analysis
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {insights.map((insight) => (
              <Card
                key={insight.id}
                className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all cursor-pointer group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {insight.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(insight.date)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Delete", insight.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="line-clamp-2">
                    {insight.preview}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {insight.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
