// src/api/axiosClient.js

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

/**
 * BaseURL: usa VITE_API_BASE si existe, si no, intenta VITE_API_URL,
 * y por último cae a http://localhost:3000
 */
const BASE_URL =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10s
  withCredentials: false, // si no usás cookies/sessions podés poner false
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================================
   Helpers
================================ */

/**
 * Valida si el token JWT está vigente.
 */
const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded?.exp && decoded.exp > now;
  } catch {
    return false;
  }
};

/**
 * Evita redirecciones múltiples a /login si ya estás ahí.
 */
const safeRedirectToLogin = () => {
  const alreadyInLogin = window.location.pathname === "/login";
  if (!alreadyInLogin) {
    window.location.href = "/login";
  }
};

/* ================================
   Request Interceptor
================================ */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const profileId = localStorage.getItem("profileId"); // perfil activo

    // ✅ Token válido → set Authorization
    if (token && isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
      // token inválido → limpiar y redirigir
      localStorage.removeItem("token");
      toast.info("Sesión vencida. Iniciá sesión nuevamente.");
      safeRedirectToLogin();
    }

    // ✅ Enviar perfil activo si existe (muchos endpoints lo requieren)
    if (profileId) {
      config.headers["x-profile-id"] = profileId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   Response Interceptor
================================ */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // ❌ Sin respuesta del servidor (network error / timeout)
    if (!error.response) {
      toast.error("No se pudo conectar con el servidor.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // ✅ Token inválido o vencido desde backend
    if (status === 401) {
      localStorage.removeItem("token");
      toast.warning("Tu sesión expiró.");
      safeRedirectToLogin();
    }

    // 🔒 Prohibido
    if (status === 403) {
      toast.error("No estás autorizado para esta acción.");
    }

    // ❌ Validación del backend (400) — mostrar mensaje si existe
    if (status === 400 && data?.message) {
      toast.error(data.message);
    }

    // ❌ Error servidor
    if (status >= 500) {
      toast.error("Error interno del servidor.");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
