
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useProfiles } from "../context/ProfileContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient"; // 👈 para debug

export default function Profile() {
  const { user, logout } = useAuth();
  const {
    profiles,
    activeProfile,
    selectProfile,
    loading: loadingProfiles,
  } = useProfiles();

  const navigate = useNavigate();

  // 🔧 Redirección por token (evita problemas por HMR si user tarda en repoblarse)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // 🔎 Debug: ver datos que entran al componente
  useEffect(() => {
    console.log("[Profile] axios baseURL:", axiosClient.defaults.baseURL);
    console.log("[Profile] token presente?:", !!localStorage.getItem("token"));
    console.log("[Profile] user:", user);
    console.log("[Profile] loadingProfiles:", loadingProfiles);
    console.log("[Profile] profiles:", profiles);
  }, [user, loadingProfiles, profiles]);

  const handleSelectProfile = (profileId) => {
    selectProfile(profileId);             // guarda en contexto + localStorage
    navigate("/");                        // ir al home/catálogo
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-10 bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl max-w-xl w-full p-6">

        <h1 className="text-3xl font-extrabold mb-6 text-center text-pink-600 dark:text-pink-400">
          👤 Gestión de Perfiles
        </h1>

        <h2 className="text-xl font-bold mb-3 mt-4 text-gray-800 dark:text-gray-200">
          Perfiles Disponibles
        </h2>

        {loadingProfiles && (
          <p className="text-center py-4 text-gray-500">Cargando perfiles...</p>
        )}

        {/* Estado vacío explícito */}
        {!loadingProfiles && profiles.length === 0 && (
          <p className="text-center py-4 text-gray-500">
            No hay perfiles disponibles. Crea un perfil para continuar.
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b pb-5 border-gray-200 dark:border-gray-700">
          {profiles.map((profile) => (
            <button
              key={profile._id}
              onClick={() => handleSelectProfile(profile._id)}
              className={`p-4 rounded-lg text-center transition-all shadow-md 
                ${
                  activeProfile && activeProfile._id === profile._id
                    ? "bg-pink-600 text-white ring-4 ring-pink-300 dark:ring-pink-500"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-pink-100 dark:hover:bg-pink-700"
                }`}
              aria-label={`Seleccionar perfil ${profile.name}`}
            >
              <p className="font-bold text-lg">{profile.name}</p>
              <p className="text-sm mt-1">Rating: {profile.maxAgeRating ?? "NR"}</p>
              {activeProfile && activeProfile._id === profile._id && (
                <span className="text-xs font-semibold mt-1 block" aria-live="polite">
                  ACTIVO
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            className="w-full bg-green-500 text-white py-2 rounded font-bold hover:bg-green-600 transition"
            onClick={() => {
              toast.info("Abrir formulario de Creación de Perfil");
              // Si aún no implementaste el modal, quita el estado para evitar ESLint no-used-var
              // setIsModalOpen(true);
            }}
          >
            ➕ Crear Nuevo Perfil
          </button>
        </div>

        <h2 className="text-xl font-bold mb-3 mt-8 text-gray-800 dark:text-gray-200 border-t pt-5 border-gray-200 dark:border-gray-700">
          Información de la Cuenta
        </h2>

        <div className="space-y-3 text-gray-800 dark:text-gray-200">
          <Info label="Email Dueño" value={user?.email || "No disponible"} />
          <Info label="Rol Cuenta" value={user?.role || "No definido"} />
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-2 rounded hover:bg-gray-400"
            onClick={() => navigate("/movies")}
          >
            Volver al Catálogo
          </button>

          <button
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Si más adelante agregas modal, vuelve a declarar el estado aquí */}
      {/* const [isModalOpen, setIsModalOpen] = useState(false); */}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-300 dark:border-gray-700 pb-1">
      <span className="font-semibold">{label}:</span>
      <span>{value}</span>
    </div>
  );
}