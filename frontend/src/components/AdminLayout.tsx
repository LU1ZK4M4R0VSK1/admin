import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ChefHat,
  UtensilsCrossed,
  Users,
  TrendingUp,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export function AdminLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
    { path: "/admin/pedidos", icon: ChefHat, label: "Cozinha" },
    { path: "/admin/cardapio", icon: UtensilsCrossed, label: "Cardápio" },
    { path: "/admin/mesas", icon: Users, label: "Mesas" },
    { path: "/admin/analytics", icon: TrendingUp, label: "Análises" },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo Header */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4">
          {isSidebarOpen ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="font-bold text-slate-900">Aero Comidas</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-slate-400 hover:text-slate-600 mx-auto"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  active
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                    : "text-slate-600 hover:bg-slate-100"
                } ${!isSidebarOpen && "justify-center"}`}
                title={!isSidebarOpen ? item.label : ""}
              >
                <Icon className="w-5 h-5" />
                {isSidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <button
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full ${
              !isSidebarOpen && "justify-center"
            }`}
            title={!isSidebarOpen ? "Sair" : ""}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
