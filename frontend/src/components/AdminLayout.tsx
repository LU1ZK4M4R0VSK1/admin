import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ChefHat,
  UtensilsCrossed,
  Users,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Home,
  Bell,
  Settings,
  Search
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AdminLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="flex h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border"
      >
        {/* Logo Header */}
        <div className="h-16 border-b border-sidebar-border flex items-center justify-between px-4">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-primary-foreground font-bold text-lg">A</span>
                </div>
                <div>
                  <span className="font-display font-bold text-sidebar-foreground">Aero Comidas</span>
                  <p className="text-xs text-sidebar-foreground/60">Painel Admin</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="logo-mini"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow mx-auto"
              >
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </motion.div>
            )}
          </AnimatePresence>
          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors p-2 hover:bg-sidebar-accent rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Toggle Button when collapsed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 mx-auto mt-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${active ? 'active' : ''} ${!isSidebarOpen ? 'justify-center px-3' : ''}`}
                title={!isSidebarOpen ? item.label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-1.5">
          <Link
            to="/"
            className={`nav-item ${!isSidebarOpen ? 'justify-center px-3' : ''}`}
            title={!isSidebarOpen ? "Voltar ao Início" : ""}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium">Voltar ao Início</span>}
          </Link>
          <button
            className={`nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 ${!isSidebarOpen ? 'justify-center px-3' : ''}`}
            title={!isSidebarOpen ? "Sair" : ""}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium">Sair</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border z-50 lg:hidden flex flex-col"
            >
              {/* Mobile Logo */}
              <div className="h-16 border-b border-sidebar-border flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                    <span className="text-primary-foreground font-bold text-lg">A</span>
                  </div>
                  <div>
                    <span className="font-display font-bold text-sidebar-foreground">Aero Comidas</span>
                    <p className="text-xs text-sidebar-foreground/60">Painel Admin</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sidebar-foreground/60 hover:text-sidebar-foreground p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path, item.exact);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`nav-item ${active ? 'active' : ''}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Footer */}
              <div className="p-4 border-t border-sidebar-border space-y-1.5">
                <Link to="/" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Voltar ao Início</span>
                </Link>
                <button className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sair</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search Bar */}
            <div className="hidden sm:flex items-center gap-2 bg-muted/50 border border-border rounded-xl px-4 py-2 w-64 lg:w-80">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            </button>
            <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-semibold text-sm ml-2">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
