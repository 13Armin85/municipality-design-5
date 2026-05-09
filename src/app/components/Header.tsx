import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Building2, Bell, UserCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function Header({ isDark, toggleTheme }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { title: 'صفحه اصلی', href: '#home' },
    { title: 'خدمات', href: '#services' },
    { title: 'فعالیت‌ها', href: '#activities' },
    { title: 'اخبار', href: '#news' },
    { title: 'پشتیبانی', href: '#support' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-effect border-b border-[var(--glass-border)] shadow-[0_14px_32px_rgba(5,31,25,0.18)]' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-primary-foreground shadow-[0_12px_28px_rgba(13,86,90,0.35)]">
              <Building2 className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-md bg-background text-accent flex items-center justify-center shadow-sm border border-border/70">
                <ShieldCheck className="w-2.5 h-2.5" />
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base md:text-lg font-bold text-foreground">شهرداری مراغه</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">پرتال جامع خدمات اداری</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {menuItems.map((item, idx) => (
              <a
                key={item.title}
                href={item.href}
                className={`px-4 py-2 rounded-xl text-sm transition-all border border-transparent ${
                  idx === 0
                    ? 'bg-[var(--primary-soft)] text-primary border-primary/20'
                    : 'text-foreground hover:bg-[var(--primary-soft)] hover:border-primary/15'
                }`}
              >
                {item.title}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-card/85 border border-border/80 hover:bg-[var(--primary-soft)] transition-colors"
              aria-label="اعلان‌ها"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 h-10 px-3 rounded-xl bg-card/85 border border-border/80 hover:bg-[var(--primary-soft)] transition-colors text-foreground"
              aria-label="پروفایل کاربر"
            >
              <UserCircle2 className="w-5 h-5" />
              <span className="text-sm">کاربر</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-card/85 border border-border/80 hover:bg-[var(--primary-soft)] transition-colors"
              aria-label="تغییر تم"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-card/85 border border-border/80 hover:bg-[var(--primary-soft)] transition-colors"
              aria-label="منو"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card/92 backdrop-blur-xl border-t border-border/80 overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-foreground hover:bg-[var(--primary-soft)] transition-colors"
                >
                  {item.title}
                </motion.a>
              ))}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="px-4 py-3 rounded-xl bg-muted text-sm text-foreground flex items-center justify-between">
                  <span>اعلان جدید</span>
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="px-4 py-3 rounded-xl bg-muted text-sm text-foreground flex items-center gap-2">
                  <UserCircle2 className="w-4 h-4" />
                  <span>پروفایل من</span>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
