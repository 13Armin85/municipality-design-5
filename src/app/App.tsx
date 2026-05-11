import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { NewsSection } from './components/NewsSection';
import { StatsSection } from './components/StatsSection';
import { QuickAccessSection } from './components/QuickAccessSection';
import { RecentActivitiesSection } from './components/RecentActivitiesSection';
import { SupportSection } from './components/SupportSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { AboutPage } from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { GuildFeesPage } from './pages/GuildFeesPage';
import { PropertyInquiryPage } from "./pages/PropertyInquiryPage";

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
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return null;
}

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

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
            <main>
              <GuildFeesPage isDark={isDark} toggleTheme={toggleTheme} />
            </main>
          }
        />
        <Route
          path="/property-inquiry"
          element={
            <main>
              <PropertyInquiryPage isDark={isDark} toggleTheme={toggleTheme} />
            </main>
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
      <Footer />
      <ScrollToTop />
    </div>
  );
}
