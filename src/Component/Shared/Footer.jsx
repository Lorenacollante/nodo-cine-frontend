// src/Component/Shared/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 py-10">
      <div className="container mx-auto px-4 md:px-0">
        {/* GRID PRINCIPAL DEL FOOTER (3 Columnas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-gray-700 pb-8">
          {/* COLUMNA 1: CONTACTO Y MARCA */}
          <div>
            <div className="text-2xl text-center md:text-left font-black text-red-600 mb-4">
              Mi Lucero Films
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                🎬
                <a
                  href="mailto:info@cineflix.com"
                  className="hover:text-red-500 transition ml-1 break-all"
                >
                  info@miLucerifilms.com
                </a>
              </li>
              <li>🏢 Oficina: Calle del Cine 123</li>
              <li>☎ Teléfono: +54 3834-123456</li>
              <li>📱 Soporte: +54 3834-654321</li>
              <li>👩Creadora:Lorena Collante</li>
            </ul>
          </div>

          {/* COLUMNA 2: REDES Y AYUDA */}
          <div>
            <h4 className="text-xl font-bold text-white mb-4 text-center md:text-left">
              Redes Sociales
            </h4>
            <div className="flex flex-wrap justify-center md:justify-start space-x-3 text-2xl mb-6">
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-red-500 transition"
              >
                📽️
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-red-500 transition"
              >
                🎥
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-red-500 transition"
              >
                🍿
              </a>
            </div>

            <h4 className="text-xl font-bold text-white mb-4 text-center md:text-left">
              Ayuda
            </h4>
            <ul className="space-y-2 text-sm text-center md:text-left">
              <li>
                <a href="#" className="hover:text-red-500 transition">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition">
                  Política de Suscripción
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: NEWSLETTER */}
          <div>
            <h4 className="text-xl font-bold text-white mb-4 text-center md:text-left">
              Newsletter
            </h4>
            <p className="mb-3 text-sm text-center md:text-left">
              Recibí novedades y estrenos.
            </p>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="email"
                placeholder="Tu email"
                className="w-full md:flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="w-full md:w-auto bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition">
                Suscribirse
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-8 text-center md:text-left">
              Streaming de Películas y Series
            </p>
            <p className="text-xs text-gray-500 text-center md:text-left">
              CineFlix - Tu Cine Online
            </p>
          </div>
        </div>

        {/* BARRA INFERIOR DE COPYRIGHT */}
        <div className="text-center pt-6 text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} CineFlix. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
