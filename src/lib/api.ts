// API Configuration
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_URI ?? "").replace(
  /\/+$/,
  ""
);

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

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
};

export type SportmonksPagination = {
  count: number;
  per_page: number;
  current_page: number;
  next_page: number | null;
  has_more: boolean;
};

export type SportmonksFixturesResponse = {
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
  constructor(
    url: string,
    public status: number,
    public responseBody: Record<string, unknown>
  ) {
    super(`Unauthorized request to ${url}, status ${status}`);
    this.name = "UnauthorizedError";
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
    super(
      `Erroneous request to endpoint ${url}, status ${status}, code ${JSON.stringify(responseBody)}`
    );
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
    }) => {
      await apiRequest("/auth/email/register", "POST", data);
    },

    login: async (data: { email: string; password: string }) => {
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
      const res = await apiRequest("/auth/email/forgot-password", "POST", data);
      return res.status === 204 ? null : res.json();
    },

    resetPassword: async (data: { token: string; password: string }) => {
      const res = await apiRequest("/auth/email/reset-password", "POST", data);
      return res.status === 204 ? null : res.json();
    },

    me: async () => {
      const res = await apiRequest("/auth/me", "GET");
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
    getTodayFixtures: async (): Promise<SportmonksFixturesResponse> => {
      const res = await apiRequest(`/matches/today?date=2025-11-08&limit=100`, "GET");
      return res.json();
    },
  },

  fixtures: {
    getTodayFixtures: async (): Promise<ApiFootballFixturesResponse> => {
      const res = await apiRequest(`/fixtures/today`, "GET");
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
      data: { message: string; tone?: string }
    ): Promise<{
      summary?: string;
      analysis?: string;
      message?: string;
      tokens?: Record<string, unknown>;
      [key: string]: unknown;
    }> => {
      const res = await apiRequest(`/fixtures/${fixtureId}/analyze`, "POST", data);
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
};
