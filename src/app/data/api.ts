const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

const DOTNET10_API_BASE_URL = (
  import.meta.env.VITE_DOTNET10_API_URL ?? "/dotnet10-api"
)
  .trim()
  .replace(/\/+$/, "");

export function dotNet10ApiUrl(endpoint: string) {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  return `${DOTNET10_API_BASE_URL}${normalizedEndpoint}`;
}

export async function apiFetch(endpoint: string, options?: RequestInit) {
  if (/^https?:\/\//i.test(endpoint)) {
    return fetch(endpoint, options);
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  const url = API_BASE_URL
    ? `${API_BASE_URL}${normalizedEndpoint}`
    : normalizedEndpoint;

  return fetch(url, options);
}

export async function dotNet10ApiFetch(
  endpoint: string,
  options?: RequestInit,
) {
  return fetch(dotNet10ApiUrl(endpoint), options);
}
