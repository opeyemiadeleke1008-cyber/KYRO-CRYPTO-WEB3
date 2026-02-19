/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from "react";
import {
  getStoredAdminTheme,
  getStoredUserTheme,
  setStoredAdminTheme,
  setStoredUserTheme,
} from "../services/theme";

const ThemeContext = createContext(null);

const safeTheme = (theme) => (theme === "light" ? "light" : "dark");

export const ThemeProvider = ({ children }) => {
  const [userThemeState, setUserThemeState] = useState(getStoredUserTheme);
  const [adminThemeState, setAdminThemeState] = useState(getStoredAdminTheme);

  const setUserTheme = (theme) => {
    const nextTheme = safeTheme(theme);
    setUserThemeState(nextTheme);
    setStoredUserTheme(nextTheme);
  };

  const setAdminTheme = (theme) => {
    const nextTheme = safeTheme(theme);
    setAdminThemeState(nextTheme);
    setStoredAdminTheme(nextTheme);
  };

  const value = useMemo(
    () => ({
      userTheme: userThemeState,
      adminTheme: adminThemeState,
      setUserTheme,
      setAdminTheme,
    }),
    [userThemeState, adminThemeState],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
