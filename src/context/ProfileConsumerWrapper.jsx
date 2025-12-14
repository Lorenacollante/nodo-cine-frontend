import React from "react";
import { useProfiles } from "./ProfileContext";
import { useAuth } from "./AuthContext";

export default function ProfileConsumerWrapper({ children }) {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const { activeProfile, profiles, loading: profilesLoading } = useProfiles();

  // ⏳ Esperar auth
  if (authLoading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <p>Cargando sesión...</p>
      </div>
    );
  }

  // 🚪 No logueado → router decide
  if (!isAuthenticated) {
    return children;
  }

  // ⏳ Esperar perfiles
  if (profilesLoading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <p>Cargando perfiles...</p>
      </div>
    );
  }

  // 🧑‍🦱 NO hay perfiles → dejar SOLO /profile renderizar
  if (profiles.length === 0) {
    return (
      <div className="w-full flex flex-col justify-center items-center py-20">
        <h2>No hay perfiles disponibles</h2>
        <p>Crea un perfil para continuar.</p>
      </div>
    );
  }

  // 🎯 Hay perfiles pero ninguno activo → bloquear app
  if (!activeProfile) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <p>Selecciona un perfil para continuar.</p>
      </div>
    );
  }

  // ✅ Todo OK
  return <>{children}</>;
}
