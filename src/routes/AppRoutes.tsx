import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import Dashboard from "../pages/DashboardPage";
import { PurchasesPage } from "../pages/PurchasesPage";
import Reports from "../pages/Reports";
import AI from "../pages/AI";
import CategoriesPage from "@/features/categories/CategoriesPage";
import ItemsPage from "@/features/items/ItemsPage";
import ReportsPage from "@/pages/ReportsPage";
import ShopsPage from "@/pages/ShopsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/shops" element={<ShopsPage />} />

        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/ai" element={<AI />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
