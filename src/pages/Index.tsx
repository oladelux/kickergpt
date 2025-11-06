import { Link } from "react-router-dom";
import { MessageCircle, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary to-background">
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        <div className="text-center space-y-6 animate-slide-up">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-[0_0_40px_hsl(var(--primary)/0.4)]">
            <svg className="h-10 w-10 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Football AI Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get expert match analysis, predictions, and tactical insights powered by advanced AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: MessageCircle, title: "AI Chat", desc: "Real-time football insights" },
            { icon: TrendingUp, title: "Predictions", desc: "Match outcome analysis" },
            { icon: Users, title: "Team Stats", desc: "Comprehensive data" },
            { icon: Zap, title: "Live Updates", desc: "Instant notifications" },
          ].map((feature, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)] animate-fade-in">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
