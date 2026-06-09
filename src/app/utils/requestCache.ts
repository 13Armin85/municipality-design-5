const REQUEST_CACHE_PREFIX = "municipality-request-cache:";

type CacheRecord<T> = {
  value: T;
};

const normalizeCachePart = (part: unknown) =>
  String(part ?? "")
    .trim()
    .replace(/\s+/g, " ");

export const requestCacheKey = (...parts: unknown[]) =>
  `${REQUEST_CACHE_PREFIX}${parts.map(normalizeCachePart).join("|")}`;

export const propertyFileCacheKey = (nationalCode: string) =>
  requestCacheKey("file", nationalCode);

export const serviceDataCacheKey = (
  serviceName: string,
  ...parts: unknown[]
) => requestCacheKey("service", serviceName, ...parts);

export const readRequestCache = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null;

  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return null;

    return (JSON.parse(rawValue) as CacheRecord<T>).value ?? null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const writeRequestCache = <T,>(key: string, value: T) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify({ value } satisfies CacheRecord<T>));
  } catch {
    // Cache writes are best-effort; the live request has already succeeded.
  }
};

export const fetchJsonWithCache = async <T,>(
  key: string,
  fetcher: () => Promise<T>,
  options: { force?: boolean } = {},
) => {
  if (!options.force) {
    const cachedValue = readRequestCache<T>(key);
    if (cachedValue !== null) return cachedValue;
  }

  const freshValue = await fetcher();
  writeRequestCache(key, freshValue);
  return freshValue;
};

type CachedFetchResponse = {
  body: string;
  headers: [string, string][];
  status: number;
  statusText: string;
};

const shouldCacheFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  if (init?.cache !== "force-cache") return false;

  const method =
    init?.method ?? (input instanceof Request ? input.method : "GET");
  if (method.toUpperCase() !== "GET") return false;

  const url = new URL(
    input instanceof Request ? input.url : String(input),
    window.location.origin,
  );

  if (url.origin !== window.location.origin) return false;
  if (!url.pathname.startsWith("/api/")) return false;
  if (url.pathname === "/api/request/new") return false;
  if (init?.cache === "no-store" || init?.cache === "reload") return false;

  return true;
};

const getFetchAuthKey = (init?: RequestInit) => {
  const headers = new Headers(init?.headers);
  return headers.get("Authorization") ?? "";
};

export const installRequestFetchCache = () => {
  if (typeof window === "undefined") return;

  const cacheWindow = window as typeof window & {
    __municipalityFetchCacheInstalled?: boolean;
  };

  if (cacheWindow.__municipalityFetchCacheInstalled) return;
  cacheWindow.__municipalityFetchCacheInstalled = true;

  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    if (!shouldCacheFetch(input, init)) {
      return nativeFetch(input, init);
    }

    const url = new URL(
      input instanceof Request ? input.url : String(input),
      window.location.origin,
    );
    const cacheKey = requestCacheKey("fetch", url.pathname, url.search, getFetchAuthKey(init));
    const cachedResponse = readRequestCache<CachedFetchResponse>(cacheKey);

    if (cachedResponse) {
      return new Response(cachedResponse.body, {
        headers: cachedResponse.headers,
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
      });
    }

    const response = await nativeFetch(input, init);

    if (response.ok) {
      const responseClone = response.clone();
      writeRequestCache<CachedFetchResponse>(cacheKey, {
        body: await responseClone.text(),
        headers: Array.from(responseClone.headers.entries()),
        status: responseClone.status,
        statusText: responseClone.statusText,
      });
    }

    return response;
  };
};
