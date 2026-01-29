import { createContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "dusk";

export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({
  theme: "light",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("hs-theme") as Theme;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("dark", "theme-dusk");

    if (theme === "dark") root.classList.add("dark");
    if (theme === "dusk") root.classList.add("theme-dusk");

    localStorage.setItem("hs-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
