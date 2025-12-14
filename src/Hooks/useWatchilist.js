// src/hooks/useWatchlist.js
import { useState, useEffect } from "react";

export default function useWatchilist(key = "watchilist") {
  // Cambié `movie` por `movies` para que sea más claro que se maneja una lista
  const [movies, setMovies] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error al leer desde localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    console.log("Watchilist actualizada:", movies);
    localStorage.setItem(key, JSON.stringify(movies));
  }, [movies, key]); // Se actualiza cuando `movies` cambian

  const addMovie = (movie) => {
    setMovies((prev) => {
      if (prev.some((mv) => mv._id === movie._id)) return prev;
      return [...prev, movie];
    });
  };

  const removeMovie = (id) => {
    setMovies((prev) => prev.filter((m) => m._id !== id));
  };

  const clearMovies = () => setMovies([]); // Renombrado para mantener consistencia

  const hasItem = (id) => movies.some((m) => m._id === id);

  return { movies, addMovie, removeMovie, clearMovies, hasItem }; // Renombrado a `movies`
}
