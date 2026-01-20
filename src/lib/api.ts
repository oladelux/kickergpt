// API Configuration
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_URI ?? "").replace(
  /\/+$/,
  ""
);

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type SportmonksCountry = {
  id: number;
  name: string;
  image_path: string | null;
  extra?: Record<string, unknown>;
};

export type SportmonksLeague = {
  id: number;
  sport_id?: number;
  country_id?: number | null;
  name: string;
  image_path: string | null;
  type?: string | null;
  country?: SportmonksCountry | null;
};

export type SportmonksParticipantMeta = {
  location?: string | null;
  name?: string | null;
  [key: string]: unknown;
};

export type SportmonksParticipant = {
  id: number;
  name: string;
  short_code?: string | null;
  image_path?: string | null;
  participant_id?: number;
  meta?: SportmonksParticipantMeta | null;
};

export type SportmonksOdd = {
  id: number;
  name?: string | null;
  value?: string | number | null;
  market_id?: number | null;
  bookmaker?: string | null;
};

export type SportmonksVenue = {
  id: number;
  name: string;
  city?: string | null;
  image_path?: string | null;
  capacity?: number | null;
  country_id?: number | null;
};

export type SportmonksSeason = {
  id: number;
  name: string;
  year?: number | null;
};

export type SportmonksWeatherReport = {
  temperature?: string | null;
  description?: string | null;
  humidity?: string | null;
  wind?: string | null;
  extra?: Record<string, unknown>;
};

export type SportmonksReferee = {
  id: number;
  name: string;
  image_path?: string | null;
  nationality?: string | null;
};

export type SportmonksSidelined = {
  player_id: number;
  player_name: string;
  reason?: string | null;
  extra?: Record<string, unknown>;
};

export type SportmonksPreMatchNews = Record<string, unknown>;

export type SportmonksScore = {
  id: number;
  description?: string | null;
  participant_id?: number | null;
  score?: {
    home?: number | null;
    away?: number | null;
    [key: string]: number | null | undefined;
  };
  scoreboard?: string | null;
};

export type SportmonksFixtureState = {
  id: number;
  state: string;
  name: string;
  short_name: string;
  developer_name: string;
};

export type SportmonksFixture = {
  id: number;
  sport_id: number;
  league_id: number;
  season_id: number;
  stage_id: number;
  group_id: number | null;
  aggregate_id: number | null;
  round_id: number | null;
  state_id: number;
  venue_id: number | null;
  name: string;
  starting_at: string;
  result_info: string | null;
  leg: string | null;
  details: string | null;
  length: number | null;
  placeholder: boolean;
  has_odds: boolean;
  has_premium_odds: boolean;
  starting_at_timestamp: number | null;
  league: SportmonksLeague;
  participants: SportmonksParticipant[];
  odds: SportmonksOdd[];
  venue: SportmonksVenue | null;
  season: SportmonksSeason;
  weatherreport: SportmonksWeatherReport[];
  referees: SportmonksReferee[];
  sidelined: SportmonksSidelined[];
  prematchnews: SportmonksPreMatchNews;
  scores: SportmonksScore[];
  state: SportmonksFixtureState;
};

export type SportmonksPagination = {
  count: number;
  per_page: number;
  current_page: number;
  next_page: number | null;
  has_more: boolean;
};

export type SportmonksFixturesResponse = {
  timezone: string;
  data: SportmonksFixture[];
  pagination: SportmonksPagination;
};

export type ApiFootballFixturePeriods = {
  first: number | null;
  second: number | null;
};

export type ApiFootballFixtureVenue = {
  id: number | null;
  name: string | null;
  city: string | null;
};

export type ApiFootballFixtureStatus = {
  long: string;
  short: string;
  elapsed: number | null;
  extra: string | null;
};

export type ApiFootballFixtureDetails = {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: ApiFootballFixturePeriods;
  venue: ApiFootballFixtureVenue;
  status: ApiFootballFixtureStatus;
};

export type ApiFootballLeague = {
  id: number;
  name: string;
  country: string;
  logo: string | null;
  flag: string | null;
  season: number;
  round: string | null;
};

