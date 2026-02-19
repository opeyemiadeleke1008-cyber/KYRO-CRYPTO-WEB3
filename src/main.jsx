import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { UserFinanceProvider } from "./context/UserFinanceContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UserFinanceProvider>
          <App />
        </UserFinanceProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
