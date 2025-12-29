import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StrategyConditionType, StrategyOperator, StrategyTarget } from "@/types/strategy";

interface StrategyConditionBuilderProps {
  condition: {
    id: string;
    type: StrategyConditionType;
    operator: StrategyOperator;
    value: number;
    lastMatches: number;
    target: StrategyTarget;
  };
  onChange: (condition: {
    id: string;
    type: StrategyConditionType;
    operator: StrategyOperator;
    value: number;
    lastMatches: number;
    target: StrategyTarget;
  }) => void;
  onRemove: () => void;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isNew?: boolean;
}

const conditionTypeLabels: Record<StrategyConditionType, string> = {
  HOME_FORM: "Home Form",
  AWAY_FORM: "Away Form",
  WIN_RATE: "Win Rate",
  HEAD_TO_HEAD: "Head to Head",
  INJURIES: "Injuries",
  GOALS_SCORED: "Goals Scored",
  GOALS_CONCEDED: "Goals Conceded",
  RECENT_GOALS_TOTAL: "Recent Goals Total",
  CLEAN_SHEETS: "Clean Sheets",
  BTTS: "Both Teams To Score",
  H2H_GOALS_SCORED: "Head to Head Goals Scored",
};

const operatorLabels: Record<StrategyOperator, string> = {
  ">": "Greater than",
  "<": "Less than",
  "=": "Equal to",
  ">=": "Greater than or equal",
  "<=": "Less than or equal",
};

const targetLabels: Record<StrategyTarget, string> = {
  HOME: "Home Team",
  AWAY: "Away Team",
  BOTH: "Both Teams",
};

const targetHints: Record<StrategyTarget, string> = {
  HOME: "Apply this condition to the home team only.",
  AWAY: "Apply this condition to the away team only.",
  BOTH: "Apply this condition to both teams (both must meet the criteria).",
};

const conditionTypeHints: Record<StrategyConditionType, string> = {
  HOME_FORM:
    "Form points (W=3, D=1, L=0) from the home team's recent matches. Higher = better form.",
  AWAY_FORM:
    "Form points (W=3, D=1, L=0) from the away team's recent matches. Higher = better form.",
  WIN_RATE: "Win percentage in recent matches. E.g., >= 60 means wins at least 60% of matches.",
  HEAD_TO_HEAD: "Win percentage in head-to-head matches between these two teams.",
  INJURIES: "Number of injured players. Use <= X to find teams with few injuries.",
  GOALS_SCORED: "Minimum goals scored per match. >= 1 means scored at least 1 in every match.",
  GOALS_CONCEDED: "Maximum goals conceded per match. <= 1 means conceded at most 1 in every match.",
  RECENT_GOALS_TOTAL:
    "Minimum total goals (both teams) per match. >= 3 means 3+ goals every match.",
  CLEAN_SHEETS: "Clean sheet percentage. >= 40 means kept a clean sheet in 40%+ of matches.",
  BTTS: "Both Teams To Score percentage. >= 60 means BTTS in 60%+ of matches.",
  H2H_GOALS_SCORED: "Minimum goals scored per H2H match. >= 1 means scored in every H2H match.",
};

export function StrategyConditionBuilder({
  condition,
  onChange,
  onRemove,
  index,
  isExpanded,
  onToggle,
  isNew = false,
}: StrategyConditionBuilderProps) {
  const conditionSummary = `${conditionTypeLabels[condition.type]} ${condition.operator} ${condition.value} (Last ${condition.lastMatches}) → ${targetLabels[condition.target]}`;

  return (
    <div
      className={`p-4 border border-border rounded-lg bg-card transition-all ${
        isNew ? "animate-pulse-border" : ""
      }`}
      style={
        isNew
          ? {
              animation: "pulse-border 2s ease-in-out",
              boxShadow: "0 0 0 2px rgba(34, 197, 94, 0.3)",
            }
          : undefined
      }
    >
      {/* Header - Always visible */}
      <div className="flex items-center justify-between cursor-pointer" onClick={onToggle}>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold">Condition {index + 1}</Label>
            {!isExpanded && (
              <span className="text-xs text-muted-foreground break-words">{conditionSummary}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-destructive hover:text-destructive h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Condition Type */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor={`condition-type-${index}`}>Condition Type</Label>
              <Select
                value={condition.type}
                onValueChange={(value) =>
                  onChange({ ...condition, type: value as StrategyConditionType })
                }
              >
                <SelectTrigger id={`condition-type-${index}`}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(conditionTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {condition.type && (
                <p className="text-xs text-muted-foreground italic">
                  💡 {conditionTypeHints[condition.type]}
                </p>
              )}
            </div>

            {/* Operator */}
            <div className="space-y-2">
              <Label htmlFor={`condition-operator-${index}`}>Operator</Label>
              <Select
                value={condition.operator}
                onValueChange={(value) =>
                  onChange({ ...condition, operator: value as StrategyOperator })
                }
              >
                <SelectTrigger id={`condition-operator-${index}`}>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(operatorLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Value */}
            <div className="space-y-2">
              <Label htmlFor={`condition-value-${index}`}>Value</Label>
              <Input
                id={`condition-value-${index}`}
                type="number"
                value={condition.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                  if (e.target.value === "" || !isNaN(val)) {
                    onChange({
                      ...condition,
                      value: val,
                    });
                  }
                }}
                placeholder="Enter value"
                step="0.01"
              />
            </div>

            {/* Last Matches */}
            <div className="space-y-2">
              <Label htmlFor={`condition-lastMatches-${index}`}>Last Matches</Label>
              <Input
                id={`condition-lastMatches-${index}`}
                type="number"
                value={condition.lastMatches ?? ""}
                onChange={(e) => {
                  const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                  if (e.target.value === "" || (!isNaN(val) && val >= 0)) {
                    onChange({
                      ...condition,
                      lastMatches: val,
                    });
                  }
                }}
                placeholder="e.g., 5"
                min="0"
                step="1"
              />
              <p className="text-xs text-muted-foreground">Number of recent matches to consider</p>
            </div>

            {/* Target */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor={`condition-target-${index}`}>Target</Label>
              <Select
                value={condition.target}
                onValueChange={(value) =>
                  onChange({ ...condition, target: value as StrategyTarget })
                }
              >
                <SelectTrigger id={`condition-target-${index}`}>
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(targetLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {condition.target && (
                <p className="text-xs text-muted-foreground italic">
                  💡 {targetHints[condition.target]}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
