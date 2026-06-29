const DEFAULT_DOTNET48_API_BASE_URL = "http://192.168.10.3:6300";
const DEFAULT_DOTNET10_API_BASE_URL = "http://192.168.10.3:6500";

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

const DOTNET48_ACCEPT_HEADER = "text/plain";

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

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const fetchOptions = withDotNet48Headers(options);

  if (/^https?:\/\//i.test(endpoint)) {
    return fetch(endpoint, fetchOptions);
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  const url = API_BASE_URL
    ? `${API_BASE_URL}${normalizedEndpoint}`
    : normalizedEndpoint;

  return fetch(url, fetchOptions);
}

export async function dotNet10ApiFetch(
  endpoint: string,
  options?: RequestInit,
) {
  return fetch(dotNet10ApiUrl(endpoint), options);
}
