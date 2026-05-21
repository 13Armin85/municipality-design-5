import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { ServicesSection } from "./components/ServicesSection";
import { NewsSection } from "./components/NewsSection";
import { StatsSection } from "./components/StatsSection";
import { QuickAccessSection } from "./components/QuickAccessSection";
import { RecentActivitiesSection } from "./components/RecentActivitiesSection";
import { SupportSection } from "./components/SupportSection";
import { FaqSection } from "./components/FaqSection";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { AboutPage } from "./pages/AboutPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { GuildFeesPage } from "./pages/GuildFeesPage";
import { PropertyInquiryPage } from "./pages/PropertyInquiryPage";
import { MyPropertyPage } from "./pages/Mypropertypage";
import { SabtDarkhastPage } from "./pages/Sabtdarkhastpage";
import { PropertyRequestDetails } from "./pages/PropertyRequestDetails";
import { ModernTollPage } from "./pages/ModernTollPage";
import AdminPanel from "./pages/Adminpanel";
import { AUTH_STORAGE_KEY } from "./components/header/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";

function ServiceAccessGuard() {
  const navigate = useNavigate();

  return (
    <>
      <Header isDark={false} toggleTheme={() => undefined} />
      <Dialog
        open
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            navigate("/");
          }
        }}
      >
        <DialogContent>
          <DialogHeader className="text-right">
            <DialogTitle>ورود لازم است</DialogTitle>
            <DialogDescription>
              برای استفاده از خدمات لطفاً ابتدا لاگین کنید.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

function HomePageContent() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <RecentActivitiesSection />
      <StatsSection />
      <NewsSection />
      <FaqSection />
      <SupportSection />
      <QuickAccessSection />
    </>
  );
}

function RouteScrollManager() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return null;
}

function ConditionalFooter() {
  const location = useLocation();
  if (location.pathname === "/admin") return null;
  return <Footer />;
}

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const isAuthenticated = localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  const protectedServiceElement = isAuthenticated ? null : (
    <ServiceAccessGuard />
  );

  return (
    <div
      className="min-h-screen bg-background relative selection:bg-primary/25 selection:text-foreground"
      dir="rtl"
    >
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-36 -right-24 w-[28rem] h-[28rem] rounded-full bg-[var(--primary-soft-strong)] blur-[110px]" />
        <div className="absolute top-[28%] -left-24 w-[30rem] h-[30rem] rounded-full bg-[var(--accent-soft)] blur-[120px]" />
        <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-[34rem] h-[18rem] rounded-full bg-[var(--primary-soft)] blur-[110px]" />
      </div>
      <RouteScrollManager />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header isDark={isDark} toggleTheme={toggleTheme} />
              <main>
                <HomePageContent />
              </main>
            </>
          }
        />
        <Route
          path="/about"
          element={
            <main>
              <AboutPage isDark={isDark} toggleTheme={toggleTheme} />
            </main>
          }
        />
        <Route
          path="/profile"
          element={
            <main>
              <ProfilePage isDark={isDark} toggleTheme={toggleTheme} />
            </main>
          }
        />
        <Route
          path="/news/:slug"
          element={
            <main>
              <NewsDetailPage isDark={isDark} toggleTheme={toggleTheme} />
            </main>
          }
        />
        <Route
          path="/guild-fees"
          element={
            protectedServiceElement ?? (
              <main>
                <GuildFeesPage isDark={isDark} toggleTheme={toggleTheme} />
              </main>
            )
          }
        />
        <Route
          path="/property-inquiry"
          element={
            protectedServiceElement ?? (
              <main>
                <PropertyInquiryPage
                  isDark={isDark}
                  toggleTheme={toggleTheme}
                />
              </main>
            )
          }
        />
        <Route
          path="/my-property"
          element={
            protectedServiceElement ?? (
              <main>
                <MyPropertyPage isDark={isDark} toggleTheme={toggleTheme} />
              </main>
            )
          }
        />
        <Route
          path="/admin"
          element={<AdminPanel isDark={isDark} toggleTheme={toggleTheme} />}
        />
        <Route
          path="/sabt-darkhast"
          element={
            protectedServiceElement ?? (
              <main>
                <SabtDarkhastPage isDark={isDark} toggleTheme={toggleTheme} />
              </main>
            )
          }
        />
        <Route
          path="/property-request"
          element={
            protectedServiceElement ?? (
              <main className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6">
                <div className="container mx-auto max-w-5xl">
                  <PropertyRequestDetails
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                  />
                </div>
              </main>
            )
          }
        />
        <Route
          path="/modern-toll"
          element={
            protectedServiceElement ?? (
              <main className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6">
                <div className="container mx-auto max-w-5xl">
                  <ModernTollPage isDark={isDark} toggleTheme={toggleTheme} />
                </div>
              </main>
            )
          }
        />
        <Route
          path="*"
          element={
            <>
              <Header isDark={isDark} toggleTheme={toggleTheme} />
              <main>
                <HomePageContent />
              </main>
            </>
          }
        />
      </Routes>
      <ConditionalFooter />
      <ScrollToTop />
    </div>
  );
}
