import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import Dashboard from "../pages/DashboardPage";
import { PurchasesPage } from "../pages/PurchasesPage";
import Reports from "../pages/Reports";
import AI from "../pages/AI";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai" element={<AI />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
