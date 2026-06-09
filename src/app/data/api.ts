const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

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
