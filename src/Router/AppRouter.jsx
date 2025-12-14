// src/router/AppRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Páginas
import Home from "../page/Home";
import MovieList from "../page/MovieList";
import MovieDetail from "../page/MovieDetail";
import MovieCreate from "../page/MovieCreate";
import MovieEdit from "../page/MovieEdit";
import NotFound from "../page/NotFound";
import Register from "../page/Register";
import Login from "../page/Login";
import Unauthorized from "../page/Unauthorized";
import Profile from "../page/Profile";

// Seguridad
import ProtectedRoute from "./ProtectedRoute";

// Layout
import Navbar from "../Component/Shared/Navbar";
import Footer from "../Component/Shared/Footer";

export default function AppRouter({ openWatchlist }) {
  return (
    <>
      {/* Navbar fijo con Watchlist y tema */}
      <Navbar onWatchlistClick={openWatchlist} />

      {/* Contenido principal */}
      <main className="pt-16 min-h-screen">
        <Routes>
          {/* Inicio */}
          <Route path="/" element={<Home />} />

          {/* Autenticación */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Público */}
          <Route path="/movies" element={<MovieList />} />
          <Route path="/movies/:id" element={<MovieDetail />} />

          {/* Protegido: solo owner/admin */}
          <Route
            path="/movies/create"
            element={
              <ProtectedRoute requiredRole="owner">
                <MovieCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies/:id/edit"
            element={
              <ProtectedRoute requiredRole="owner">
                <MovieEdit />
              </ProtectedRoute>
            }
          />

          {/* Perfil protegido */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer global */}
      <Footer />
    </>
  );
}
