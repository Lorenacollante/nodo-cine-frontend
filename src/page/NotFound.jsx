import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 pt-20">
      <h1 className="text-9xl font-extrabold text-pink-600 dark:text-pink-400">
        404
      </h1>

      <h2 className="text-3xl font-semibold mt-4 mb-6 text-gray-800 dark:text-gray-100">
        ¡Oops! Página no encontrada.
      </h2>

      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Parece que la URL que solicitaste no existe.
      </p>

      <Link
        to="/movies"
        className="bg-pink-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-pink-700 transition"
      >
        Volver al Catálogo
      </Link>
    </div>
  );
}
