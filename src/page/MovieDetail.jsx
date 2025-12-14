import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import { useAuth } from "../context/AuthContext";
import { useProfiles } from "../context/ProfileContext";
import useWatchilist from "../Hooks/useWatchilist";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const FALLBACK_POSTER = "/fallback-image.png";

// ------------------
// CONTROL PARENTAL
// ------------------
const AGE_RATING_ORDER = ["G", "PG", "PG-13", "R", "NC-17"];
const allowedByAge = (movie, profile) => {
  if (!movie || !profile) return true;
  return (
    AGE_RATING_ORDER.indexOf(movie.ageRating) <=
    AGE_RATING_ORDER.indexOf(profile.maxAgeRating)
  );
};

const BloqueoEdad = ({ onBack }) => (
  <div className="text-center mt-20 p-10 bg-red-100 rounded-lg shadow-md">
    <h2 className="text-3xl font-bold text-red-600 mb-4">
      Contenido bloqueado
    </h2>
    <p className="text-gray-700 mb-6">
      Este perfil no tiene permitido ver este tipo de contenido.
    </p>
    <button
      onClick={onBack}
      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
    >
      Volver al Catálogo
    </button>
  </div>
);

// ------------------
// Construye la URL de poster desde distintos campos
// ------------------
const buildPoster = (movie) => {
  if (!movie) return FALLBACK_POSTER;
  if (movie.posterUrl) return movie.posterUrl;
  if (movie.poster_path)
    return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  if (movie.image) return movie.image;
  return FALLBACK_POSTER;
};

// Normaliza el ID
const getMovieId = (movie) => movie?._id ?? movie?.id ?? movie?.apiId;

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMovieById, deleteMovie } = useMovies();
  const { user } = useAuth();
  const { activeProfile } = useProfiles();
  const { addMovie, removeMovie, hasItem } = useWatchilist();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [watchlistProcessing, setWatchlistProcessing] = useState(false);

  const canEdit = user?.role === "admin" || user?.role === "owner";

  // -------------------------
  // Cargar película
  // -------------------------
  useEffect(() => {
    let mounted = true;

    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedMovie = await getMovieById(id);
        if (!mounted) return;

        if (!fetchedMovie) {
          setError("Película no encontrada.");
        } else {
          setMovie(fetchedMovie);
        }
      } catch (err) {
        if (mounted) setError("Error al cargar la película.");
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMovie();
    return () => {
      mounted = false;
    };
  }, [id, getMovieById]);

  // -------------------------
  // Eliminar película
  // -------------------------
  const handleDeleteClick = async () => {
    if (!canEdit || deleting || !movie) return;

    const result = await MySwal.fire({
      title: `¿Eliminar "${movie.title}"?`,
      text: "Esta acción es irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setDeleting(true);
      try {
        await deleteMovie(getMovieId(movie));
        toast.success(`Película "${movie.title}" eliminada.`);
        navigate("/movies", { replace: true });
      } catch (err) {
        toast.error("Error al eliminar. Verifica tus permisos.");
        setDeleting(false);
      }
    }
  };

  // -------------------------
  // Watchlist
  // -------------------------
  const handleWatchlistClick = async () => {
    if (!movie || watchlistProcessing) return;

    setWatchlistProcessing(true);
    const idForWatchlist = getMovieId(movie);

    if (!idForWatchlist) {
      toast.error("No se pudo identificar la película.");
      setWatchlistProcessing(false);
      return;
    }

    try {
      const currentlyInWatchlist = hasItem(idForWatchlist);

      setMovie((prev) => ({
        ...prev,
        _inWatchlistTemp: !currentlyInWatchlist,
      }));

      if (currentlyInWatchlist) removeMovie(idForWatchlist);
      else addMovie(movie);

      toast.info(
        currentlyInWatchlist
          ? `"${movie.title}" removida de Watchlist`
          : `"${movie.title}" añadida a Watchlist`
      );
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar Watchlist.");
    } finally {
      setWatchlistProcessing(false);
      setMovie((prev) => ({ ...prev, _inWatchlistTemp: undefined }));
    }
  };

  const inWatchlist = movie
    ? movie._inWatchlistTemp ?? hasItem(getMovieId(movie))
    : false;

  // -------------------------
  // Control Parental
  // -------------------------
  if (movie && activeProfile && !allowedByAge(movie, activeProfile)) {
    return <BloqueoEdad onBack={() => navigate("/movies")} />;
  }

  // -------------------------
  // UI: carga, error, vacío
  // -------------------------
  if (loading)
    return <div className="text-center pt-20">Cargando detalles...</div>;
  if (error)
    return <div className="text-center pt-20 text-red-500">{error}</div>;
  if (!movie)
    return <div className="text-center pt-20">Película no disponible.</div>;

  // -------------------------
  // Render normal
  // -------------------------
  return (
    <div className="container mx-auto p-4 pt-10">
      <button
        onClick={() => navigate("/movies")}
        className="mb-6 text-pink-600 hover:text-pink-800 transition"
      >
        ← Volver al Catálogo
      </button>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Imagen */}
        <div className="md:w-1/3">
          <img
            src={buildPoster(movie)}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_POSTER;
            }}
          />
        </div>

        {/* Detalles */}
        <div className="md:w-2/3 p-6">
          <h1 className="text-4xl font-extrabold mb-3 text-gray-900 dark:text-white">
            {movie.title}
          </h1>

          <div className="mb-6 flex flex-wrap gap-3 items-center">
            <span className="text-lg font-semibold text-pink-600 bg-pink-100 dark:bg-pink-900 px-3 py-1 rounded-full">
              {typeof movie.rating === "number"
                ? `Rating: ${movie.rating}`
                : movie.ageRating
                ? `Clasificación: ${movie.ageRating}`
                : "Clasificación: N/A"}
            </span>
            <span className="text-lg text-gray-600 dark:text-gray-400">
              Año: {movie.year ?? movie.releaseYear ?? "Desconocido"}
            </span>
          </div>

          <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
            Sinopsis
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {movie.description ??
              movie.overview ??
              "Sin descripción disponible."}
          </p>

          {/* Watchlist */}
          <button
            onClick={handleWatchlistClick}
            disabled={watchlistProcessing}
            aria-busy={watchlistProcessing}
            className={`w-full py-3 rounded-lg font-bold transition mb-4 ${
              inWatchlist
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-pink-600 text-white hover:bg-pink-700"
            }`}
          >
            {watchlistProcessing
              ? "Procesando..."
              : inWatchlist
              ? "Ya en Watchlist"
              : "Añadir a Watchlist"}
          </button>

          {/* CRUD */}
          {canEdit && (
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => navigate(`/movies/${getMovieId(movie)}/edit`)}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-md hover:bg-blue-600 transition"
              >
                Editar Película
              </button>
              <button
                onClick={handleDeleteClick}
                disabled={deleting}
                className={`flex-1 bg-red-500 text-white py-2 rounded-lg text-md transition ${
                  deleting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-600"
                }`}
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
