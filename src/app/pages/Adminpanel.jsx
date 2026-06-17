import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  ChevronLeft,
  LogOut,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Dashboard } from "./adminpanel/AdminDashboard";
import { AdminNewsPage } from "./adminpanel/AdminNewsPage";
import { AdminNewsGroupsPage } from "./adminpanel/AdminNewsGroupsPage";
import { SettingsPage } from "./adminpanel/AdminSettingsPage";
import { UserManagement } from "./adminpanel/UserManagement";
import { navItems } from "./adminpanel/adminData";
import {
  AUTH_STORAGE_KEY,
  AUTH_TYPE_KEY,
} from "../utils/authStorage";

// ==================== MAIN ADMIN PANEL ====================
export default function AdminPanel({ isDark, toggleTheme }) {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem(AUTH_STORAGE_KEY) === "true";
    const userType = localStorage.getItem(AUTH_TYPE_KEY);

    if (!isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }

    if (userType !== "admin") {
      navigate("/my-property", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  const pageComponents = {
    dashboard: <Dashboard />,
    news: <AdminNewsPage />,
    "news-groups": <AdminNewsGroupsPage />,
    users: <UserManagement />,
    settings: <SettingsPage />,
  };

  const cssVars = isDark
    ? {
        "--background": "#0b1312",
        "--foreground": "#e8f4f3",
        "--card": "#111e1d",
        "--border": "rgba(13,150,140,0.15)",
        "--muted": "#1a2827",
        "--muted-foreground": "#6b9090",
        "--primary": "#0d9f9a",
        "--primary-foreground": "#ffffff",
        "--secondary": "#0b8080",
        "--destructive": "#ef4444",
      }
    : {
        "--background": "#f8fafc",
        "--foreground": "#0f1c1b",
        "--card": "#ffffff",
        "--border": "rgba(13,86,90,0.12)",
        "--muted": "#f1f5f4",
        "--muted-foreground": "#6b8080",
        "--primary": "#0d565a",
        "--primary-foreground": "#ffffff",
        "--secondary": "#0b6968",
        "--destructive": "#dc2626",
      };

  return (
    <div
      dir="rtl"
      className="flex min-h-screen font-sans"
      style={{
        ...cssVars,
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; }
      `}</style>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarOpen ? 250 : 80 }}
        className={`fixed md:sticky top-0 right-0 z-50 h-screen flex flex-col border-l bg-card transition-all ${mobileSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="flex h-16 items-center gap-3 border-b px-4 shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg">
            <Building2 className="h-5 w-5" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="font-bold text-sm">پنل مدیریت</p>
              <p className="text-[10px] text-muted-foreground">شهرداری مراغه</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setMobileSidebarOpen(false);
              }}
              className={`relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${activePage === item.id ? "text-white" : "text-muted-foreground hover:bg-muted"}`}
            >
              {activePage === item.id && (
                <motion.span
                  layoutId="active-bg"
                  className="absolute inset-0 rounded-xl bg-gradient-to-l from-primary to-secondary shadow-lg shadow-primary/20"
                />
              )}
              <item.icon className="relative z-10 h-5 w-5 shrink-0" />
              {sidebarOpen && (
                <span className="relative z-10">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* LOGOUT BUTTON - FIXED AT BOTTOM */}
        <div
          className="p-3 border-t mt-auto shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>خروج از پنل</span>}
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-6 bg-card"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted"
            >
              <ChevronLeft
                className={`h-4 w-4 transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
              />
            </button>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-border"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-sm font-bold">
              {navItems.find((n) => n.id === activePage)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shadow-md cursor-pointer">
              م
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {pageComponents[activePage]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
