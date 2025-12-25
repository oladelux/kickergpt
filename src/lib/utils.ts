import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
