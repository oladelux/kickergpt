import { Link } from "react-router-dom";
import { TrendingUp, Lock, Star, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FixturePrediction } from "@/lib/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PredictionBadgeProps {
  prediction: FixturePrediction | undefined;
  isBlurred: boolean;
  isPro: boolean;
  compact?: boolean;
}

const getConfidenceIcon = (confidence: string) => {
  switch (confidence) {
    case "high":
      return <Star className="h-3 w-3 fill-current text-amber-500" />;
    case "medium":
      return <AlertCircle className="h-3 w-3 text-blue-500" />;
    case "low":
      return <TrendingUp className="h-3 w-3 text-muted-foreground" />;
    default:
      return null;
  }
};

const getResultLabel = (result: string) => {
  switch (result) {
    case "home":
      return "Home";
    case "away":
      return "Away";
    case "draw":
      return "Draw";
    default:
      return result;
  }
};

export default function PredictionBadge({
  prediction,
  isBlurred,
  isPro,
  compact = false,
}: PredictionBadgeProps) {
  // Don't render anything if there's no prediction at all
  if (!prediction && !isBlurred) {
    return null;
  }

  // Show blurred state for free users after 5 predictions
  if (isBlurred && !isPro) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative inline-flex items-center">
              <div className="backdrop-blur-sm bg-muted/50 rounded-md px-2 py-1 flex items-center gap-1.5 border border-border/50">
                <Lock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground blur-[3px] select-none">
                  XX% High
                </span>
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 h-4 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-bold"
                >
                  PRO
                </Badge>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[200px]">
            <p className="text-xs mb-2">Upgrade to PRO to see all predictions</p>
            <Button asChild size="sm" className="w-full text-xs h-7">
              <Link to="/plans">Upgrade Now</Link>
            </Button>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Show actual prediction (for PRO users or first 5 for free users)
  if (prediction && prediction.predictions.length > 0) {
    const primaryPrediction = prediction.predictions[0];

    if (compact) {
      // Compact version for mobile/tight spaces
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0.5 h-5 gap-1 border-primary/40 bg-primary/5 text-primary font-semibold"
              >
                <TrendingUp className="h-2.5 w-2.5" />
                <span>{Math.round(primaryPrediction.probability)}%</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs space-y-1">
                <p className="font-semibold">
                  {getResultLabel(primaryPrediction.result)} Win
                </p>
                <p className="text-muted-foreground">
                  {Math.round(primaryPrediction.probability)}% •{" "}
                  {primaryPrediction.confidence} confidence
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Full version for desktop
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 border border-primary/30">
        <TrendingUp className="h-3 w-3 text-primary" />
        <span className="text-xs font-semibold text-primary">
          {getResultLabel(primaryPrediction.result)}
        </span>
        <span className="text-xs text-muted-foreground">•</span>
        <span className="text-xs font-bold text-foreground">
          {Math.round(primaryPrediction.probability)}%
        </span>
        {getConfidenceIcon(primaryPrediction.confidence)}
      </div>
    );
  }

  return null;
}

