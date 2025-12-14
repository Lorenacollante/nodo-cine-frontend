import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavigateToCatalog = () => {
    if (isAuthenticated) {
      navigate("/movies");
    } else {
      navigate("/login");
    }
  };

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/imagen/corazon2.jpg')" }}
    >
      <section
        className="max-w-xl w-full rounded-3xl bg-gradient-to-r from-pink-600/80 to-purple-600/70 backdrop-blur-md shadow-2xl p-10 text-center border-2 border-pink-500"
        role="banner"
        aria-label="Pantalla principal"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
          🎬 Mi Lucero Films
        </h1>

        <p className="text-white/90 text-sm mb-2 italic drop-shadow">
          Tu plataforma de contenido exclusivo
        </p>

        <h2 className="text-3xl sm:text-4xl font-semibold mb-6 text-white drop-shadow">
          Catálogo de Películas
        </h2>

        <p className="text-white/1000 mb-8 leading-relaxed text-sm sm:text-base drop-shadow">
          Miles de títulos, cero complicaciones. Creá tu watchlist soñada y
          optimizá tu experiencia. Accedé al contenido que te enamora con la
          configuración de perfil perfecta para vos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleNavigateToCatalog}
            aria-label="Ir al catálogo"
            className="rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 font-bold text-white shadow-lg transform transition hover:scale-105 hover:from-pink-600 hover:to-red-600"
          >
            Explorar Catálogo
          </button>

          {isAuthenticated && (
            <button
              onClick={() => navigate("/movies/create")}
              aria-label="Agregar nueva película"
              className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-lg transform transition hover:scale-105 hover:from-blue-600 hover:to-indigo-600"
            >
              + Agregar Película
            </button>
          )}
        </div>

        <footer className="mt-6 text-xs text-white/70">
          Proyecto de Streaming · Gestión de Perfiles y Roles · Context API
        </footer>
      </section>
    </main>
  );
}
