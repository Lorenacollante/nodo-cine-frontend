import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Verifica si el usuario ya está autenticado al cargar el componente
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true }); // Redirige al usuario si ya está autenticado
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.warning("Completá todos los campos.");
      return;
    }

    try {
      setLoading(true);
      const success = await login(credentials);

      if (success) {
        toast.success("¡Bienvenido!");
        setCredentials({ email: "", password: "" });
        navigate("/", { replace: true });
      } else {
        toast.error("Credenciales incorrectas.");
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
        <h2 className="mb-6 text-center text-2xl font-bold">Iniciar Sesión</h2>

        <div className="mb-4">
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            value={credentials.email}
            onChange={handleChange}
            className="w-full rounded border p-2 focus:outline-none focus:ring"
            placeholder="correo@ejemplo.com"
            disabled={loading}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={credentials.password}
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
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          aria-busy={loading}
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>

        {/* ✅ AGREGAR ESTO */}
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-bold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </form>
    </main>
  );
}
