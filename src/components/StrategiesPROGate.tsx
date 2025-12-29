import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscriptionData } from "@/hooks/useSubscription";

interface StrategiesPROGateProps {
  children: ReactNode;
}

export function StrategiesPROGate({ children }: StrategiesPROGateProps) {
  const { plan, loading } = useSubscriptionData();

  // Show loading state while checking subscription
  if (loading) {
    return null; // Parent component will show loading
  }

  // If user has PRO plan, show the children (strategies content)
  if (plan?.plan === "PRO") {
    return <>{children}</>;
  }

  // Show upgrade prompt for FREE users
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pb-20 md:pb-4 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Sparkles className="h-3 w-3 mr-1" />
            PRO Feature
          </Badge>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Strategies
          </h1>
          <p className="text-lg text-muted-foreground">
            Create custom strategies and get notified about matches that fit your criteria.
          </p>
        </div>

        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Upgrade to PRO
            </CardTitle>
            <CardDescription>
              Unlock the Strategies feature and get access to powerful match filtering.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                What you'll get:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3 w-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Create Multiple Strategies</p>
                    <p className="text-sm text-muted-foreground">
                      Build custom strategies based on team form, win rate, head-to-head, injuries,
                      and goals.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3 w-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Find Matching Fixtures</p>
                    <p className="text-sm text-muted-foreground">
                      Instantly discover fixtures that match your strategy criteria with one click.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3 w-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">100 Prompts per Month</p>
                    <p className="text-sm text-muted-foreground">
                      Get 10x more AI analysis credits compared to the free plan.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <Button asChild size="lg" className="w-full">
              <Link to="/plans">
                Upgrade to PRO
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Cancel anytime. No commitments.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
