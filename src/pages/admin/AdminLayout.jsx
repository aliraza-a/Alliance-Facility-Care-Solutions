import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  FileText, 
  MessageSquare, 
  LogOut, 
  ChevronRight,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: CalendarCheck, label: "Bookings", href: "/admin/bookings" },
  { icon: FileText, label: "Quotes", href: "/admin/quotes" },
  { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
  { icon: Sparkles, label: "Services", href: "/admin/services" },
];

export default function AdminLayout() {
  const { isAuthenticated, logout, isLoadingAuth } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('admin-theme') || 'admin-light';
  });
  
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020807]">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'admin-light' ? 'admin-dark' : 'admin-light');
  };

  return (
    <div className={`min-h-screen flex overflow-hidden ${theme} bg-[var(--admin-bg)] text-[var(--admin-text)] transition-colors duration-300`}>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--admin-sidebar)] border-b border-[var(--admin-border)] flex items-center justify-between px-4 z-[60]">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg">AFCS</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-[var(--admin-text-muted)]">
            {theme === 'admin-light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-[80] transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 transition-all duration-300
          ${isSidebarOpen ? "w-64" : "w-20"} 
          border-r border-[var(--admin-border)] bg-[var(--admin-sidebar)] flex flex-col
        `}
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${!isSidebarOpen && "lg:hidden"}`}>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && <span className="font-bold tracking-tight text-lg">AFCS Admin</span>}
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:block p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-[var(--admin-text-muted)]"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                    : "text-[var(--admin-text-muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--admin-text)]"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-emerald-500"}`} />
                {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                {isActive && isSidebarOpen && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--admin-border)] space-y-2">
          {/* Theme Toggle (Desktop Sidebar) */}
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-[var(--admin-text-muted)] hover:bg-black/5 dark:hover:bg-white/5`}
          >
            {theme === 'admin-light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            {isSidebarOpen && <span className="font-medium text-sm">{theme === 'admin-light' ? "Dark Mode" : "Light Mode"}</span>}
          </button>

          <Button 
            variant="ghost" 
            onClick={logout}
            className="w-full flex items-center justify-start gap-3 p-3 rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pt-16 lg:pt-0">
        <div className="relative z-10 p-4 md:p-8 lg:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
