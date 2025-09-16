import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "../context/authcontext.jsx";
import { ChatProvider } from "../context/chatcontext.jsx";  // ✅ FIXED

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ChatProvider>   {/* ✅ FIXED */}
        <App />
      </ChatProvider>
    </AuthProvider>
  </React.StrictMode>
);
