const THEME_STORAGE_KEY = "kyro_theme";

export const applyTheme = (theme) => {
  const safeTheme = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", safeTheme);
  document.body.classList.toggle("theme-light", safeTheme === "light");
};

export const getStoredTheme = () => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
};

export const setStoredTheme = (theme) => {
  const safeTheme = theme === "light" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, safeTheme);
  applyTheme(safeTheme);
};

export const initializeTheme = () => {
  applyTheme(getStoredTheme());
};
