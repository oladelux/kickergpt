import { Link } from "react-router-dom";
import { TrendingUp, Lock, Star, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FixturePrediction } from "@/lib/api";
import {
  getConfidenceColorClasses,
  isMatchPrediction,
  isGoalPrediction,
  getMatchResultLabel,
  getGoalPredictionLabel,
} from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PredictionBadgeProps {
  prediction: FixturePrediction | undefined;
  isBlurred: boolean;
  isPro: boolean;
  compact?: boolean;
}

const getConfidenceIcon = (confidence: string) => {
  switch (confidence.toLowerCase()) {
    case "very high":
      return <Star className="h-3 w-3 fill-current text-emerald-500" />;
    case "high":
      return <Star className="h-3 w-3 fill-current text-amber-500" />;
    case "medium":
      return <AlertCircle className="h-3 w-3 text-orange-500" />;
    case "low":
      return <TrendingUp className="h-3 w-3 text-red-500" />;
    default:
      return null;
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

  // Show blurred state for free users after 10 predictions
  if (isBlurred && !isPro) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative inline-flex items-center">
              <div className="backdrop-blur-sm bg-muted/50 rounded-md px-2 py-1 flex items-center gap-1.5 border border-border/50">
                <span className="text-xs font-medium text-muted-foreground blur-[3px] select-none">
                  XX% High
                </span>
                <div className="flex items-center gap-1 flex-shrink-0 relative z-10">
                  <Lock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[9px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded">
                    PRO
                  </span>
                </div>
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

  // Show actual prediction (for PRO users or first 10 for free users)
  if (prediction && prediction.predictions.length > 0) {
    const matchPredictions = prediction.predictions.filter(isMatchPrediction);
    const goalPredictions = prediction.predictions.filter(isGoalPrediction);

    if (compact) {
      // Compact version - show count and highest probability
      const highestProb = Math.max(...prediction.predictions.map((p) => p.probability));
      const count = prediction.predictions.length;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0.5 h-5 gap-1 border-primary/40 bg-primary/5 text-primary font-semibold"
              >
                <TrendingUp className="h-2.5 w-2.5" />
                <span>{Math.round(highestProb)}%</span>
                {count > 1 && <span className="text-[9px]">×{count}</span>}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs space-y-2 max-w-[220px]">
                {/* Match predictions */}
                {matchPredictions.map((pred, idx) => (
                  <div key={`match-${idx}`}>
                    <p className="font-semibold">{getMatchResultLabel(pred.result)} Win</p>
                    <p>
                      <span className="text-muted-foreground">
                        {Math.round(pred.probability)}% •{" "}
                      </span>
                      <span className={getConfidenceColorClasses(pred.confidence)}>
                        {pred.confidence} confidence
                      </span>
                    </p>
                  </div>
                ))}

                {/* Goal predictions */}
                {goalPredictions.map((pred, idx) => (
                  <div key={`goal-${idx}`}>
                    <p className="font-semibold">{getGoalPredictionLabel(pred)}</p>
                    <p>
                      <span className="text-muted-foreground">
                        {Math.round(pred.probability)}% •{" "}
                      </span>
                      <span className={getConfidenceColorClasses(pred.confidence)}>
                        {pred.confidence} confidence
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Full version for desktop - stack predictions vertically
    return (
      <div className="inline-flex flex-col gap-1">
        {/* Match predictions */}
        {matchPredictions.map((pred, idx) => (
          <div
            key={`match-${idx}`}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 border border-primary/30"
          >
            <TrendingUp className="h-3 w-3 text-primary" />
            <span className="text-xs font-semibold text-primary">
              {getMatchResultLabel(pred.result)}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-bold text-foreground">
              {Math.round(pred.probability)}%
            </span>
            {getConfidenceIcon(pred.confidence)}
          </div>
        ))}

        {/* Goal predictions */}
        {goalPredictions.map((pred, idx) => (
          <div
            key={`goal-${idx}`}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/5 border border-emerald-500/30"
          >
            <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {getGoalPredictionLabel(pred)}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-bold text-foreground">
              {Math.round(pred.probability)}%
            </span>
            {getConfidenceIcon(pred.confidence)}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
