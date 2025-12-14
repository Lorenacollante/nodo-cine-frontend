import React from "react";
import useWatchilist from "../../Hooks/useWatchilist.js";

export default function WatchlistModal({ isOpen, onClose }) {
  const {
    movies: moviesFromHook, // usamos el nombre del hook actual
    removeMovie,
    clearMovie,
  } = useWatchilist();

  // Aseguramos que siempre sea un array
  const movies = Array.isArray(moviesFromHook) ? moviesFromHook : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50">
      <div className="bg-white dark:bg-gray-800 max-w-sm w-full h-full overflow-y-auto p-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-pink-600">🎬 Mi Watchlist</h3>
          <button onClick={onClose} className="text-2xl font-bold">
            &times;
          </button>
        </div>

        {movies.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            Tu lista está vacía 😔
          </p>
        ) : (
          <ul className="space-y-4">
            {movies.map((movie) => (
              <li
                key={movie._id ?? movie.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>{movie.title}</span>
                <button
                  onClick={() => removeMovie(movie._id ?? movie.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}

        {movies.length > 0 && (
          <button
            onClick={clearMovie}
            className="w-full mt-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            Vaciar Watchlist
          </button>
        )}
      </div>
    </div>
  );
}
