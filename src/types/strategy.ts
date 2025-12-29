import { Match } from "@/services/matches.service";
import { KickerGPTFixturesResponse } from "@/lib/api";

export type StrategyOperator = ">" | "<" | "=" | ">=" | "<=";
export type StrategyTarget = "HOME" | "AWAY" | "BOTH";
export type StrategyConditionType =
  | "HOME_FORM"
  | "AWAY_FORM"
  | "WIN_RATE"
  | "HEAD_TO_HEAD"
  | "INJURIES"
  | "GOALS_SCORED"
  | "GOALS_CONCEDED"
  | "RECENT_GOALS_TOTAL"
  | "CLEAN_SHEETS"
  | "BTTS"
  | "H2H_GOALS_SCORED";

export interface StrategyCondition {
  id: string;
  type: StrategyConditionType;
  operator: StrategyOperator;
  value: number;
  lastMatches: number;
  target: StrategyTarget;
}

export interface Strategy {
  id: string;
  userId: string;
  name: string;
  description?: string;
  conditions: StrategyCondition[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StrategyMatch {
  strategyId: string;
  strategyName: string;
  fixture: Match;
  matchedConditions: StrategyCondition[];
}

// API request/response types
export interface CreateStrategyRequest {
  name: string;
  description?: string;
  conditions: StrategyCondition[];
  isActive?: boolean;
}

export interface UpdateStrategyRequest {
  name?: string;
  description?: string;
  conditions?: StrategyCondition[];
  isActive?: boolean;
}

export interface FindMatchesResponse {
  strategyId: string;
  strategyName: string;
  fixtures: KickerGPTFixturesResponse[];
  matchedCount: number;
}
