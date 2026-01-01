import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, BarChart3, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/purchases", label: "Purchases", icon: ShoppingCart },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/ai", label: "AI", icon: Brain },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background px-4 py-6">
      {/* Logo */}
      <div className="h-14 px-6 flex items-center border-b">
        <span className="text-lg font-semibold tracking-tight">HomeSpend</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t px-4 py-3 text-xs text-muted-foreground">
        © {new Date().getFullYear()} HomeSpend
      </div>
    </aside>
  );
}
