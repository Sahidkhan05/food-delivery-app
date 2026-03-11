import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle = () => {

  const [darkMode, setDarkMode] = useState(false);

  // Load saved preference
  useEffect(() => {

    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);

  }, []);

  // Apply dark mode
  useEffect(() => {

    localStorage.setItem("darkMode", darkMode);

    if (darkMode) {

      document.documentElement.classList.add("dark");

    } else {

      document.documentElement.classList.remove("dark");

    }

  }, [darkMode]);

  return (

    <button
      onClick={() => setDarkMode(!darkMode)}
      className="flex items-center gap-2 px-3 py-2 rounded-full
      bg-gray-200 dark:bg-gray-700
      hover:scale-105 transition duration-300"
    >

      {darkMode ? (
        <>
          <Sun size={18} />
          <span className="text-sm">Light</span>
        </>
      ) : (
        <>
          <Moon size={18} />
          <span className="text-sm">Dark</span>
        </>
      )}

    </button>

  );

};

export default DarkModeToggle;