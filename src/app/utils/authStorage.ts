export const AUTH_STORAGE_KEY = "municipality-user-authenticated";
export const AUTH_TYPE_KEY = "municipality-user-type";
export const THEME_STORAGE_KEY = "theme";

export function clearLocalStorageExceptTheme() {
  if (typeof window === "undefined") return;

  const theme = localStorage.getItem(THEME_STORAGE_KEY);
  localStorage.clear();

  if (theme !== null) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}