export type ApiFootballTeam = {
  id: number;
  name: string;
  logo: string | null;
  winner: boolean | null;
};

export type ApiFootballTeams = {
  home: ApiFootballTeam;
  away: ApiFootballTeam;
};

export type ApiFootballGoals = {
  home: number | null;
  away: number | null;
};

export type ApiFootballScorePeriod = {
  home: number | null;
  away: number | null;
};

export type ApiFootballScore = {
  halftime: ApiFootballScorePeriod;
  fulltime: ApiFootballScorePeriod;
  extratime: ApiFootballScorePeriod;
  penalty: ApiFootballScorePeriod;
};

export type ApiFootballFixture = {
  fixture: ApiFootballFixtureDetails;
  league: ApiFootballLeague;
  teams: ApiFootballTeams;
  goals: ApiFootballGoals;
  score: ApiFootballScore;
};

export type ApiFootballPaging = {
  current: number;
  total: number;
};

export type ApiFootballFixturesResponse = {
  get: string;
  parameters: Record<string, string>;
  errors: string[];
  results: number;
  paging: ApiFootballPaging;
  response: ApiFootballFixture[];
};

export type SportmonksFixturesRequestOptions = {
  date?: string;
  order?: "asc" | "desc";
  perPage?: number;
  page?: number;
};

