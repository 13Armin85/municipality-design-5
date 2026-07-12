export const AUTH_STORAGE_KEY = "municipality-user-authenticated";
export const AUTH_TYPE_KEY = "municipality-user-type";
export const AUTH_TOKEN_KEY = "auth-token";
export const REFRESH_TOKEN_KEY = "refresh-token";
export const USER_NATIONAL_CODE_KEY = "user-national-code";
export const THEME_STORAGE_KEY = "theme";

const firstTokenValue = (data: any, keys: string[]) => {
  const containers = [data, data?.value, data?.Value];
  for (const container of containers) {
    if (!container || typeof container !== "object") continue;
    for (const key of keys) {
      if (container[key]) return String(container[key]);
    }
  }
  return null;
};

export function getAccessTokenFromPayload(data: unknown) {
  return firstTokenValue(data, ["accessToken", "AccessToken", "access_token", "token", "Token"]);
}

export function getRefreshTokenFromPayload(data: unknown) {
  return firstTokenValue(data, ["refreshToken", "RefreshToken", "refresh_token"]);
}

export function storeAuthTokens(data: unknown, accessToken?: string | null) {
  if (typeof window === "undefined") return;

  const resolvedAccessToken = accessToken ?? getAccessTokenFromPayload(data);
  const refreshToken = getRefreshTokenFromPayload(data);
  if (resolvedAccessToken) {
    localStorage.setItem(AUTH_TOKEN_KEY, resolvedAccessToken.replace(/^Bearer\s+/i, ""));
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function hasStoredAuthSession() {
  if (typeof window === "undefined") return false;

  return (
    localStorage.getItem(AUTH_STORAGE_KEY) === "true" ||
    Boolean(localStorage.getItem(AUTH_TOKEN_KEY))
  );
}

export function clearLocalStorageExceptTheme() {
  if (typeof window === "undefined") return;

  const theme = localStorage.getItem(THEME_STORAGE_KEY);
  localStorage.clear();

  if (theme !== null) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}
