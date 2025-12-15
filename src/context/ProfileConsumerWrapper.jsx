import React from "react";
import { useProfiles } from "./ProfileContext";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router-dom";

export default function ProfileConsumerWrapper({ children }) {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const { activeProfile, profiles, loading: profilesLoading } = useProfiles();
  const location = useLocation(); // Rutas donde es seguro/necesario permitir el renderizado AUN SIN PERFIL ACTIVO. // Esto permite que MovieList (en / o /movies) se renderice y muestre el formulario de creación.

  const safeRoutes = [
    "/profile",
    "/profile/new",
    "/login",
    "/register",
    "/unauthorized",
  ]; // Comprobar si la ruta actual es una ruta segura o si comienza con /movies (catálogo)

  const isSafeOrCatalogRoute =
    safeRoutes.includes(location.pathname) ||
    location.pathname === "/" ||
    location.pathname.startsWith("/movies"); // 1. ⏳ Esperar Autenticación

  if (authLoading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
         <p>Cargando sesión...</p>
      </div>
    );
  } // 2. 🚪 No logueado → Dejar que el Router decida (lo enviará a /login)

  if (!isAuthenticated) {
    return children;
  } // 3. ⏳ Esperar Perfiles

  if (profilesLoading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
       <p>Cargando perfiles...</p>
      </div>
    );
  } // 4. 🛑 Lógica de Bloqueo (Solo si la ruta NO es segura/catálogo) // 4a. No hay perfiles

  if (profiles.length === 0) {
    if (isSafeOrCatalogRoute) {
      // Si está en el Catálogo/Home/Profile, permite el renderizado (MovieList mostrará el formulario).
      return children;
    } // Bloqueo si intenta ir a una ruta restringida sin perfil (ej: /movies/123/edit)

    return (
      <div className="min-h-screen flex flex-col justify-center items-center pt-20 bg-gray-100 dark:bg-gray-900 text-center">
        <h2>Acceso Restringido</h2>
        <p>Necesitas crear un perfil para navegar en la aplicación.</p>       {" "}
        <button
          onClick={() => (window.location.href = "/")} // Forzar al Catálogo/Home
          className="mt-4 bg-pink-600 text-white p-2 rounded hover:bg-pink-700"
        >
           Crear Perfil Ahora 
        </button>
      
      </div>
    );
  } // 4b. Hay perfiles pero ninguno activo

  if (!activeProfile) {
    if (location.pathname === "/profile" || location.pathname === "/") {
      // Si está en /profile o Home, permite que el usuario seleccione.
      return children;
    } // Bloqueo si está en CUALQUIER otra ruta sin perfil activo (ej: /movies)

    return (
      <div className="min-h-screen flex flex-col justify-center items-center pt-20 bg-gray-100 dark:bg-gray-900 text-center">
       <h2>Perfil No Seleccionado</h2>
        <p>Por favor, selecciona un perfil para continuar.</p>       {" "}
        <button
          onClick={() => (window.location.href = "/profile")}
          className="mt-4 bg-pink-600 text-white p-2 rounded hover:bg-pink-700"
        >
              Ir a Perfiles 
        </button>
      
      </div>
    );
  } // 6. ✅ Todo OK → Dejar pasar el Router

  return <>{children}</>;
}
