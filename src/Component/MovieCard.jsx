import React from "react";
import { useNavigate } from "react-router-dom";

import { useMovies } from "../context/MovieContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Swal from "sweetalert2";

const FALLBACK_POSTER =
  "https://placehold.co/400x600/1e40af/ffffff?text=No+Image";

// Convierte 'public/imagen/...' -> '/imagen/...'
function normalizePublic(p) {
  if (!p) return p;
  return p.startsWith("public/") ? p.replace(/^public/, "") : p;
}

// Construye el src del poster priorizando posterUrl -> TMDb -> image
function buildPoster(movie) {
  if (!movie) return FALLBACK_POSTER;

  if (movie.posterUrl) return normalizePublic(movie.posterUrl);
  if (movie.poster_path)
    return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  if (movie.image) return normalizePublic(movie.image);

  return FALLBACK_POSTER;
}

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { deleteMovie } = useMovies();
  const { isAuthenticated, user } = useAuth();

  // Validación: datos mínimos
  if (!movie || !movie._id || !movie.title) return null;

  const isAdminOrOwner =
    isAuthenticated && user && (user.role === "admin" || user.role === "owner");

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: `Eliminar "${movie.title}"`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteMovie(movie._id);
        Swal.fire(
          "Eliminada",
          `La película "${movie.title}" ha sido eliminada.`,
          "success"
        );
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la película.", "error");
        console.error("Error al eliminar la película:", error);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] overflow-hidden">
      <img
        src={buildPoster(movie)}
        alt={movie.title}
        className="w-full h-72 object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = FALLBACK_POSTER;
        }}
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
          {movie.title}
        </h3>
        <p className="text-sm text-pink-600 mb-2">
          Año: {movie.year || movie.releaseYear || "N/A"} | Rating:{" "}
          {movie.ageRating ?? "N/A"}
        </p>

        {/* Botones CRUD (solo admin/owner) */}
        {isAdminOrOwner && (
          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => navigate(`/movies/${movie._id}/edit`)}
              className="flex items-center justify-center flex-1 bg-blue-500 text-white text-sm py-2 px-3 rounded-lg hover:bg-blue-600 transition"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center flex-1 bg-red-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-red-700 transition"
            >
              Eliminar
            </button>
          </div>
        )}

        {/* Botón de Detalle - Visible para todos */}
        <div className="mt-3">
          <button
            onClick={() => navigate(`/movies/${movie._id}`)}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
}
