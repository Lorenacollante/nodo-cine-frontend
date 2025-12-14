import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import { toast } from "react-toastify";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const RATING_OPTIONS = ["G", "PG", "PG-13", "R", "NC-17"];

/* ---------------------------- Helpers Imagen ---------------------------- */

function toRelativeIfSameOrigin(p) {
  if (!p) return p;
  try {
    const u = new URL(p);
    return u.pathname;
  } catch {
    return p;
  }
}

function isHttpUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizePublicPath(p) {
  if (!p) return p;
  return p.startsWith("public/") ? p.replace(/^public/, "") : p;
}

function ensureLeadingSlash(p) {
  if (!p) return p;
  if (isHttpUrl(p)) return p;
  return p.startsWith("/") ? p : `/${p}`;
}

/* ---------------------------- Yup Schema ---------------------------- */

const MovieSchema = Yup.object().shape({
  title: Yup.string().required("El título es obligatorio."),
  description: Yup.string().required("La descripción es obligatoria."),
  rating: Yup.string()
    .oneOf(RATING_OPTIONS, "Clasificación inválida.")
    .required("La clasificación es obligatoria."),
  image: Yup.string()
    .nullable()
    .test("valid-path", "La URL de la imagen no es válida.", (value) => {
      if (!value) return true;
      return isHttpUrl(value) || value.startsWith("/");
    }),
});

/* ---------------------------- Componente Principal ---------------------------- */

export default function MovieEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMovieById, updateMovie } = useMovies();

  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(MovieSchema),
    defaultValues: {
      title: "",
      description: "",
      rating: "G",
      image: "",
    },
  });

  const imageValue = watch("image"); // <- capturamos el valor del input para PreviewImage

  /* ---------------------------- Load Movie ---------------------------- */

  useEffect(() => {
    let mounted = true;

    const loadMovie = async () => {
      try {
        const movie = await getMovieById(id);
        if (!mounted) return;

        if (!movie) {
          toast.error("Película no encontrada.");
          navigate("/movies", { replace: true });
          return;
        }

        const normalizedImage = ensureLeadingSlash(
          normalizePublicPath(toRelativeIfSameOrigin(movie.image || ""))
        );

        setValue("title", movie.title || "");
        setValue("description", movie.description || "");
        setValue("rating", movie.rating || "G");
        setValue("image", normalizedImage || "");

        setImgError(!movie.image);
      } catch {
        toast.error("No se pudo cargar la película.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadMovie();
    return () => {
      mounted = false;
    };
  }, [id, navigate, getMovieById, setValue]);

  /* ---------------------------- Submit ---------------------------- */

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      payload.image = ensureLeadingSlash(
        normalizePublicPath(toRelativeIfSameOrigin(payload.image))
      );

      await updateMovie(id, payload);
      toast.success("Película actualizada correctamente.");
      navigate(`/movies/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo actualizar la película.");
    }
  };

  if (loading) return <p className="text-center p-8">Cargando película...</p>;

  return (
    <main className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-pink-600">Editar Película</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Título */}
        <div>
          <label className="block mb-1 font-medium">Título</label>
          <input
            type="text"
            {...register("title")}
            className="w-full p-2 border rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block mb-1 font-medium">Descripción</label>
          <textarea
            {...register("description")}
            className="w-full p-2 border rounded"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Rating */}
        <div>
          <label className="block mb-1 font-medium">Clasificación</label>
          <select {...register("rating")} className="w-full p-2 border rounded">
            {RATING_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
          )}
        </div>

        {/* Imagen */}
        <div>
          <label className="block mb-1 font-medium">URL de Imagen</label>
          <input
            type="text"
            {...register("image")}
            className="w-full p-2 border rounded"
            onChange={() => setImgError(false)}
          />

          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
          )}

          {imgError && (
            <p className="text-sm text-red-500 mt-1">
              No se encontró la imagen.
            </p>
          )}

          {/* Previsualización */}
          <PreviewImage image={imageValue} />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded text-white font-bold ${
            isSubmitting ? "bg-gray-400" : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {isSubmitting ? "Guardando..." : "Actualizar Película"}
        </button>
      </form>
    </main>
  );
}

/* ---------------------------- Componente de Previsualización ---------------------------- */
function PreviewImage({ image }) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }
    const normalized = ensureLeadingSlash(normalizePublicPath(image));
    setPreview(normalized);
  }, [image]);

  if (!preview) return null;

  return (
    <div className="mt-2">
      <img
        src={preview}
        alt="Vista previa"
        className="w-40 h-60 object-cover rounded border"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://placehold.co/160x240/1e40af/ffffff?text=No+Image";
        }}
      />
    </div>
  );
}
