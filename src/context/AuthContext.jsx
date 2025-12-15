import { createContext, useContext, useEffect, useState, useMemo } from "react";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

// =====================
// DECODIFICAR JWT
// =====================
const decodeJWT = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = "authToken";

  const isTokenValid = (token) => {
    const decoded = decodeJWT(token);
    if (!decoded?.exp) return false;
    return decoded.exp > Date.now() / 1000;
  };

  // =====================
  // LOGIN
  // =====================
  const login = async (credentials) => {
    try {
      const { data } = await axiosClient.post("/auth/login", credentials);
      const token = data.token;

      if (!isTokenValid(token)) {
        toast.error("Token inválido");
        return false;
      }

      localStorage.setItem(STORAGE_KEY, token);
      axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(decodeJWT(token));

      toast.success("Sesión iniciada");
      return true;
    } catch (error) {
      toast.error("Credenciales incorrectas");
      return false;
    }
  };

  // =====================
  // REGISTER  🔥 (ESTO FALTABA)
  // =====================
  const register = async (credentials) => {
    try {
      const { data } = await axiosClient.post("/auth/register", credentials);

      const token = data.token;

      if (!isTokenValid(token)) {
        toast.error("Token inválido");
        return false;
      }

      localStorage.setItem(STORAGE_KEY, token);
      axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(decodeJWT(token));

      toast.success("Cuenta creada correctamente");
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al registrar usuario"
      );
      return false;
    }
  };

  // =====================
  // LOGOUT
  // =====================
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    delete axiosClient.defaults.headers.common.Authorization;
    setUser(null);
    toast.info("Sesión cerrada");
  };

  // =====================
  // CARGAR  aqui errorverrr
  // =====================
  useEffect(() => {
    // Token de ejemplo real que obtuviste, decodificado para simular el usuario
    const SIMULATION_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5M2U1YTI4Y2EwMTkzOTdiYmExMzQxZSIsInJvbGUiOiJvd25lciIsImlhdCI6MTc2NTc3ODk5NSwiZXhwIjoxNzY1ODY1Mzk1fQ.9Njl-iYlCJF8fbQC8U52quCpZQ28r3UGGnfBOdrJmSs";
    const SIMULATION_USER = decodeJWT(SIMULATION_TOKEN); // Usamos la función decodeJWT ya definida

    if (SIMULATION_USER) {
        // Establecer el usuario y el token como si se hubiera logueado
        setUser(SIMULATION_USER);
        axiosClient.defaults.headers.common.Authorization = `Bearer ${SIMULATION_TOKEN}`;
    }
    /*const token = localStorage.getItem(STORAGE_KEY);

    if (token && isTokenValid(token)) {
      setUser(decodeJWT(token));
      axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }*/

    setLoading(false);
  }, []);

  // =====================
  // INTERCEPTOR 401
  // =====================
  useEffect(() => {
    const interceptor = axiosClient.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          toast.error("Tu sesión expiró");
        }
        return Promise.reject(error);
      }
    );

    return () => axiosClient.interceptors.response.eject(interceptor);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register, // ✅ AHORA SÍ
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// =====================
// HOOK useAuth
// =====================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
