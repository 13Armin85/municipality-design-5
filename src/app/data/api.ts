import {
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  storeAuthTokens,
} from "../utils/authStorage";

const DEFAULT_DOTNET48_API_BASE_URL = "http://192.168.10.3:6300";
const DEFAULT_DOTNET10_API_BASE_URL = "http://192.168.10.3:6500";
const DEFAULT_PAYMENT_API_BASE_URL = "http://172.16.1.16:6101";

const normalizeBaseUrl = (value: string) => value.trim().replace(/\/+$/, "");

const firstEnvUrl = (...values: Array<string | undefined>) => {
  for (const value of values) {
    const normalizedValue = normalizeBaseUrl(value ?? "");
    if (normalizedValue) return normalizedValue;
  }

  return "";
};

const API_BASE_URL = import.meta.env.DEV
  ? firstEnvUrl(import.meta.env.VITE_DEV_API_BASE_URL, "")
  : firstEnvUrl(
      import.meta.env.VITE_API_BASE_URL,
      import.meta.env.VITE_API_URL,
      DEFAULT_DOTNET48_API_BASE_URL,
    );

const DOTNET10_API_BASE_URL = import.meta.env.DEV
  ? firstEnvUrl(
      import.meta.env.VITE_DEV_DOTNET10_API_BASE_URL,
      "/dotnet10-api",
    )
  : firstEnvUrl(
      import.meta.env.VITE_DOTNET10_API_BASE_URL,
      import.meta.env.VITE_DOTNET10_API_URL,
      DEFAULT_DOTNET10_API_BASE_URL,
    );

const PAYMENT_API_BASE_URL = import.meta.env.DEV
  ? firstEnvUrl(import.meta.env.VITE_DEV_PAYMENT_API_BASE_URL, "/payment-api")
  : firstEnvUrl(
      import.meta.env.VITE_PAYMENT_API_BASE_URL,
      DEFAULT_PAYMENT_API_BASE_URL,
    );

const DOTNET48_ACCEPT_HEADER = "text/plain";
const REFRESH_TOKEN_ENDPOINT =
  import.meta.env.VITE_REFRESH_TOKEN_ENDPOINT || "/api/auth/refresh-token";

let refreshRequest: Promise<string | null> | null = null;

const readAccessToken = () =>
  typeof window === "undefined"
    ? null
    : localStorage.getItem(AUTH_TOKEN_KEY)?.replace(/^Bearer\s+/i, "") ?? null;

async function refreshAccessToken() {
  if (typeof window === "undefined") return null;
  if (refreshRequest) return refreshRequest;

  refreshRequest = (async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;

    const response = await fetch(dotNet10ApiUrl(REFRESH_TOKEN_ENDPOINT), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "text/plain" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) return null;

    const text = await response.text().catch(() => "");
    const data = text ? JSON.parse(text) : {};
    storeAuthTokens(data);
    return readAccessToken();
  })()
    .catch(() => null)
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
}

async function fetchWithTokenRefresh(url: string, options?: RequestInit) {
  const originalHeaders = new Headers(options?.headers);
  const isAuthenticatedRequest = originalHeaders.has("Authorization");
  const response = await fetch(url, options);

  if (response.status !== 401 || !isAuthenticatedRequest) return response;

  const token = await refreshAccessToken();
  if (!token) return response;

  const retryHeaders = new Headers(options?.headers);
  retryHeaders.set("Authorization", `Bearer ${token}`);
  return fetch(url, { ...options, headers: retryHeaders });
}

function withDotNet48Headers(options?: RequestInit): RequestInit {
  const headers = new Headers(options?.headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", DOTNET48_ACCEPT_HEADER);
  }

  return {
    ...options,
    headers,
  };
}

export function dotNet10ApiUrl(endpoint: string) {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  return `${DOTNET10_API_BASE_URL}${normalizedEndpoint}`;
}

export function paymentApiUrl(endpoint: string) {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  return `${PAYMENT_API_BASE_URL}${normalizedEndpoint}`;
}

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const fetchOptions = withDotNet48Headers(options);

  if (/^https?:\/\//i.test(endpoint)) {
    return fetchWithTokenRefresh(endpoint, fetchOptions);
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  const url = API_BASE_URL
    ? `${API_BASE_URL}${normalizedEndpoint}`
    : normalizedEndpoint;

  return fetchWithTokenRefresh(url, fetchOptions);
}

export async function dotNet10ApiFetch(
  endpoint: string,
  options?: RequestInit,
) {
  return fetchWithTokenRefresh(dotNet10ApiUrl(endpoint), options);
}

export async function paymentApiFetch(
  endpoint: string,
  options?: RequestInit,
) {
  return fetchWithTokenRefresh(paymentApiUrl(endpoint), options);
}
