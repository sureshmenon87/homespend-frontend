import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";
export default function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      {/* routes */}
      <AppRoutes />
    </>
  );
}
