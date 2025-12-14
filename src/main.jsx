import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// CONTEXTOS
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { MovieProvider } from "./context/MovieContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProfileConsumerWrapper from "./context/ProfileConsumerWrapper";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        
        {/* ✅ ESTE ERA EL FALTANTE */}
        <AuthProvider>
          <ProfileProvider>
            <ProfileConsumerWrapper>
              <MovieProvider>
                <App />
              </MovieProvider>
            </ProfileConsumerWrapper>
          </ProfileProvider>
        </AuthProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          theme="colored"
        />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
