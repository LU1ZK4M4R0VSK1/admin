import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import KitchenDashboard from "./pages/KitchenDashboard";
import MenuManagement from "./pages/MenuManagement";
import TableManagement from "./pages/TableManagement";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import MenuPage from "./pages/MenuPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Página pública */}
          <Route path="/" element={<Index />} />
          
          {/* Rota dinâmica para cardápio por mesa (clientes) */}
          <Route path="/mesa/:tableId/cardapio" element={<MenuPage />} />
          
          {/* Redirecionamento para rotas administrativas */}
          <Route path="/analytics" element={<Navigate to="/admin/analytics" replace />} />
          
          {/* Painel Administrativo - SPA com Sidebar */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="pedidos" element={<KitchenDashboard />} />
            <Route path="cardapio" element={<MenuManagement />} />
            <Route path="mesas" element={<TableManagement />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
          </Route>
          
          {/* Catch-all para página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
