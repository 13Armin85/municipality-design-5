export const AUTH_STORAGE_KEY = "municipality-user-authenticated";
export const AUTH_TYPE_KEY = "municipality-user-type";
export const AUTH_TOKEN_KEY = "auth-token";
export const USER_NATIONAL_CODE_KEY = "user-national-code";
export const THEME_STORAGE_KEY = "theme";

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
