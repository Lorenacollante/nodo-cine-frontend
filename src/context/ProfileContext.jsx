// src/context/ProfileContext.jsx
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
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export const useProfiles = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfiles debe usarse dentro de ProfileProvider");
  }
  return context;
};

const RESOURCE_NAME = "profiles";
const PROFILE_STORAGE_KEY = "activeProfileId";

// ============================================================================
// PROVIDER
// ============================================================================
export const ProfileProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [loading, setLoading] = useState(true);//tener en cuenta Lore

  // ============================================================================
  // 1. FETCH PROFILES — Protegido y seguro
  // ============================================================================
  const fetchProfiles = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    try {
      const res = await axiosClient.get(`/${RESOURCE_NAME}`);

      const normalized = res.data.map((p) => ({
        ...p,
        id: String(p._id),
      }));

      setProfiles(normalized);

      // ============================
      // VALIDAR PERFIL PERSISTIDO
      // ============================
      const storedId = localStorage.getItem(PROFILE_STORAGE_KEY);
      const storedProfile = normalized.find((p) => p.id === storedId);

      const initialProfile = storedProfile || normalized[0] || null;

      setActiveProfile(initialProfile);

      if (initialProfile) {
        localStorage.setItem(PROFILE_STORAGE_KEY, initialProfile.id);
      } else {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
      }
    } catch (err) {
      console.error("Error al cargar perfiles:", err);
      toast.error("No se pudieron cargar los perfiles");
      setProfiles([]);
      setActiveProfile(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // ============================================================================
  // 2. SELECCIONAR PERFIL
  // ============================================================================
  const selectProfile = useCallback(
    (profileId) => {
      const profile = profiles.find((p) => p.id === profileId);
      if (!profile) {
        toast.error("El perfil seleccionado no existe.");
        return;
      }

      setActiveProfile(profile);
      localStorage.setItem(PROFILE_STORAGE_KEY, profileId);
      toast.info(`Perfil cambiado: ${profile.name}`);
    },
    [profiles]
  );

  // ============================================================================
  // 3. CRUD COMPLETO — Requisito del docente
  // ============================================================================

  // CREATE ------------------------------------------------------------
  const createProfile = useCallback(
    async (payload) => {
      try {
        const { data } = await axiosClient.post(`/${RESOURCE_NAME}`, payload); // 🛑 NUEVO PERFIL CREADO (el backend debe devolver _id)

        const newProfile = {
          ...data,
          id: String(data._id),
        };

        // 1. ACTUALIZAR LISTA Y ACTIVAR (Actualización Inmediata)
        setProfiles((prev) => [...prev, newProfile]);
        setActiveProfile(newProfile);
        localStorage.setItem(PROFILE_STORAGE_KEY, newProfile.id);

        toast.success("Perfil creado y seleccionado."); // await fetchProfiles();
        // Ya no necesitamos fetchProfiles para activar, solo para sincronización posterior
        return data;
      } catch (err) {
        console.error("Error al crear perfil:", err);
        toast.error("No se pudo crear el perfil");
        return null;
      }
    },
    [
      /* Eliminamos la dependencia de fetchProfiles ya que ya no la llamamos aquí */
    ]
  );

  // UPDATE ------------------------------------------------------------
  const updateProfile = useCallback(
    async (id, payload) => {
      try {
        const { data } = await axiosClient.put(
          `/${RESOURCE_NAME}/${id}`,
          payload
        );
        toast.success("Perfil actualizado");
        await fetchProfiles();
        return data;
      } catch (err) {
        console.error("Error al actualizar perfil:", err);
        toast.error("No se pudo actualizar el perfil");
        return null;
      }
    },
    [fetchProfiles]
  );

  // DELETE ------------------------------------------------------------
  const deleteProfile = useCallback(
    async (id) => {
      try {
        await axiosClient.delete(`/${RESOURCE_NAME}/${id}`);
        toast.success("Perfil eliminado");

        // Si borramos el activo, seleccionar otro
        if (activeProfile?.id === id) {
          localStorage.removeItem(PROFILE_STORAGE_KEY);
        }

        await fetchProfiles();
        return true;
      } catch (err) {
        console.error("Error al eliminar perfil:", err);
        toast.error("No se pudo eliminar el perfil");
        return false;
      }
    },
    [fetchProfiles, activeProfile]
  );

  // ============================================================================
  // 4. EFECTOS
  // ============================================================================

  // Al iniciar sesión → cargar perfiles
  useEffect(() => {
    console.log("Estado de autenticación:", isAuthenticated);
    if (isAuthenticated) {
      fetchProfiles();
    } else {
      setProfiles([]);
      setActiveProfile(null);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
  }, [isAuthenticated, fetchProfiles]);

  // ============================================================================
  // 5. CONTEXTO EXPUESTO
  // ============================================================================
  const value = useMemo(
    () => ({
      profiles,
      activeProfile,
      loading,
      maxAgeRating: activeProfile?.maxAgeRating || null,
      selectProfile,

      // CRUD
      createProfile,
      updateProfile,
      deleteProfile,
      fetchProfiles,
    }),
    [
      profiles,
      activeProfile,
      loading,
      selectProfile,
      createProfile,
      updateProfile,
      deleteProfile,
      fetchProfiles,
    ]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
