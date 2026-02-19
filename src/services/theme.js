const LEGACY_THEME_STORAGE_KEY = "kyro_theme";
const USER_THEME_STORAGE_KEY = "kyro_user_theme";
const ADMIN_THEME_STORAGE_KEY = "kyro_admin_theme";

const safeTheme = (theme) => (theme === "light" ? "light" : "dark");

export const getStoredUserTheme = () => {
  const stored =
    localStorage.getItem(USER_THEME_STORAGE_KEY) ??
    localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
  return safeTheme(stored);
};

export const setStoredUserTheme = (theme) => {
  const nextTheme = safeTheme(theme);
  localStorage.setItem(USER_THEME_STORAGE_KEY, nextTheme);
  localStorage.setItem(LEGACY_THEME_STORAGE_KEY, nextTheme);
};

export const getStoredAdminTheme = () => {
  const stored = localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
  return safeTheme(stored);
};

export const setStoredAdminTheme = (theme) => {
  localStorage.setItem(ADMIN_THEME_STORAGE_KEY, safeTheme(theme));
};
