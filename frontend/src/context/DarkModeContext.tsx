import React, { createContext, useContext, useEffect, useState } from "react";

type DarkModeTypes = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};
const DarkModeContext = createContext<DarkModeTypes | undefined>(undefined);

export const DarkModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    // Check localStorage for existing preference
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);

    // Add/remove dark class on html element
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkModeContext = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("context is outside the provider...");
  }
  return context;
};
