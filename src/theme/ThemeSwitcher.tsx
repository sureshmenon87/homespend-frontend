import { useContext } from "react";
import { ThemeContext } from "@/theme/theme";

export function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="flex gap-2">
      {["light", "dark", "dusk"].map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t as any)}
          className={`px-2 py-1 rounded border border-app
            ${theme === t ? "bg-accent text-white" : "bg-card"}
          `}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
