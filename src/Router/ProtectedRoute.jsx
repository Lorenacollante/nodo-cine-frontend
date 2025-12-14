// src/Router/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protege rutas según autenticación y rol
 * @param {ReactNode} children - Componente de la página protegida
 * @param {string} requiredRole - Rol requerido (Ej: 'owner')
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  // Mientras se verifica sesión/token
  if (loading) {
    return (
      <div className="text-center p-8 text-lg font-semibold">
        Verificando sesión...
      </div>
    );
  }

  // No logueado → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Rol incorrecto → unauthorized
  if (requiredRole && user.role !== requiredRole) {
    console.warn(
      `Acceso denegado. Rol requerido: ${requiredRole}, rol actual: ${user.role}`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  // Autorizado ✅
  return children;
}
