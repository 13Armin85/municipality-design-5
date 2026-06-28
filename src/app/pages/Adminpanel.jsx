import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  ChevronDown,
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
import {
  AdminShahkarPage,
  AdminSmsPage,
} from "./adminpanel/AdminIntegrationSettingsPage";
import {
  AdminShahkarLogsPage,
  AdminSmsLogsPage,
} from "./adminpanel/AdminIntegrationLogsPage";
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
  const [openNavTrees, setOpenNavTrees] = useState({
    "news-root": false,
    "settings-root": false,
  });

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
    shahkar: <AdminShahkarPage />,
    sms: <AdminSmsPage />,
    "shahkar-logs": <AdminShahkarLogsPage />,
    "sms-logs": <AdminSmsLogsPage />,
    users: <UserManagement />,
    settings: <SettingsPage />,
  };

  const findNavLabel = (items, pageId) => {
    for (const item of items) {
      if (item.id === pageId) return item.label;
      const childLabel = item.children
        ? findNavLabel(item.children, pageId)
        : null;
      if (childLabel) return childLabel;
    }

    return "";
  };

  const handleNavClick = (item) => {
    if (item.children?.length) {
      toggleNavTree(item.id);
      return;
    }

    setActivePage(item.id);
    setMobileSidebarOpen(false);
  };

  const toggleNavTree = (itemId) => {
    setOpenNavTrees((current) => ({
      ...current,
      [itemId]: !current[itemId],
    }));
  };

  const handleChildNavClick = (childId) => {
    setActivePage(childId);
    setMobileSidebarOpen(false);
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
          {navItems.map((item) => {
            const isTreeOpen = openNavTrees[item.id];
            const isParentOfActive = item.children?.some(
              (child) => child.id === activePage,
            );
            const isActive = activePage === item.id;

            return (
              <div key={item.id} className="space-y-1">
                <div
                  className={`relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "text-white"
                      : isParentOfActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-bg"
                      className="absolute inset-0 rounded-xl bg-gradient-to-l from-primary to-secondary shadow-lg shadow-primary/20"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className="relative z-10 flex min-w-0 flex-1 items-center gap-3 text-right"
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {sidebarOpen && (
                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>
                    )}
                  </button>
                  {sidebarOpen && item.children?.length ? (
                    <button
                      type="button"
                      onClick={() => toggleNavTree(item.id)}
                      className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-black/10"
                      aria-label={
                        isTreeOpen
                          ? `بستن زیرمنوی ${item.label}`
                          : `باز کردن زیرمنوی ${item.label}`
                      }
                      title={isTreeOpen ? "بستن زیرمنو" : "باز کردن زیرمنو"}
                    >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isTreeOpen ? "rotate-180" : ""
                          }`}
                        />
                    </button>
                  ) : null}
                </div>

                {sidebarOpen && item.children?.length ? (
                  <AnimatePresence initial={false}>
                    {isTreeOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mr-5 border-r border-border/70 pr-2">
                          {item.children.map((child) => {
                            const childActive = activePage === child.id;

                            return (
                              <button
                                key={child.id}
                                onClick={() => handleChildNavClick(child.id)}
                                className={`relative mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                                  childActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted"
                                }`}
                              >
                                <child.icon className="h-4 w-4 shrink-0" />
                                <span>{child.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : null}
              </div>
            );
          })}
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
              {findNavLabel(navItems, activePage)}
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
              {pageComponents[activePage] ?? pageComponents.dashboard}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
