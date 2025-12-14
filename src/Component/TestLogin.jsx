/*import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Ajusta la ruta si es necesario

export default function TestLogin() {
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    const doLogin = async () => {
      const success = await login({
        email: "admin@lucero.com",
        password: "laContraseñaReal", // reemplaza con la correcta
      });
      console.log("Login exitoso:", success);
      console.log("Usuario:", user);
      console.log("isAuthenticated:", isAuthenticated);
      console.log("Token en localStorage:", localStorage.getItem("authToken"));
    };

    doLogin();
  }, []);

  return <div>Probando login… revisa la consola</div>;
}*/
