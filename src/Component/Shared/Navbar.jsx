import React from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import useWatchilist from "../../Hooks/useWatchilist";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onWatchlistClick }) {
  const { toggleTheme, DarkMode } = useTheme();
  const watchlistContext = useWatchilist(); // Guardamos el contexto completo
  const { user, logout } = useAuth();

  // Usamos totalMovies del contexto para el contador
  const totalItems = watchlistContext?.totalMovies || 0;

  const isAdmin = user?.role === "admin" || user?.role === "owner"; // Roles permitidos

  return (
    <header className="bg-blue-400 dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-40">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* LOGO */}
        <NavLink
          to="/"
          className="text-2xl font-bold tracking-wide text-red-600"
        >
          Mi Lucero Films
        </NavLink>

        {/* LINKS */}
        <div className="flex space-x-6 text-gray-700 dark:text-gray-200 font-medium">
          <NavLink to="/" className="hover:text-red-500">
            Inicio
          </NavLink>
          <NavLink to="/movies" className="hover:text-red-500">
            Películas
          </NavLink>
          {isAdmin && (
            <NavLink to="/movies/create" className="hover:text-red-500">
              Agregar
            </NavLink>
          )}
        </div>

        {/* CONTROLES */}
        <div className="flex items-center space-x-4">
          {/* TEMA */}
          <button
            onClick={toggleTheme}
            className="text-xl hover:scale-110 transition"
            title="Cambiar modo"
          >
            {DarkMode ? "🌙" : "☀️"}
          </button>

          {/* WATCHLIST */}
          <button
            onClick={onWatchlistClick} // Aquí abrimos el modal
            className="text-2xl relative text-red-500 hover:scale-110 transition"
            title="Abrir Watchlist"
          >
            🎬
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* USUARIO */}
          {user ? (
            <>
              <NavLink
                to="/profile"
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Mi perfil
              </NavLink>
              <button
                onClick={logout}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/register"
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
              >
                Registrarse
              </NavLink>
              <NavLink
                to="/login"
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
