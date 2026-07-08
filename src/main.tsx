import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initTelegramMiniApp } from "./telegram";
import "./styles.css";

initTelegramMiniApp();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