export type FixtureChatMessage = {
  id: string;
  fixtureId: number;
  message: string;
  tone?: string | null;
  summary: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type KickerGPTFixturesResponse = {
  id: number;
  timezone: string;
  date: string;
  timestamp: number;
  periods: ApiFootballFixturePeriods;
  status: ApiFootballFixtureStatus;
  league: ApiFootballLeague;
  teams: ApiFootballTeams;
  venue: ApiFootballFixtureVenue;
  derby: boolean;
  matchType: string;
  homeOdd: string;
  awayOdd: string;
  weatherSummary: string;
  referee: string;
  h2h: KickerGPTMatchSummary[];
  homeInjuries: KickerGPTInjuryPlayerFlag[];
  awayInjuries: KickerGPTInjuryPlayerFlag[];
  lastHomeMatches: KickerGPTMatchSummary[];
  lastAwayMatches: KickerGPTMatchSummary[];
  homeNews: KickerGPTNewsItemSummary[];
  awayNews: KickerGPTNewsItemSummary[];
};

export type KickerGPTMatchSummary = {
  id: number;
  date: string;
  timestamp: number;
  league: ApiFootballLeague;
  teams: ApiFootballTeams;
  venue: ApiFootballFixtureVenue;
  status: ApiFootballFixtureStatus;
  goals: ApiFootballGoals;
  derby: boolean;
  weatherSummary: string;
  referee: string;
};

export type KickerGPTNewsItemSummary = {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  tag?: "MANAGER" | "INJURY" | "TRANSFER" | "BOARD" | "FANS" | "OTHER";
};

export type KickerGPTInjuryPlayerFlag = {
  playerId: number | null;
  name: string | null;
  position?: string;
  reason: string | null;
  expectedReturnDate?: string;
};

// Predictions types
export type PredictionTeam = {
  id: number;
  name: string;
  logo: string;
};

export type PredictionLeague = {
  id: number;
  name: string;
  country: string;
};

/**
 * Outcome probabilities for all three possible results.
 */
export type OutcomeProbabilities = {
  /** Win probability for home team (0-100) */
  homeWin: number;
  /** Draw probability (0-100) */
  draw: number;
  /** Win probability for away team (0-100) */
  awayWin: number;
};

/**
 * Factor contribution to the prediction.
 */
export type PredictionFactor = {
  /** Name of the factor (e.g., "Bookmaker Odds", "Recent Form") */
  name: string;
  /** Description of the factor's influence */
  description: string;
  /** Impact direction: positive favors home, negative favors away */
  impact: "home" | "away" | "neutral";
  /** Weight of this factor (0-1) */
  weight: number;
};

/**
 * The predicted match result (including draw).
 */
export type MatchResult = "home" | "away" | "draw";

/**
 * Favored team information for the prediction.
 */
export type FavoredTeam = {
  id: number;
  name: string;
};

/**
 * Confidence level for predictions.
 */
export type ConfidenceLevel = "very high" | "high" | "medium" | "low";

/**
 * Match result prediction (home/away/draw).
 */
export type PredictionResult = {
  type: string;
  result: "home" | "away" | "draw";
  probability: number;
  confidence: ConfidenceLevel;
  // --- New fields ---
  /** Probabilities for all three outcomes */
  probabilities: OutcomeProbabilities;
  /** The predicted outcome: 'home', 'draw', or 'away' */
  predictedOutcome: MatchResult;
  /** The favored team (null for draw prediction) */
  favoredTeam: FavoredTeam | null;
  /** Key factors that influenced this prediction (top 3) */
  keyFactors: PredictionFactor[];
  /** Human-readable summary for UI display */
  summary: string;
};

/**
 * The predicted outcome for goal predictions.
 */
export type GoalOutcome = "over" | "under";

/**
 * Probabilities for over/under goal predictions.
 */
export type GoalProbabilities = {
  /** Probability of goals being over threshold (0-100) */
  over: number;
  /** Probability of goals being under threshold (0-100) */
  under: number;
};

/**
 * Goal prediction for over/under thresholds.
 */
export type GoalPrediction = {
  /** The type of prediction (over_1_5_goals or over_2_5_goals) */
  type: "over_1_5_goals" | "over_2_5_goals";
  /** The predicted outcome: 'over' or 'under' */
  predictedOutcome: GoalOutcome;
  /** Probability of the predicted outcome (0-100) */
  probability: number;
  /** Confidence level based on probability threshold */
  confidence: ConfidenceLevel;
  /** Probabilities for both outcomes */
  probabilities: GoalProbabilities;
  /** Goal threshold (1.5 or 2.5) */
  threshold: number;
  /** Key factors that influenced this prediction (top 3) */
  keyFactors: PredictionFactor[];
  /** Human-readable summary for UI display */
  summary: string;
};

export type FixturePrediction = {
  fixtureId: number;
  homeTeam: PredictionTeam;
  awayTeam: PredictionTeam;
  startingAt: string;
  league: PredictionLeague;
  predictions: (PredictionResult | GoalPrediction)[];
  generatedAt: string;
};

export type PredictionsResponse = {
  date: string;
  predictions: FixturePrediction[];
  totalFixturesAnalyzed: number;
  generatedAt: string;
};

/**
 * Supported prediction types for natural language queries
 */
export type NaturalQueryPredictionType =
  | "over_1_5_goals"
  | "over_2_5_goals"
  | "btts"
  | "result"
  | "home_win"
  | "away_win"
  | "draw"
  | "high_scoring"
  | "any";

/**
 * Date range type for queries
 */
export type DateRangeType = "today" | "tomorrow" | "next_3_days";

/**
 * Confidence threshold for filtering results
 */
export type ConfidenceThreshold = "any" | "medium" | "high" | "very_high";

/**
 * Sort options for query results
 */
export type SortOption = "confidence" | "date" | "goals_expected";

/**
 * Date range filter extracted from query
 */
export type DateRangeFilter = {
  type: DateRangeType;
  startDate?: string;
  endDate?: string;
};

/**
 * Filters extracted from the user's natural language query
 */
export type ClassifiedFilters = {
  countries: string[];
  leagues: string[];
  dateRange: DateRangeFilter;
  confidenceThreshold: ConfidenceThreshold;
};

/**
 * Entities extracted from the query
 */
export type ExtractedEntities = {
  teams: string[];
  keywords: string[];
};

/**
 * The classified intent from a natural language query
 */
export type ClassifiedIntent = {
  predictionType: NaturalQueryPredictionType;
  filters: ClassifiedFilters;
  sortBy: SortOption;
  limit: number;
  isAmbiguous: boolean;
  clarificationNeeded: string | null;
  extractedEntities?: ExtractedEntities;
};

/**
 * Team info in natural query response
 */
export type NaturalQueryTeam = {
  id: number;
  name: string;
  logo: string | null;
};

/**
 * League info in natural query response
 */
export type NaturalQueryLeague = {
  id: number;
  name: string;
  country: string;
  logo?: string | null;
  flag?: string | null;
};

/**
 * Venue info in natural query response
 */
export type NaturalQueryVenue = {
  name: string | null;
  city: string | null;
};

/**
 * Fixture details in query response
 */
export type NaturalQueryMatchFixture = {
  id: number;
  date: string;
  homeTeam: NaturalQueryTeam;
  awayTeam: NaturalQueryTeam;
  league: NaturalQueryLeague;
  venue?: NaturalQueryVenue | null;
};

/**
 * Prediction probabilities for natural query
 */
export type NaturalQueryProbabilities = {
  over?: number;
  under?: number;
  homeWin?: number;
  draw?: number;
  awayWin?: number;
  yes?: number;
  no?: number;
};

/**
 * Prediction result for a queried match
 */
export type NaturalQueryMatchPrediction = {
  type: NaturalQueryPredictionType;
  probability: number;
  predictedOutcome: string;
  confidence: ConfidenceLevel;
  probabilities?: NaturalQueryProbabilities;
};

/**
 * An analyzed match returned from a query
 */
export type NaturalQueryAnalyzedMatch = {
  fixture: NaturalQueryMatchFixture;
  prediction: NaturalQueryMatchPrediction;
  relevantFactors: PredictionFactor[];
};

/**
 * Metadata about the query execution
 */
export type NaturalQueryMetadata = {
  query: string;
  normalizedQuery: string;
  intent: ClassifiedIntent;
  fixturesSearched: number;
  matchesFound: number;
  executionTimeMs?: number;
  cacheHit?: boolean;
};

/**
 * Response from a natural language query
 */
export type NaturalQueryResponse = {
  success: boolean;
  matches: NaturalQueryAnalyzedMatch[];
  summary?: string;
  clarificationNeeded?: string;
  suggestions?: string[];
  metadata: NaturalQueryMetadata;
};

/**
 * Suggestions response from the query API
 */
export type NaturalQuerySuggestionsResponse = {
  examples: string[];
  supportedCountries: string[];
  supportedLeagues: string[];
};

/**
 * Cache health response
 */
export type NaturalQueryCacheHealth = {
  dates: Array<{ date: string; fixtureCount: number }>;
  totalFixtures: number;
};

/**
 * Available countries response
 */
export type NaturalQueryAvailableCountries = {
  countries: string[];
};

/**
 * Available leagues response
 */
export type NaturalQueryAvailableLeagues = {
  leagues: Array<{ id: number; name: string; country: string }>;
};

/**
 * Error class for API requests resulting in a 5xx status code.
 */
export class ApiError extends Error {
  constructor(
    url: string,
    public status: number,
    public responseBody: string
  ) {
    super(`API error at ${url}, status ${status}: ${responseBody}`);
    this.name = "ApiError";
  }
}

/**
 * Error class for unauthorized requests (401).
 */
export class UnauthorizedError extends Error {
  public errorCode?: string;

  constructor(
    url: string,
    public status: number,
    public responseBody: Record<string, unknown>
  ) {
    super(`Unauthorized request to ${url}, status ${status}`);
    this.name = "UnauthorizedError";
    this.errorCode = typeof responseBody?.error === "string" ? responseBody.error : undefined;
  }
}

/**
 * Error class for API requests resulting in a 4xx status code.
 */
export class ClientError extends Error {
  constructor(
    url: string,
    public status: number,
    public responseBody: Record<string, unknown>
  ) {
    const responseErrors = (responseBody?.errors ?? {}) as Record<string, unknown>;
    const responseMessage =
      typeof responseBody?.message === "string" ? responseBody.message : undefined;
    const emailError = responseErrors.email;
    const isEmailExists = emailError === "emailAlreadyExists";

    const friendlyMessage = isEmailExists
      ? "That email is already registered. Try signing in instead."
      : (responseMessage ?? "Request failed. Please try again.");

    super(friendlyMessage);
    this.name = "ClientError";
  }
}

// Token management helpers
const TOKEN_KEY = "access-token";

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Response handler
async function apiResponse(res: Response) {
  const isResponseJson = res.headers.get("content-type")?.includes("application/json");

  if (res.status === 401) {
    const responseBody = isResponseJson ? await res.json() : { code: "UNKNOWN" };
    throw new UnauthorizedError(res.url, res.status, responseBody);
  } else if (res.status >= 400 && res.status < 500) {
    const responseBody = isResponseJson ? await res.json() : { code: "UNKNOWN" };
    throw new ClientError(res.url, res.status, responseBody);
  } else if (res.status >= 500) {
    throw new ApiError(res.url, res.status, await res.text());
  } else {
    return res;
  }
}

// Base API request function
const apiRequest = async (
  endpoint: string,
  method: Method,
  data: object = {}
): Promise<Response> => {
  if (!API_BASE_URL && !endpoint.startsWith("http")) {
    console.warn("API base URL is not configured. Falling back to relative requests.");
  }

  const requestURL = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const accessToken = getToken();
  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (method !== "GET" && Object.keys(data).length > 0) {
    config.body = JSON.stringify(data);
  }

  const res = await fetch(requestURL, config);
  return apiResponse(res);
};

// Auth API methods
export const api = {
  auth: {
    signup: async (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      countryCode: string;
    }) => {
      await apiRequest("/auth/email/register", "POST", data);
    },

    login: async (data: { email: string; password: string; countryCode: string }) => {
      const res = await apiRequest("/auth/email/login", "POST", data);
      const json = res.status === 204 ? {} : await res.json();
      const token = json.token ?? json.accessToken;
      if (token) {
        setToken(token);
      }
      return json;
    },

    logout: async () => {
      const res = await apiRequest("/auth/logout", "POST");
      const json = res.status === 204 ? null : await res.json().catch(() => null);
      removeToken();
      return json;
    },

    forgotPassword: async (data: { email: string }) => {
      const res = await apiRequest("/auth/forgot/password", "POST", data);
      return res.status === 204 ? null : res.json();
    },

    resetPassword: async (data: { hash: string; password: string }) => {
      const res = await apiRequest("/auth/reset/password", "POST", data);
      return res.status === 204 ? null : res.json();
    },

    me: async () => {
      const res = await apiRequest("/auth/me", "GET");
      return res.status === 204 ? null : res.json();
    },

    resendVerificationEmail: async (data: { email: string }) => {
      const res = await apiRequest("/auth/email/resend", "POST", data);
      return res.status === 204 ? null : res.json();
    },

    confirmEmail: async (hash: string) => {
      const res = await apiRequest("/auth/email/confirm", "POST", { hash });
      return res.status === 204 ? null : res.json();
    },

    delete: async () => {
      const res = await apiRequest("/auth/me", "DELETE");
      removeToken();
      return res.status === 204 ? null : res.json();
    },
  },

  chat: {
    sendMessage: async (data: { message: string }) => {
      const res = await apiRequest("/chat", "POST", data);
      return res.json();
    },

    getHistory: async () => {
      const res = await apiRequest("/chat/history", "GET");
      return res.json();
    },
  },

  matches: {
    getTodayFixtures: async (params?: {
      timezone?: string;
    }): Promise<SportmonksFixturesResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.timezone) {
        searchParams.set("timezone", params.timezone);
      }
      const query = searchParams.toString();
      const res = await apiRequest(
        `/matches/today?${query ? `${query}&` : ""}date=2025-11-08&limit=100`,
        "GET"
      );
      return res.json();
    },
  },

  fixtures: {
    getTestTodayFixtures: async (params: {
      league: number;
      season: number;
      date: string;
    }): Promise<KickerGPTFixturesResponse[]> => {
      const searchParams = new URLSearchParams({
        league: String(params.league),
        season: String(params.season),
        date: params.date,
      });
      const res = await apiRequest(`/fixtures/test?${searchParams.toString()}`, "GET");
      return res.json();
    },

    getTodayFixtures: async (params?: {
      timezone?: string;
    }): Promise<SportmonksFixturesResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.timezone) {
        searchParams.set("timezone", params.timezone);
      }
      const query = searchParams.toString();
      const res = await apiRequest(`/matches/three-days${query ? `?${query}` : ""}`, "GET");
      return res.json();
    },

    getControlRoomFixtures: async (params: {
      date: string;
      timezone?: string;
      page?: number;
      perPage?: number;
    }): Promise<SportmonksFixturesResponse> => {
      const searchParams = new URLSearchParams();
      searchParams.set("date", params.date);
      if (params.timezone) searchParams.set("timezone", params.timezone);
      if (params.page) searchParams.set("page", String(params.page));
      if (params.perPage) searchParams.set("per_page", String(params.perPage));
      const query = searchParams.toString();
      const res = await apiRequest(`/control-room${query ? `?${query}` : ""}`, "GET");
      return res.json();
    },

    getControlRoomOutcome: async (
      fixtureId: number | string,
      date: string,
      question?: string,
      conversationId?: string
    ): Promise<{
      fixtureId: number;
      homeTeam: string;
      awayTeam: string;
      finalScore: { home: number; away: number; winner: "home" | "away" | "draw" } | null;
      analysis: string;
      conversationId: string;
    }> => {
      const res = await apiRequest("/control-room/outcomes", "POST", {
        fixtureId,
        date,
        question,
        conversationId,
      });
      return res.json();
    },

    getUserChats: async (params?: {
      limit?: number;
      offset?: number;
    }): Promise<FixtureChatMessage[]> => {
      const searchParams = new URLSearchParams();
      if (typeof params?.limit === "number") {
        searchParams.set("limit", String(params.limit));
      }
      if (typeof params?.offset === "number") {
        searchParams.set("offset", String(params.offset));
      }
      const query = searchParams.toString();
      const endpoint = `/fixtures/user/chats${query ? `?${query}` : ""}`;
      const res = await apiRequest(endpoint, "GET");
      return res.json() as Promise<FixtureChatMessage[]>;
    },

    analyzeFixture: async (
      fixtureId: string,
      data: { message: string; tone?: string; conversationId?: string }
    ): Promise<{
      summary?: string;
      analysis?: string;
      message?: string;
      tokens?: Record<string, unknown>;
      followUpSuggestions: {
        id: string;
        question: string;
      }[];
      conversationId?: string;
      [key: string]: unknown;
    }> => {
      const res = await apiRequest(`/analyze/${fixtureId}`, "POST", data);
      return res.json();
    },
  },

  profile: {
    get: async () => {
      const res = await apiRequest("/auth/me", "GET");
      return res.json();
    },

    update: async (data: { name?: string; email?: string }) => {
      const res = await apiRequest("/auth/me", "PUT", data);
      return res.json();
    },

    getUsage: async () => {
      const res = await apiRequest("/profile/usage", "GET");
      return res.json();
    },
  },

  insights: {
    list: async () => {
      const res = await apiRequest("/insights", "GET");
      return res.json();
    },

    save: async (data: { title: string; content: string; tags: string[] }) => {
      const res = await apiRequest("/insights", "POST", data);
      return res.json();
    },

    delete: async (id: string) => {
      const res = await apiRequest(`/insights/${id}`, "DELETE");
      return res.json();
    },
  },

  subscriptions: {
    getCurrent: async () => {
      const res = await apiRequest("/subscriptions/me", "GET");
      return res.status === 204 ? null : res.json();
    },
    getUsage: async () => {
      const res = await apiRequest("/subscriptions/usage", "GET");
      return res.status === 204 ? null : res.json();
    },
    selectPlan: async (data: {
      plan: "FREE" | "PRO" | "THREE_DAY_PASS" | "SEVEN_DAY_PASS" | "MONTHLY_UNLIMITED";
      countryCode?: string;
      isNativeUser: boolean;
    }) => {
      const res = await apiRequest("/subscriptions/select-plan", "POST", data);
      return res.status === 204 ? null : res.json();
    },
    verify: async (data: { reference: string; token: string }) => {
      const res = await apiRequest("/subscriptions/verify", "POST", data);
      return res.status === 204 ? null : res.json();
    },
    cancel: async () => {
      const res = await apiRequest("/subscriptions/cancel", "POST");
      return res.status === 204 ? null : res.json();
    },
    addonPurchase: async (data: { addonType: string; isNativeUser: boolean }) => {
      const res = await apiRequest("/subscriptions/addon-purchase", "POST", data);
      return res.status === 204 ? null : res.json();
    },
    addonPurchaseVerify: async (data: { reference: string; token: string }) => {
      const res = await apiRequest("/subscriptions/addon-purchase-verify", "POST", data);
      return res.status === 204 ? null : res.json();
    },
  },

  // Ads API
  ads: {
    claimReward: async (data: { creditsEarned: number }) => {
      const res = await apiRequest("/ads/reward", "POST", data);
      return res.json();
    },
  },

  // Predictions API
  predictions: {
    get: async (): Promise<PredictionsResponse> => {
      const res = await apiRequest("/predictions", "GET");
      return res.json();
    },
  },

  // Strategies API
  strategies: {
    getAll: async () => {
      const res = await apiRequest("/strategies", "GET");
      return res.json();
    },
    getOne: async (id: string) => {
      const res = await apiRequest(`/strategies/${id}`, "GET");
      return res.json();
    },
    create: async (data: {
      name: string;
      description?: string;
      conditions: Array<{
        id: string;
        type:
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
        operator: ">" | "<" | "=" | ">=" | "<=";
        value: number;
        lastMatches: number;
        target: "HOME" | "AWAY" | "BOTH";
      }>;
      isActive?: boolean;
    }) => {
      const res = await apiRequest("/strategies", "POST", data);
      return res.json();
    },
    update: async (
      id: string,
      data: {
        name?: string;
        description?: string;
        conditions?: Array<{
          id: string;
          type:
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
          operator: ">" | "<" | "=" | ">=" | "<=";
          value: number;
          lastMatches: number;
          target: "HOME" | "AWAY" | "BOTH";
        }>;
        isActive?: boolean;
      }
    ) => {
      const res = await apiRequest(`/strategies/${id}`, "PATCH", data);
      return res.json();
    },
    delete: async (id: string) => {
      const res = await apiRequest(`/strategies/${id}`, "DELETE");
      return res.status === 204 ? null : res.json();
    },
    findMatches: async (id: string) => {
      const res = await apiRequest(`/strategies/${id}/find-matches`, "POST");
      return res.json();
    },
  },

  // ============ Natural Query API ============
  query: {
    /**
     * Search for matches using natural language
     * @example
     * const result = await api.query.search({ query: "BTTS from England today" });
     */
    search: async (data: { query: string }): Promise<NaturalQueryResponse> => {
      const res = await apiRequest("/query", "POST", data);
      return res.json();
    },

    /**
     * Get example queries and supported options
     */
    getSuggestions: async (): Promise<NaturalQuerySuggestionsResponse> => {
      const res = await apiRequest("/query/suggestions", "GET");
      return res.json();
    },

    /**
     * Get cache health status (useful for debugging)
     */
    getCacheHealth: async (): Promise<NaturalQueryCacheHealth> => {
      const res = await apiRequest("/query/health", "GET");
      return res.json();
    },

    /**
     * Get list of countries with available fixtures
     */
    getAvailableCountries: async (): Promise<NaturalQueryAvailableCountries> => {
      const res = await apiRequest("/query/countries", "GET");
      return res.json();
    },

    /**
     * Get list of leagues with available fixtures
     */
    getAvailableLeagues: async (): Promise<NaturalQueryAvailableLeagues> => {
      const res = await apiRequest("/query/leagues", "GET");
      return res.json();
    },
  },
};
