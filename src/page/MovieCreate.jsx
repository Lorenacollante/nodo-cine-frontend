// src/page/MovieCreate.jsx
import React, { useEffect, useState } from "react";
import { useMovies } from "../context/MovieContext";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const CURRENT_YEAR = new Date().getFullYear();

// ---------------------------- VALIDACIÓN YUP ----------------------------
const schema = Yup.object({
  title: Yup.string()
    .trim()
    .min(2, "El título debe tener al menos 2 caracteres")
    .required("El título es obligatorio"),
  description: Yup.string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .required("La descripción es obligatoria"),
  year: Yup.number()
    .typeError("Debe ser un número")
    .min(1895, "Año no válido")
    .max(CURRENT_YEAR + 1, "Año fuera de rango")
    .required("El año es obligatorio"),
  genresInput: Yup.string()
    .required("Debes ingresar géneros")
    .test("valid-genres", "Formato inválido. Ej: Acción, Drama", (value) =>
      value
        .split(",")
        .map((g) => g.trim())
        .every((g) => /^[A-Za-zÁÉÍÓÚÑ ]+$/i.test(g))
    ),
  ageRating: Yup.string()
    .oneOf(["G", "PG", "PG-13", "R", "NC-17"], "Clasificación inválida")
    .required("La clasificación es obligatoria"),
  image: Yup.string()
    .trim()
    .notRequired()
    .test(
      "valid-image",
      "Debe ser URL http(s) o ruta local que comience con '/'",
      (val) => {
        if (!val) return true;
        if (/^https?:\/\//.test(val)) return true;
        if (val.startsWith("/")) return true;
        return false;
      }
    ),
  trailerUrl: Yup.string()
    .trim()
    .notRequired()
    .test("valid-url", "Debe ser una URL válida", (val) => {
      if (!val) return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }),
});

// ---------------------------- ESTADO INICIAL ----------------------------
const INITIAL_STATE = {
  title: "",
  description: "",
  year: "",
  genresInput: "",
  ageRating: "",
  image: "",
  existingImage: "",
  trailerUrl: "",
};

// ---------------------------- COMPONENTE PREVIEW DE IMAGEN ----------------------------
function ImagePreview({ image }) {
  const [loaded, setLoaded] = useState(false);

  if (!image) return null;

  return (
    <div className="mt-2">
      {!loaded && (
        <div className="w-40 h-60 bg-gray-200 flex items-center justify-center rounded border text-gray-500">
          Cargando...
        </div>
      )}
      <img
        src={image}
        alt="Vista previa"
        className={`w-40 h-60 object-cover rounded border transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://placehold.co/160x240/1e40af/ffffff?text=No+Image";
          setLoaded(true);
        }}
      />
    </div>
  );
}

// ---------------------------- COMPONENTE PRINCIPAL ----------------------------
export default function MovieCreate({ isEdit = false }) {
  const { createMovie, updateMovie, getMovieById } = useMovies();
  const navigate = useNavigate();
  const { id } = useParams();
  const [preview, setPreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: INITIAL_STATE,
  });

  const watchImage = watch("image");
  const watchExisting = watch("existingImage");

  // ---------------------------- Actualizar preview ----------------------------
  useEffect(() => {
    if (watchImage?.trim()) setPreview(watchImage.trim());
    else if (watchExisting?.trim()) setPreview(watchExisting.trim());
    else setPreview("");
  }, [watchImage, watchExisting]);

  // ---------------------------- Cargar datos si es edición ----------------------------
  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        const movie = await getMovieById(id);
        if (!movie) return toast.error("Película no encontrada");

        reset({
          title: movie.title,
          description: movie.description,
          year: movie.year,
          genresInput: movie.genres.join(", "),
          ageRating: movie.ageRating,
          image: "",
          existingImage: movie.image,
          trailerUrl: movie.trailerUrl || "",
        });
      })();
    }
  }, [isEdit, id, reset, getMovieById]);

  // ---------------------------- SUBMIT ----------------------------
  const onSubmit = async (data) => {
    const genres = data.genresInput
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    // Normalizar imagen
    let imageURL = data.image.trim() || data.existingImage;
    if (!imageURL) {
      imageURL = `https://picsum.photos/400/300?random=${Date.now()}`;
      toast.info("Imagen generada automáticamente.");
    }

    const payload = {
      title: data.title.trim(),
      description: data.description.trim(),
      ageRating: data.ageRating,
      image: imageURL,
      year: Number(data.year),
      genres,
      //trailerUrl: data.trailerUrl.trim(),
    };

    try {
      let saved;
      if (isEdit) {
        saved = await updateMovie(id, payload);
        if (!saved) return;
        toast.success(`Película "${saved.title}" actualizada correctamente`);
      } else {
        saved = await createMovie(payload);
        if (!saved) return;
        toast.success(`Película "${saved.title}" creada correctamente`);
        reset(INITIAL_STATE);
      }
      navigate("/movies");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar la película.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar Película" : "Crear Película"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Título */}
        <input
          type="text"
          placeholder="Título"
          className="border p-2 rounded w-full"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}

        {/* Descripción */}
        <textarea
          placeholder="Descripción"
          className="border p-2 rounded w-full"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}

        {/* Año */}
        <input
          type="number"
          placeholder="Año"
          className="border p-2 rounded w-full"
          {...register("year")}
        />
        {errors.year && (
          <p className="text-red-500 text-sm">{errors.year.message}</p>
        )}

        {/* Géneros */}
        <input
          type="text"
          placeholder="Géneros (ej: Acción, Comedia)"
          className="border p-2 rounded w-full"
          {...register("genresInput")}
        />
        {errors.genresInput && (
          <p className="text-red-500 text-sm">{errors.genresInput.message}</p>
        )}

        {/* Clasificación */}
        <select
          className="border p-2 rounded w-full"
          {...register("ageRating")}
        >
          <option value="">Seleccionar clasificación</option>
          <option value="G">G</option>
          <option value="PG">PG</option>
          <option value="PG-13">PG-13</option>
          <option value="R">R</option>
          <option value="NC-17">NC-17</option>
        </select>
        {errors.ageRating && (
          <p className="text-red-500 text-sm">{errors.ageRating.message}</p>
        )}

        {/* Imagen */}
        <input
          type="text"
          placeholder="URL de Imagen o ruta local /img..."
          className="border p-2 rounded w-full"
          {...register("image")}
        />
        {errors.image && (
          <p className="text-red-500 text-sm">{errors.image.message}</p>
        )}

        {/* Previsualización */}
        <ImagePreview image={preview} />

        {/* Trailer 
        <input
          type="text"
          placeholder="URL del Trailer"
          className="border p-2 rounded w-full"
          {...register("trailerUrl")}
        />
        {errors.trailerUrl && (
          <p className="text-red-500 text-sm">{errors.trailerUrl.message}</p>
        )}*/}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          {isSubmitting
            ? isEdit
              ? "Actualizando..."
              : "Creando..."
            : isEdit
            ? "Actualizar Película"
            : "Crear Película"}
        </button>
      </form>
    </div>
  );
}
