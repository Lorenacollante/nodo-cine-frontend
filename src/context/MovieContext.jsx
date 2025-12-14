// src/context/MovieContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";
import { useProfiles } from "./ProfileContext";

const MovieContext = createContext();

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context)
    throw new Error("useMovies debe usarse dentro de MovieProvider");
  return context;
};

export const MovieProvider = ({ children }) => {
  const { activeProfile, loading: loadingProfiles } = useProfiles();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // ==================================================================
  // Fetch de películas según perfil y filtros
  // ==================================================================
  const fetchMovies = useCallback(
    async ({
      page = 1,
      limit = 9,
      search = "",
      year = "",
      genre = "",
      sort = "title:asc",
    } = {}) => {
      if (!activeProfile) return;

      setLoading(true);
      setError(null);

      try {
        const { data } = await axiosClient.get("/movies", {
          params: {
            profileId: activeProfile.id,
            maxAge: activeProfile.maxAgeRating,
            page,
            limit,
            search,
            year,
            genre,
            sort,
          },
        });

        const normalized = data.movies.map((m) => ({
          ...m,
          id: String(m._id),
        }));
        setMovies(normalized);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error al cargar películas:", err);
        toast.error("No se pudieron cargar las películas");
        setMovies([]);
        setTotalPages(1);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [activeProfile]
  );

  // ==================================================================
  // Obtener película por ID
  // ==================================================================
  const getMovieById = useCallback(
    (id) =>
      movies.find(
        (m) => String(m._id) === String(id) || String(m.id) === String(id)
      ) || null,
    [movies]
  );

  // ==================================================================
  // Crear película con imagen aleatoria si no se proporciona
  // ==================================================================
  const createMovie = async (movieData) => {
    try {
      // Generar imagen aleatoria si no hay URL
      if (!movieData.image) {
        const genre = movieData.genres[0] || "general";
        movieData.image = `https://picsum.photos/400/300?random=${genre}-${Date.now()}`;
        toast.info("Imagen generada automáticamente.");
      }

      const { data } = await axiosClient.post("/movies", movieData);
      setMovies((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error("Error al crear película:", err);
      toast.error("No se pudo crear la película.");
      return null;
    }
  };

  // ==================================================================
  // Actualizar película
  // ==================================================================
  const updateMovie = async (id, movieData) => {
    try {
      const { data } = await axiosClient.put(`/movies/${id}`, movieData);
      setMovies((prev) =>
        prev.map((m) => (String(m.id) === String(id) ? data : m))
      );
      return data;
    } catch (err) {
      console.error("Error al actualizar película:", err);
      toast.error("No se pudo actualizar la película.");
      return null;
    }
  };

  // ==================================================================
  // Eliminar película
  // ==================================================================
  const deleteMovie = useCallback(async (id) => {
    try {
      await axiosClient.delete(`/movies/${id}`);
      setMovies((prev) => prev.filter((m) => String(m.id) !== String(id)));
      toast.success("Película eliminada correctamente.");
    } catch (err) {
      console.error("Error al eliminar película:", err);
      toast.error("No se pudo eliminar la película.");
      throw err;
    }
  }, []);

  // ==================================================================
  // Efecto: cargar películas cuando cambia el perfil
  // ==================================================================
  useEffect(() => {
    if (loadingProfiles) return;
    setMovies([]);
    setTotalPages(1);
    if (activeProfile) fetchMovies();
  }, [activeProfile, loadingProfiles, fetchMovies]);

  // ==================================================================
  // Context value
  // ==================================================================
  const value = useMemo(
    () => ({
      movies,
      loading,
      error,
      totalPages,
      fetchMovies,
      getMovieById,
      createMovie,
      updateMovie,
      deleteMovie,
    }),
    [movies, loading, error, totalPages, fetchMovies, getMovieById, deleteMovie]
  );

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
