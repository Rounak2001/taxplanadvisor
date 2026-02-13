import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// Mock navigator.vibrate to avoid [Intervention] errors in cross-origin iframes
if (typeof navigator !== 'undefined' && navigator.vibrate) {
  navigator.vibrate = () => false;
}
if (typeof navigator !== 'undefined' && !navigator.vibrate) {
  navigator.vibrate = () => false;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
