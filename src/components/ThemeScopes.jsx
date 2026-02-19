import React from "react";
import { useTheme } from "../context/ThemeContext";

export const UserThemeScope = ({ children }) => {
  const { userTheme } = useTheme();
  return (
    <div className={userTheme === "light" ? "user-theme-light min-h-screen" : "min-h-screen"}>
      {children}
    </div>
  );
};

export const AdminThemeScope = ({ children }) => {
  const { adminTheme } = useTheme();
  return (
    <div className={adminTheme === "light" ? "admin-theme-light min-h-screen" : "min-h-screen"}>
      {children}
    </div>
  );
};
