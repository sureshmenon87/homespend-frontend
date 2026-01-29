import { ThemeProvider } from "@/theme/theme";
import { ThemeSwitcher } from "@/theme/ThemeSwitcher";

export function Topbar() {
  return (
    <header className="h-14 border-b border-app bg-background flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-sm font-medium text-muted-foreground">
          Personal Expense Dashboard
        </h1>

        {/* Placeholder for user/profile */}
        <div className="text-sm text-muted-foreground">Welcome</div>
        <ThemeSwitcher></ThemeSwitcher>
      </div>
    </header>
  );
}
