// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Error class for API requests resulting in a 5xx status code.
 */
export class ApiError extends Error {
  constructor(
    url: string,
    public status: number,
    public responseBody: string,
  ) {
    super(`API error at ${url}, status ${status}: ${responseBody}`);
    this.name = 'ApiError';
  }
}

/**
 * Error class for unauthorized requests (401).
 */
export class UnauthorizedError extends Error {
  constructor(
    url: string,
    public status: number,
    public responseBody: Record<string, any>,
  ) {
    super(`Unauthorized request to ${url}, status ${status}`);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Error class for API requests resulting in a 4xx status code.
 */
export class ClientError extends Error {
  constructor(
    url: string,
    public status: number,
    public responseBody: Record<string, any>,
  ) {
    super(
      `Erroneous request to endpoint ${url}, status ${status}, code ${JSON.stringify(responseBody)}`,
    );
    this.name = 'ClientError';
  }
}

// Token management helpers
const TOKEN_KEY = 'access-token';

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
  const isResponseJson = res.headers
    .get('content-type')
    ?.includes('application/json');

  if (res.status === 401) {
    const responseBody = isResponseJson
      ? await res.json()
      : { code: 'UNKNOWN' };
    throw new UnauthorizedError(res.url, res.status, responseBody);
  } else if (res.status >= 400 && res.status < 500) {
    const responseBody = isResponseJson
      ? await res.json()
      : { code: 'UNKNOWN' };
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
  data: object = {},
): Promise<Response> => {
  const requestURL = API_BASE_URL + endpoint;
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const accessToken = getToken();
  if (accessToken) {
    headers.append('Authorization', `Bearer ${accessToken}`);
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (method !== 'GET' && Object.keys(data).length > 0) {
    config.body = JSON.stringify(data);
  }

  const res = await fetch(requestURL, config);
  return apiResponse(res);
};

// Auth API methods
export const api = {
  auth: {
    signup: async (data: {
      name: string;
      email: string;
      password: string;
      planId: string;
    }) => {
      const res = await apiRequest('/auth/signup', 'POST', data);
      const json = await res.json();
      if (json.token) {
        setToken(json.token);
      }
      return json;
    },

    login: async (data: { email: string; password: string }) => {
      const res = await apiRequest('/auth/login', 'POST', data);
      const json = await res.json();
      if (json.token) {
        setToken(json.token);
      }
      return json;
    },

    logout: async () => {
      removeToken();
      const res = await apiRequest('/auth/logout', 'POST');
      return res.json();
    },

    forgotPassword: async (data: { email: string }) => {
      const res = await apiRequest('/auth/forgot-password', 'POST', data);
      return res.json();
    },

    resetPassword: async (data: { token: string; password: string }) => {
      const res = await apiRequest('/auth/reset-password', 'POST', data);
      return res.json();
    },

    me: async () => {
      const res = await apiRequest('/auth/me', 'GET');
      return res.json();
    },
  },

  chat: {
    sendMessage: async (data: { message: string }) => {
      const res = await apiRequest('/chat', 'POST', data);
      return res.json();
    },

    getHistory: async () => {
      const res = await apiRequest('/chat/history', 'GET');
      return res.json();
    },
  },

  profile: {
    get: async () => {
      const res = await apiRequest('/profile', 'GET');
      return res.json();
    },

    update: async (data: { name?: string; email?: string }) => {
      const res = await apiRequest('/profile', 'PUT', data);
      return res.json();
    },

    getUsage: async () => {
      const res = await apiRequest('/profile/usage', 'GET');
      return res.json();
    },
  },

  insights: {
    list: async () => {
      const res = await apiRequest('/insights', 'GET');
      return res.json();
    },

    save: async (data: { title: string; content: string; tags: string[] }) => {
      const res = await apiRequest('/insights', 'POST', data);
      return res.json();
    },

    delete: async (id: string) => {
      const res = await apiRequest(`/insights/${id}`, 'DELETE');
      return res.json();
    },
  },
};
