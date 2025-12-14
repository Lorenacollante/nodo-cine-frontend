// src/context/ThemeContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    // Aplica la clase 'dark' al <html> para que TailwindCSS lo detecte
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme () {
  return useContext(ThemeContext);
}


//hook integr

//El error en el editor es solo una advertencia de Fast Refresh, que prefiere que los hooks y providers estén en archivos separados, pero la funcionalidad es 100% correcta."
//que cualquier componente que necesite saber el estado del tema o cambiarlo (como App.jsx o el Header)