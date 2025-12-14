// src/page/Unauthorized.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <h1 className="text-6xl font-extrabold text-red-600 mb-4">
        🚫 Acceso Denegado
      </h1>

      <h2 className="text-2xl font-semibold mb-4">
        No tenés permisos para acceder a esta página
      </h2>

      <p className="text-gray-600 mb-8">
        Tu cuenta no tiene los permisos necesarios para esta acción.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ir al inicio
        </button>

        <button
          onClick={() => navigate("/movies")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Volver al catálogo
        </button>
      </div>
    </div>
  );
}
