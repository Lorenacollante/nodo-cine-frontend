import React from "react";
import useWatchilist from "../../Hooks/useWatchilist";

export default function WatchlistPanel() {
  const { movies, removeMovie, clearMovie } = useWatchilist();
  const totalMovies = movies.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 md:p-6 h-full border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-pink-600 dark:text-pink-300 border-b pb-2 border-pink-200 dark:border-pink-900 flex items-center justify-between">
        <span>🎬 Mi Watchlist</span>
        <span className="text-pink-600 dark:text-pink-400 text-lg">
          ({totalMovies})
        </span>
      </h2>

      {totalMovies === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Tu lista está vacía 😔
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Agregá películas a tu Watchlist
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {movies.map((movie) => (
              <div
                key={movie._id}
                className="flex items-center space-x-4 border-b pb-4 last:border-b-0 last:pb-0 border-gray-100 dark:border-gray-700"
              >
                <img
                  src={movie.image || movie.posterUrl || "/fallback-image.png"}
                  alt={movie.title}
                  className="w-16 h-16 object-cover rounded-md shadow-sm border border-gray-200 dark:border-gray-600"
                />
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight line-clamp-2">
                    {movie.title}
                  </p>
                </div>
                <button
                  onClick={() => removeMovie(movie._id)}
                  className="text-red-500 hover:text-red-700 transition"
                  aria-label="Eliminar"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={clearMovie} // Usamos `clearMovies`
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-pink-700 transition-colors duration-200 shadow-lg"
            >
              Vaciar Watchlist
            </button>
          </div>
        </>
      )}
    </div>
  );
}
