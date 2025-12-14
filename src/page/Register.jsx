import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.warning("Completá todos los campos.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      const success = await register({
        email: formData.email,
        password: formData.password,
      });

      if (success) {
        toast.success("¡Cuenta creada exitosamente!");
        setFormData({ email: "", password: "", confirmPassword: "" });
        navigate("/login", { replace: true });
      } else {
        toast.error("Error al crear la cuenta. Intenta con otro email.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error del servidor. Intentá más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-xl"
      >
        <h2 className="mb-6 text-center text-2xl font-bold">Registrarse</h2>

        <div className="mb-4">
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded border p-2 focus:outline-none focus:ring"
            placeholder="correo@ejemplo.com"
            disabled={loading}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded border p-2 focus:outline-none focus:ring"
            placeholder="•••••••"
            disabled={loading}
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium"
          >
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded border p-2 focus:outline-none focus:ring"
            placeholder="•••••••"
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded p-2 text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          aria-busy={loading}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </main>
  );
}
