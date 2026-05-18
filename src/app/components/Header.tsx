import {
  FormEvent,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Bell,
  Building2,
  CheckCheck,
  Clock3,
  KeyRound,
  Menu,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  UserCircle2,
  X,
  Smartphone,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { useIsMobile } from "./ui/use-mobile";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const menuItems = [
  { title: "صفحه اصلی", href: "#home" },
  { title: "خدمات", href: "#services" },
  { title: "فعالیت‌ها", href: "#activities" },
  { title: "اخبار", href: "#news" },
  { title: "سوالات متداول", href: "#faq" },
  { title: "پشتیبانی", href: "#support" },
];

const notifications = [
  {
    id: "n1",
    title: "وضعیت پرونده PR-22318 به‌روزرسانی شد",
    time: "5 دقیقه پیش",
  },
  {
    id: "n2",
    title: "قبض عوارض نوسازی شما آماده پرداخت است",
    time: "1 ساعت پیش",
  },
  {
    id: "n3",
    title: "پاسخ تیکت #TK-1082 ثبت شد",
    time: "امروز، 10:15",
  },
];

const AUTH_STORAGE_KEY = "municipality-user-authenticated";
const AUTH_TYPE_KEY = "municipality-user-type";

// --- Forgot Password Step Types ---
type ForgotStep = "phone" | "otp" | "newPassword" | "success";

export function Header({ isDark, toggleTheme }: HeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAllNotificationsOpen, setIsAllNotificationsOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(menuItems[0].href);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState<"user" | "admin">(() => {
    if (typeof window === "undefined") return "user";
    return (localStorage.getItem(AUTH_TYPE_KEY) as "user" | "admin") || "user";
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // --- Forgot Password State ---
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("phone");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotOtp, setForgotOtp] = useState(["", "", "", "", ""]);
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  });

  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);

  const unreadCount = notifications.filter(
    (item) => !readNotificationIds.includes(item.id),
  ).length;

  const markNotificationAsRead = (id: string) => {
    setReadNotificationIds((prev) =>
      prev.includes(id) ? prev : [...prev, id],
    );
  };

  const markAllNotificationsAsRead = () => {
    setReadNotificationIds(notifications.map((item) => item.id));
  };

  const handleProfileClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (isAuthenticated) {
      return;
    }

    event.preventDefault();

    setLoginError("");
    setLoginType("user");
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
    setIsAllNotificationsOpen(false);
    setIsLoginOpen(true);
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setLoginError("لطفا نام کاربری و رمز عبور را وارد کنید.");
      return;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    localStorage.setItem(AUTH_TYPE_KEY, loginType);

    setIsAuthenticated(true);
    setLoginError("");
    setUsername("");
    setPassword("");
    setIsLoginOpen(false);

    if (loginType === "admin") {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  };

  // --- Forgot Password Handlers ---
  const openForgotPassword = () => {
    setIsLoginOpen(false);
    resetForgotState();
    setIsForgotOpen(true);
  };

  const resetForgotState = () => {
    setForgotStep("phone");
    setForgotPhone("");
    setForgotOtp(["", "", "", "", ""]);
    setForgotNewPassword("");
    setForgotConfirmPassword("");
    setForgotError("");
    setForgotLoading(false);
    setOtpResendTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const closeForgot = () => {
    setIsForgotOpen(false);
    resetForgotState();
  };

  const startResendTimer = () => {
    setOtpResendTimer(120);
    timerRef.current = setInterval(() => {
      setOtpResendTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setForgotError("");

    const phoneRegex = /^(09)\d{9}$/;
    if (!phoneRegex.test(forgotPhone)) {
      setForgotError("شماره موبایل وارد شده معتبر نیست.");
      return;
    }

    setForgotLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setForgotLoading(false);
    setForgotStep("otp");
    startResendTimer();
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setForgotError("");

    const otpValue = forgotOtp.join("");
    if (otpValue.length < 5) {
      setForgotError("لطفا کد ۵ رقمی ارسال شده را وارد کنید.");
      return;
    }

    setForgotLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setForgotLoading(false);

    // Simulate wrong OTP check (for demo, "00000" is wrong)
    if (otpValue === "00000") {
      setForgotError("کد وارد شده اشتباه است. لطفا مجددا تلاش کنید.");
      return;
    }

    setForgotStep("newPassword");
  };

  const handleResendOtp = async () => {
    if (otpResendTimer > 0) return;
    setForgotOtp(["", "", "", "", ""]);
    setForgotError("");
    setForgotLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setForgotLoading(false);
    startResendTimer();
  };

  const handleSetNewPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setForgotError("");

    if (forgotNewPassword.length < 8) {
      setForgotError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    setForgotLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setForgotLoading(false);
    setForgotStep("success");
  };

  const handleOtpInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...forgotOtp];
    newOtp[index] = digit;
    setForgotOtp(newOtp);

    if (digit && index < 4) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !forgotOtp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 5);
    if (!pasted) return;
    const newOtp = ["", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setForgotOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 4)]?.focus();
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
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

    window.addEventListener("hashchange", syncActiveMenuItem);

    return () => {
      window.removeEventListener("hashchange", syncActiveMenuItem);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      isAllNotificationsOpen || isLoginOpen || isForgotOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isAllNotificationsOpen, isLoginOpen, isForgotOpen]);

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
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsAllNotificationsOpen(false);
        setIsLoginOpen(false);
        setIsForgotOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -90 }}
      animate={{ y: 0 }}
      className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"
    >
      <div className="container mx-auto px-0 md:px-2 lg:px-6">
        <div
          className={`nav-shell nav-shell-overflow-visible ${
            scrolled ? "nav-shell-scrolled" : ""
          }`}
        >
          <div className="flex h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-primary-foreground shadow-[0_12px_28px_rgba(13,86,90,0.35)] md:h-12 md:w-12">
                <Building2 className="h-5 w-5 md:h-6 md:w-6" />

                <span className="absolute -bottom-1 -left-1 flex h-4 w-4 items-center justify-center rounded-md border border-border/70 bg-background text-accent shadow-sm">
                  <ShieldCheck className="h-2.5 w-2.5" />
                </span>
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-base font-bold text-foreground md:text-lg">
                  شهرداری مراغه
                </h1>

                <div className="hidden items-center gap-2 sm:flex">
                  <p className="text-xs text-muted-foreground">
                    پرتال جامع خدمات اداری
                  </p>

                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-[var(--primary-soft)] px-2 py-0.5 text-[11px] font-semibold text-primary">
                    <Sparkles className="h-3 w-3" />
                    نسخه جدید
                  </span>
                </div>
              </div>
            </div>

            <nav className="hidden items-center gap-1 lg:flex">
              {menuItems.map((item) => {
                const isActive = item.href === activeMenuItem;

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={() => setActiveMenuItem(item.href)}
                    className={`relative overflow-hidden rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="desktop-menu-active"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-l from-primary to-secondary shadow-[0_10px_24px_rgba(11,105,104,0.35)]"
                      />
                    )}

                    <span className="relative z-10">{item.title}</span>
                  </a>
                );
              })}
            </nav>

            <div className="relative flex items-center gap-2 md:gap-3">
              {/* Bell and Admin panel — only visible after login, hidden on mobile */}
              {isAuthenticated && (
                <>
                  {/* ایکون نوتیفیکیشن — در موبایل مخفی است */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    ref={notificationButtonRef}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAllNotificationsOpen(false);
                      setIsNotificationsOpen((prev) => !prev);
                    }}
                    className="header-action-btn relative hidden sm:flex"
                    aria-label="اعلان‌ها"
                    aria-expanded={isNotificationsOpen}
                    aria-controls="notifications-panel"
                  >
                    <Bell className="h-5 w-5" />

                    {unreadCount > 0 && (
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </motion.button>

                  {/* ایکون پنل ادمین — در همه سایزها نمایش داده می‌شود */}
                  {loginType === "admin" && (
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/admin"
                        className="header-action-btn inline-flex items-center justify-center"
                      >
                        <ShieldCheck className="h-5 w-5" />
                      </Link>
                    </motion.div>
                  )}
                </>
              )}

              {/* ایکون پروفایل — در موبایل مخفی است */}
              <Link
                to="/profile"
                onClick={handleProfileClick}
                className="header-action-btn hidden sm:inline-flex items-center gap-2 px-3"
                aria-label="پروفایل کاربر"
              >
                <UserCircle2 className="h-5 w-5" />
              </Link>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="header-action-btn"
                aria-label="تغییر تم"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
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
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
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
                      className="fixed inset-x-2 top-[calc(env(safe-area-inset-top)+4.75rem)] z-50 w-auto overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-[0_18px_42px_rgba(4,20,17,0.18)] backdrop-blur-xl sm:absolute sm:inset-x-auto sm:left-0 sm:right-auto sm:top-full sm:mt-3 sm:w-[min(22rem,calc(100vw-1rem))]"
                    >
                      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                        <h3 className="text-sm font-bold text-foreground">
                          اعلان‌ها
                        </h3>
                      </div>

                      <div className="max-h-[56vh] overflow-y-auto p-2 sm:max-h-72">
                        {notifications.map((item) => {
                          const isUnread = !readNotificationIds.includes(
                            item.id,
                          );

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                markNotificationAsRead(item.id);
                                setIsNotificationsOpen(false);
                              }}
                              className={`w-full rounded-xl px-3 py-3 text-right transition-colors hover:bg-[var(--primary-soft)] ${
                                isUnread ? "bg-[var(--primary-soft)]/60" : ""
                              }`}
                            >
                              <div className="mb-1 flex items-start justify-between gap-2">
                                <p className="text-sm text-foreground">
                                  {item.title}
                                </p>

                                {isUnread && (
                                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                )}
                              </div>

                              <p className="text-xs text-muted-foreground">
                                {item.time}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      <div className="border-t border-border/70 p-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsNotificationsOpen(false);
                            setIsAllNotificationsOpen(true);
                          }}
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

      {/* مودال مشاهده همه اعلان‌ها */}
      <AnimatePresence>
        {isAllNotificationsOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAllNotificationsOpen(false)}
              className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-[2px]"
            />

            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label="همه اعلان‌ها"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-2 top-[calc(env(safe-area-inset-top)+4.75rem)] z-[80] mx-auto flex h-[min(80vh,44rem)] w-[min(64rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-[0_30px_80px_rgba(6,31,27,0.32)] backdrop-blur-xl md:inset-x-6 md:top-24"
            >
              <div className="relative border-b border-border/70 px-4 py-4 sm:px-6">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/60 to-transparent" />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-primary">
                      <Bell className="h-5 w-5" />
                    </span>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-foreground sm:text-lg">
                        همه اعلان‌ها
                      </h3>

                      <p className="text-xs text-muted-foreground sm:text-sm">
                        {unreadCount} اعلان خوانده‌نشده برای پیگیری دارید
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAllNotificationsOpen(false)}
                    className="header-action-btn h-9 w-9 min-w-9"
                    aria-label="بستن"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 sm:px-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold text-primary">
                  <Bell className="h-3.5 w-3.5" />
                  لیست کامل اعلان‌ها
                </span>

                <button
                  type="button"
                  onClick={markAllNotificationsAsRead}
                  disabled={unreadCount === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-[var(--primary-soft)] disabled:pointer-events-none disabled:opacity-45"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  علامت‌گذاری همه
                </button>
              </div>

              <div className="grid flex-1 gap-3 overflow-y-auto p-3 sm:p-4">
                {notifications.map((item) => {
                  const isUnread = !readNotificationIds.includes(item.id);

                  return (
                    <article
                      key={item.id}
                      className={`group rounded-2xl border border-border/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[var(--primary-soft)] ${
                        isUnread
                          ? "bg-[var(--primary-soft)]/65"
                          : "bg-background/70"
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <p className="text-sm leading-6 text-foreground">
                          {item.title}
                        </p>

                        <span
                          className={`mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${
                            isUnread
                              ? "bg-primary shadow-[0_0_0_4px_var(--primary-soft)]"
                              : "bg-muted-foreground/45"
                          }`}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock3 className="h-3.5 w-3.5" />
                          {item.time}
                        </span>

                        <button
                          type="button"
                          onClick={() => markNotificationAsRead(item.id)}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-background/80"
                        >
                          علامت گذاری به عنوان خوانده شده
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>

      {/* مودال ورود */}
      <AnimatePresence>
        {isLoginOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginOpen(false)}
              className="fixed inset-0 z-[85] bg-black/45 backdrop-blur-[2px]"
              aria-label="بستن فرم ورود"
            />

            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label="فرم ورود"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="fixed inset-x-3 top-[calc(env(safe-area-inset-top)+5.25rem)] z-[90] mx-auto w-full max-w-md rounded-3xl border border-border/70 bg-card/95 p-6 shadow-[0_30px_80px_rgba(6,31,27,0.32)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${loginType === "admin" ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary"}`}
                  >
                    {loginType === "admin" ? (
                      <KeyRound className="h-5 w-5" />
                    ) : (
                      <UserCircle2 className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {loginType === "admin"
                        ? "ورود به پنل مدیریت"
                        : "ورود به حساب کاربری"}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {loginType === "admin"
                        ? "بخش دسترسی محدود مدیران"
                        : "دسترسی به خدمات پرتال شهروند"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLoginOpen(false)}
                  className="rounded-full p-1 hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium pr-1 text-muted-foreground">
                    نام کاربری
                  </label>
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="مثال: 0012345678"
                    className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      رمز عبور
                    </label>
                    <button
                      type="button"
                      onClick={openForgotPassword}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      فراموشی رمز عبور؟
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {loginError ? (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                  >
                    {loginError}
                  </motion.p>
                ) : null}

                <button
                  type="submit"
                  className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] ${
                    loginType === "admin"
                      ? "bg-gradient-to-l from-amber-600 to-orange-500 shadow-lg shadow-orange-500/20"
                      : "btn-gradient"
                  }`}
                >
                  {loginType === "admin"
                    ? "ورود به سیستم مدیریت"
                    : "ورود به پروفایل کاربری"}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-border/50 text-center">
                {loginType === "user" ? (
                  <button
                    onClick={() => {
                      setLoginType("admin");
                      setLoginError("");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span>کاربر ادمین هستید؟</span>
                    <span className="font-bold border-b border-dashed border-primary pb-0.5">
                      ورود مدیران
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setLoginType("user");
                      setLoginError("");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span>بازگشت به</span>
                    <span className="font-bold border-b border-dashed border-primary pb-0.5">
                      ورود کاربران عادی
                    </span>
                  </button>
                )}
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>

      {/* ===================== مودال فراموشی رمز عبور ===================== */}
      <AnimatePresence>
        {isForgotOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForgot}
              className="fixed inset-0 z-[85] bg-black/45 backdrop-blur-[2px]"
              aria-label="بستن فرم فراموشی رمز عبور"
            />

            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label="فراموشی رمز عبور"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="fixed inset-x-3 top-[calc(env(safe-area-inset-top)+5.25rem)] z-[90] mx-auto w-full max-w-md rounded-3xl border border-border/70 bg-card/95 p-6 shadow-[0_30px_80px_rgba(6,31,27,0.32)] backdrop-blur-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Smartphone className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      بازیابی رمز عبور
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {forgotStep === "phone" &&
                        "شماره موبایل خود را وارد کنید"}
                      {forgotStep === "otp" && `کد ارسال شده به ${forgotPhone}`}
                      {forgotStep === "newPassword" &&
                        "رمز عبور جدید تعیین کنید"}
                      {forgotStep === "success" &&
                        "رمز عبور با موفقیت تغییر کرد"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeForgot}
                  className="rounded-full p-1 hover:bg-muted transition-colors"
                  aria-label="بستن"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Step indicator */}
              {forgotStep !== "success" && (
                <div className="mb-5 flex items-center gap-2">
                  {(["phone", "otp", "newPassword"] as ForgotStep[]).map(
                    (step, idx) => {
                      const steps: ForgotStep[] = [
                        "phone",
                        "otp",
                        "newPassword",
                      ];
                      const currentIdx = steps.indexOf(forgotStep);
                      const isDone = idx < currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div
                          key={step}
                          className="flex flex-1 items-center gap-2"
                        >
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                              isDone
                                ? "bg-primary text-primary-foreground"
                                : isCurrent
                                  ? "bg-primary/15 text-primary ring-2 ring-primary/30"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isDone ? (
                              <CheckCheck className="h-3 w-3" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          {idx < 2 && (
                            <div
                              className={`h-px flex-1 transition-all ${
                                isDone ? "bg-primary" : "bg-border/70"
                              }`}
                            />
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              )}

              {/* ===== Step 1: Enter phone ===== */}
              <AnimatePresence mode="wait">
                {forgotStep === "phone" && (
                  <motion.form
                    key="phone-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={handleSendOtp}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium pr-1 text-muted-foreground">
                        شماره موبایل
                      </label>
                      <input
                        type="tel"
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(e.target.value)}
                        placeholder="09xxxxxxxxx"
                        dir="ltr"
                        maxLength={11}
                        className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 text-center tracking-widest"
                      />
                      <p className="text-[11px] text-muted-foreground pr-1">
                        کد تایید به این شماره پیامک می‌شود
                      </p>
                    </div>

                    {forgotError && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                      >
                        {forgotError}
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="btn-gradient w-full rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {forgotLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          ارسال کد تایید
                          <Smartphone className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotOpen(false);
                        setIsLoginOpen(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors pt-1"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      بازگشت به صفحه ورود
                    </button>
                  </motion.form>
                )}

                {/* ===== Step 2: Enter OTP ===== */}
                {forgotStep === "otp" && (
                  <motion.form
                    key="otp-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={handleVerifyOtp}
                    className="space-y-4"
                  >
                    <div className="space-y-3">
                      <label className="text-[11px] font-medium pr-1 text-muted-foreground block">
                        کد ۵ رقمی دریافتی
                      </label>

                      {/* OTP Boxes */}
                      <div
                        className="flex items-center justify-center gap-2"
                        dir="ltr"
                      >
                        {forgotOtp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => {
                              otpRefs.current[idx] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleOtpInput(idx, e.target.value)
                            }
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            onPaste={idx === 0 ? handleOtpPaste : undefined}
                            className={`h-12 w-12 rounded-xl border text-center text-lg font-bold outline-none transition-all ${
                              digit
                                ? "border-primary bg-[var(--primary-soft)] text-primary"
                                : "border-border/70 bg-background text-foreground"
                            } focus:border-primary focus:ring-2 focus:ring-primary/10`}
                          />
                        ))}
                      </div>

                      {/* Resend */}
                      <div className="flex items-center justify-center gap-1 pt-1">
                        {otpResendTimer > 0 ? (
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" />
                            ارسال مجدد تا
                            <span
                              className="font-bold text-primary tabular-nums"
                              dir="ltr"
                            >
                              {formatTimer(otpResendTimer)}
                            </span>
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={forgotLoading}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:opacity-50 transition-colors"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            ارسال مجدد کد
                          </button>
                        )}
                      </div>
                    </div>

                    {forgotError && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                      >
                        {forgotError}
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading || forgotOtp.join("").length < 5}
                      className="btn-gradient w-full rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {forgotLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          در حال تایید...
                        </>
                      ) : (
                        "تایید کد"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep("phone");
                        setForgotError("");
                        setForgotOtp(["", "", "", "", ""]);
                        if (timerRef.current) clearInterval(timerRef.current);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors pt-1"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      تغییر شماره موبایل
                    </button>
                  </motion.form>
                )}

                {/* ===== Step 3: New Password ===== */}
                {forgotStep === "newPassword" && (
                  <motion.form
                    key="newpassword-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={handleSetNewPassword}
                    className="space-y-3"
                  >
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium pr-1 text-muted-foreground">
                        رمز عبور جدید
                      </label>
                      <input
                        type="password"
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="حداقل ۸ کاراکتر"
                        className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium pr-1 text-muted-foreground">
                        تکرار رمز عبور جدید
                      </label>
                      <input
                        type="password"
                        value={forgotConfirmPassword}
                        onChange={(e) =>
                          setForgotConfirmPassword(e.target.value)
                        }
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    {/* Password strength hint */}
                    {forgotNewPassword.length > 0 && (
                      <div className="flex items-center gap-1.5 px-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              forgotNewPassword.length >= (i + 1) * 3
                                ? forgotNewPassword.length >= 12
                                  ? "bg-green-500"
                                  : forgotNewPassword.length >= 9
                                    ? "bg-yellow-500"
                                    : "bg-orange-400"
                                : "bg-border/50"
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {forgotNewPassword.length >= 12
                            ? "قوی"
                            : forgotNewPassword.length >= 9
                              ? "متوسط"
                              : forgotNewPassword.length >= 6
                                ? "ضعیف"
                                : "خیلی ضعیف"}
                        </span>
                      </div>
                    )}

                    {forgotError && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                      >
                        {forgotError}
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="btn-gradient w-full rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {forgotLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          در حال ذخیره...
                        </>
                      ) : (
                        "ذخیره رمز عبور جدید"
                      )}
                    </button>
                  </motion.form>
                )}

                {/* ===== Step 4: Success ===== */}
                {forgotStep === "success" && (
                  <motion.div
                    key="success-step"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                    className="flex flex-col items-center gap-4 py-4 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 22,
                        delay: 0.1,
                      }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
                    >
                      <CheckCircle2 className="h-8 w-8" />
                    </motion.div>

                    <div>
                      <h4 className="text-base font-bold text-foreground mb-1">
                        رمز عبور تغییر کرد!
                      </h4>
                      <p className="text-sm text-muted-foreground leading-6">
                        رمز عبور شما با موفقیت بازیابی شد. اکنون می‌توانید با
                        رمز جدید وارد شوید.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        closeForgot();
                        setIsLoginOpen(true);
                      }}
                      className="btn-gradient w-full rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98]"
                    >
                      ورود به حساب کاربری
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          </>
        )}
      </AnimatePresence>

      {/* منوی موبایل */}
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
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setActiveMenuItem(item.href);
                        setIsMenuOpen(false);
                      }}
                      className={`relative overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? "text-primary-foreground"
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="mobile-menu-active"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                          className="absolute inset-0 rounded-xl bg-gradient-to-l from-primary to-secondary"
                        />
                      )}

                      <span className="relative z-10">{item.title}</span>
                    </motion.a>
                  );
                })}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  {/* Notifications button — only visible after login */}
                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAllNotificationsOpen(false);
                        setIsNotificationsOpen(true);
                      }}
                      className="flex items-center justify-between rounded-xl bg-[var(--primary-soft)] px-4 py-3 text-sm text-foreground transition-colors hover:bg-[var(--primary-soft-strong)]"
                    >
                      <span>اعلان‌ها</span>

                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                        {unreadCount}

                        {unreadCount > 0 && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </span>
                    </button>
                  )}

                  <Link
                    to="/profile"
                    onClick={(event) => {
                      setIsMenuOpen(false);
                      setIsNotificationsOpen(false);
                      handleProfileClick(event);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm text-foreground transition-colors hover:bg-[var(--primary-soft)]"
                  >
                    <UserCircle2 className="h-4 w-4" />
                    <span>پروفایل من</span>
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
