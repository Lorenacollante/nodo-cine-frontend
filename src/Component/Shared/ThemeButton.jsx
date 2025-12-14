// 🌓 ThemeButton.jsx

import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeButton() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-1 rounded-full bg-turquoise-500 text-white 
                 hover:bg-turquoise-600 transition-colors duration-300 
                 focus:outline-none"
      aria-label="Toggle theme"
    >
      <span className="text-xl">{isDarkMode ? "🌙" : "☀️"}</span>
    </button>
  );
}
