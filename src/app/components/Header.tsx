import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Building2,
  Menu,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  UserCircle2,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useIsMobile } from './ui/use-mobile';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const menuItems = [
  { title: 'صفحه اصلی', href: '#home' },
  { title: 'خدمات', href: '#services' },
  { title: 'فعالیت‌ها', href: '#activities' },
  { title: 'اخبار', href: '#news' },
  { title: 'سوالات متداول', href: '#faq' },
  { title: 'پشتیبانی', href: '#support' },
];

const notifications = [
  { id: 'n1', title: 'وضعیت پرونده PR-22318 به‌روزرسانی شد', time: '5 دقیقه پیش' },
  { id: 'n2', title: 'قبض عوارض نوسازی شما آماده پرداخت است', time: '1 ساعت پیش' },
  { id: 'n3', title: 'پاسخ تیکت #TK-1082 ثبت شد', time: 'امروز، 10:15' },
];

export function Header({ isDark, toggleTheme }: HeaderProps) {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(menuItems[0].href);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    const syncActiveMenuItem = () => {
      const currentHash = window.location.hash;
      if (menuItems.some((item) => item.href === currentHash)) {
        setActiveMenuItem(currentHash);
      }
    };

    syncActiveMenuItem();
    window.addEventListener('hashchange', syncActiveMenuItem);
    return () => window.removeEventListener('hashchange', syncActiveMenuItem);
  }, []);

  return (
    <motion.header
      initial={{ y: -90 }}
      animate={{ y: 0 }}
      className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"
    >
      <div className="container mx-auto px-0 md:px-2 lg:px-6">
        <div className={`nav-shell nav-shell-overflow-visible ${scrolled ? 'nav-shell-scrolled' : ''}`}>
          <div className="flex h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-primary-foreground shadow-[0_12px_28px_rgba(13,86,90,0.35)] md:h-12 md:w-12">
                <Building2 className="h-5 w-5 md:h-6 md:w-6" />
                <span className="absolute -bottom-1 -left-1 flex h-4 w-4 items-center justify-center rounded-md border border-border/70 bg-background text-accent shadow-sm">
                  <ShieldCheck className="h-2.5 w-2.5" />
                </span>
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-base font-bold text-foreground md:text-lg">شهرداری مراغه</h1>
                <div className="hidden items-center gap-2 sm:flex">
                  <p className="text-xs text-muted-foreground">پرتال جامع خدمات اداری</p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-[var(--primary-soft)] px-2 py-0.5 text-[11px] font-semibold text-primary">
                    <Sparkles className="h-3 w-3" />
                    نسخه جدید
                  </span>
                </div>
              </div>
            </div>

            <nav className="hidden items-center gap-1 rounded-2xl border border-white/30 bg-background/35 p-1.5 backdrop-blur-md lg:flex dark:border-border/80">
              {menuItems.map((item) => {
                const isActive = item.href === activeMenuItem;
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={() => setActiveMenuItem(item.href)}
                    className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      isActive ? 'text-white' : 'text-foreground hover:bg-[var(--primary-soft)]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="desktop-active-nav-item"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-l from-primary to-secondary shadow-[0_10px_24px_rgba(11,105,104,0.35)]"
                      />
                    )}
                    <span className="relative z-10">{item.title}</span>
                  </a>
                );
              })}
            </nav>

            <div className="relative flex items-center gap-2 md:gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                ref={notificationButtonRef}
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsNotificationsOpen((prev) => !prev);
                }}
                className="header-action-btn relative"
                aria-label="اعلان‌ها"
                aria-expanded={isNotificationsOpen}
                aria-controls="notifications-panel"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="header-action-btn hidden items-center gap-2 px-3 sm:flex"
                aria-label="پروفایل کاربر"
              >
                <UserCircle2 className="h-5 w-5" />
                <span className="text-sm">کاربر</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="header-action-btn"
                aria-label="تغییر تم"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsMenuOpen((prev) => !prev);
                  setIsNotificationsOpen(false);
                }}
                className="header-action-btn lg:hidden"
                aria-label="منو"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    {isMobile && (
                      <motion.button
                        type="button"
                        aria-label="بستن پنل اعلان‌ها"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsNotificationsOpen(false)}
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] sm:hidden"
                      />
                    )}

                    <motion.div
                      id="notifications-panel"
                      ref={notificationsRef}
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="fixed inset-x-2 top-[calc(env(safe-area-inset-top)+4.75rem)] z-50 w-auto overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-[0_18px_42px_rgba(4,20,17,0.18)] backdrop-blur-xl sm:absolute sm:inset-x-auto sm:top-full sm:left-0 sm:right-auto sm:mt-3 sm:w-[min(22rem,calc(100vw-1rem))]"
                    >
                      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                        <h3 className="text-sm font-bold text-foreground">اعلان‌ها</h3>
                        <button
                          type="button"
                          onClick={() => setIsNotificationsOpen(false)}
                          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          بستن
                        </button>
                      </div>

                      <div className="max-h-[56vh] overflow-y-auto p-2 sm:max-h-72">
                        {notifications.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setIsNotificationsOpen(false)}
                            className="w-full rounded-xl px-3 py-3 text-right transition-colors hover:bg-[var(--primary-soft)]"
                          >
                            <p className="mb-1 text-sm text-foreground">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.time}</p>
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-border/70 p-2">
                        <button
                          type="button"
                          onClick={() => setIsNotificationsOpen(false)}
                          className="w-full rounded-xl px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-[var(--primary-soft)]"
                        >
                          مشاهده همه اعلان‌ها
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="container mx-auto mt-2 px-0 md:px-2 lg:hidden"
          >
            <div className="nav-shell overflow-hidden">
              <nav className="flex flex-col gap-2 p-4">
                {menuItems.map((item, index) => {
                  const isActive = item.href === activeMenuItem;
                  return (
                    <motion.a
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.07 }}
                      href={item.href}
                      onClick={() => {
                        setActiveMenuItem(item.href);
                        setIsMenuOpen(false);
                        setIsNotificationsOpen(false);
                      }}
                      className={`relative rounded-xl px-4 py-3 text-sm transition-colors ${
                        isActive ? 'text-white' : 'text-foreground hover:bg-[var(--primary-soft)]'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="mobile-active-nav-item"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                          className="absolute inset-0 rounded-xl bg-gradient-to-l from-primary to-secondary"
                        />
                      )}
                      <span className="relative z-10">{item.title}</span>
                    </motion.a>
                  );
                })}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsNotificationsOpen(true);
                    }}
                    className="flex items-center justify-between rounded-xl bg-[var(--primary-soft)] px-4 py-3 text-sm text-foreground transition-colors hover:bg-[var(--primary-soft-strong)]"
                  >
                    <span>اعلان‌ها</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                      {notifications.length}
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    </span>
                  </button>
                  <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm text-foreground">
                    <UserCircle2 className="h-4 w-4" />
                    <span>پروفایل من</span>
                  </div>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
