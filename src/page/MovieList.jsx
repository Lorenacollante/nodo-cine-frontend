// src/page/MovieList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useMovies } from "../context/MovieContext";
import { useProfiles } from "../context/ProfileContext";

import MovieCard from "../Component/MovieCard";
import SkeletonCard from "../Component/SkeletonCard";

export default function MovieList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- Contextos ---
  const {
    activeProfile,
    loading: loadingProfiles,
    profiles,
    createProfile,
    selectProfile,
  } = useProfiles();
  const {
    movies,
    loading: loadingMovies,
    error,
    fetchMovies,
    totalPages,
  } = useMovies();

  // --- Estado local ---
  const [newProfileName, setNewProfileName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // --- Filtros ---
  const filters = useMemo(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 9,
      search: searchParams.get("search") || "",
      year: searchParams.get("year") || "",
      genre: searchParams.get("genre") || "",
      sort: searchParams.get("sort") || "title:asc",
      maxRating: activeProfile?.maxAgeRating || "NC-17",
    }),
    [searchParams, activeProfile]
  );

  // --- Fetch de películas ---
  useEffect(() => {
    if (!loadingProfiles && activeProfile) {
      fetchMovies(filters);
    }
  }, [filters, fetchMovies, activeProfile, loadingProfiles]);

  // --- Actualizar query params ---
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "" || value === null) newParams.delete(key);
    else newParams.set(key, value);

    if (key !== "page") newParams.set("page", "1");
    setSearchParams(newParams);
  };

  // --- Crear perfil ---
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!newProfileName.trim()) {
      toast.error("El nombre del perfil es obligatorio.");
      return;
    }

    setIsCreating(true);
    await createProfile({ name: newProfileName.trim(), maxAgeRating: "NC-17" });
    setNewProfileName("");
    setIsCreating(false);
  };

  // --- Filtrado según perfil activo ---
  const ratingValue = (rating) => {
    const map = { G: 1, PG: 2, "PG-13": 3, R: 4, "NC-17": 5 };
    return map[rating] || 3;
  };

  const filteredMovies = movies.filter(
    (m) =>
      ratingValue(m.ageRating) <=
      ratingValue(activeProfile?.maxAgeRating || "NC-17")
  );

  /* -------------------------------------------------------------
        BLOQUEOS POR ESTADO
    ------------------------------------------------------------- */
  if (loadingProfiles) {
    return (
      <div className="text-center pt-20">
        <h1 className="text-2xl font-semibold text-blue-600">
          Cargando datos de perfil...
        </h1>
      </div>
    );
  }

  if (!activeProfile) {
    return (
      <div className="p-10 text-center max-w-lg mx-auto pt-20">
        <h2 className="text-3xl font-bold text-red-700 mb-4">
          🚫 No hay perfiles disponibles
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Crea tu primer perfil para acceder al catálogo.
        </p>

        <form
          onSubmit={handleCreateProfile}
          className="flex flex-col gap-4 bg-gray-50 p-6 rounded-xl shadow-lg"
        >
          <input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Nombre del Perfil (ej: Mi Perfil)"
            className="p-3 border border-gray-300 rounded-lg text-lg"
            disabled={isCreating}
            required
          />
          <button
            type="submit"
            disabled={isCreating}
            className="bg-green-600 text-white p-3 rounded-lg text-xl font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
          >
            {isCreating ? "Creando..." : "Crear Perfil y Acceder"}
          </button>
        </form>

        {profiles && profiles.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              O selecciona uno existente:
            </h3>
            <div className="flex justify-center flex-wrap gap-4">
              {profiles.map((p) => (
                <button
                  key={p._id}
                  onClick={() => selectProfile(p._id)}
                  className="bg-blue-500 text-white p-2 px-4 rounded hover:bg-blue-600 font-medium"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (loadingMovies) {
    return (
      <div className="container mx-auto p-4 pt-8">
        <h1 className="text-3xl font-bold mb-6 text-red-600 border-b pb-2">
          Catálogo de Películas
        </h1>
        <FilterUI filters={filters} updateParam={updateParam} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {Array(filters.limit)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center pt-20">
        <p className="text-xl font-semibold text-red-500 mb-4">
          Error al cargar películas
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  /* -------------------------------------------------------------
        RENDERIZADO PRINCIPAL
    ------------------------------------------------------------- */
  return (
    <div className="container mx-auto p-4 pt-8">
      <h1 className="text-3xl font-bold mb-6 text-red-600 border-b pb-2">
        Catálogo de Películas ({filteredMovies.length})
      </h1>

      <button
        onClick={() => navigate("/movies/create")}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Nueva Película
      </button>

      <FilterUI filters={filters} updateParam={updateParam} />

      {filteredMovies.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">
          No hay películas disponibles para este perfil.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}

      <PaginationUI
        filters={filters}
        totalPages={totalPages}
        updateParam={updateParam}
      />
    </div>
  );
}

/* -------------------------------------------------------------
    Filtros UI
------------------------------------------------------------- */
function FilterUI({ filters, updateParam }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        type="text"
        value={filters.search}
        onChange={(e) => updateParam("search", e.target.value)}
        placeholder="Buscar..."
        className="p-2 rounded border"
      />
      <input
        type="number"
        value={filters.year}
        onChange={(e) => updateParam("year", e.target.value)}
        placeholder="Año"
        className="p-2 rounded border"
      />
      <input
        type="text"
        value={filters.genre}
        onChange={(e) => updateParam("genre", e.target.value)}
        placeholder="Género"
        className="p-2 rounded border"
      />
      <select
        value={filters.sort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="p-2 rounded border"
      >
        <option value="title:asc">Título A-Z</option>
        <option value="title:desc">Título Z-A</option>
        <option value="year:desc">Año (recientes primero)</option>
        <option value="year:asc">Año (antiguos primero)</option>
      </select>
    </div>
  );
}

/* -------------------------------------------------------------
    Paginación UI
------------------------------------------------------------- */
function PaginationUI({ filters, totalPages, updateParam }) {
  if (totalPages <= 1) return null;
  const { page } = filters;

  return (
    <div className="mt-10 flex justify-center items-center gap-4">
      <button
        disabled={page <= 1}
        onClick={() => updateParam("page", page - 1)}
        className={`px-4 py-2 rounded ${
          page <= 1 ? "bg-gray-400" : "bg-pink-600 hover:bg-pink-700"
        } text-white`}
      >
        Anterior
      </button>
      <span className="text-lg font-semibold">
        Página {page} de {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => updateParam("page", page + 1)}
        className={`px-4 py-2 rounded ${
          page >= totalPages ? "bg-gray-400" : "bg-pink-600 hover:bg-pink-700"
        } text-white`}
      >
        Siguiente
      </button>
    </div>
  );
}
