import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PredictionResult, GoalPrediction } from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns Tailwind CSS classes for confidence level text colors
 * @param confidence - The confidence level: "very high" | "high" | "medium" | "low"
 * @returns Tailwind CSS classes for text color
 */
export function getConfidenceColorClasses(confidence: string): string {
  switch (confidence.toLowerCase()) {
    case "very high":
      return "text-emerald-600 dark:text-emerald-400";
    case "high":
      return "text-amber-600 dark:text-amber-400";
    case "medium":
      return "text-orange-600 dark:text-orange-400";
    case "low":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-muted-foreground";
  }
}

/**
 * Type guard to check if prediction is a match result prediction
 */
export function isMatchPrediction(
  prediction: PredictionResult | GoalPrediction
): prediction is PredictionResult {
  return (
    "result" in prediction &&
    (prediction.result === "home" ||
      prediction.result === "away" ||
      prediction.result === "draw")
  );
}

/**
 * Type guard to check if prediction is a goal prediction
 */
export function isGoalPrediction(
  prediction: PredictionResult | GoalPrediction
): prediction is GoalPrediction {
  return (
    "type" in prediction &&
    (prediction.type === "over_1_5_goals" || prediction.type === "over_2_5_goals")
  );
}

/**
 * Get display label for match result predictions
 */
export function getMatchResultLabel(result: string): string {
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
}

/**
 * Get display label for goal predictions
 */
export function getGoalPredictionLabel(prediction: GoalPrediction): string {
  const outcome =
    prediction.predictedOutcome.charAt(0).toUpperCase() +
    prediction.predictedOutcome.slice(1);
  return `${outcome} ${prediction.threshold}`;
}
