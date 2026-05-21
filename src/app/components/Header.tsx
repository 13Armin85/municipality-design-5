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
  Menu,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  UserCircle2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { useIsMobile } from "./ui/use-mobile";
import { isAdminToken } from "./header/auth";
import {
  API_BASE,
  AUTH_STORAGE_KEY,
  AUTH_TYPE_KEY,
  TOKEN_KEY,
  menuItems,
  notifications,
} from "./header/constants";
import { AllNotificationsModal } from "./header/AllNotificationsModal";
import { ForgotPasswordModal } from "./header/ForgotPasswordModal";
import { LoginModal } from "./header/LoginModal";
import { MobileMenu } from "./header/MobileMenu";
import { NotificationsDropdown } from "./header/NotificationsDropdown";
import { ForgotStep, HeaderProps } from "./header/types";

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
  const [loginLoading, setLoginLoading] = useState(false);

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

  const markNotificationAsRead = (id: string) =>
    setReadNotificationIds((prev) =>
      prev.includes(id) ? prev : [...prev, id],
    );

  const markAllNotificationsAsRead = () =>
    setReadNotificationIds(notifications.map((item) => item.id));

  const handleProfileClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (isAuthenticated) return;
    event.preventDefault();
    setLoginError("");
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
    setIsAllNotificationsOpen(false);
    setIsLoginOpen(true);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setLoginError("لطفا نام کاربری و رمز عبور را وارد کنید.");
      return;
    }

    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserName: username, Password: password }),
      });

      if (!res.ok) {
        let message = "نام کاربری یا رمز عبور اشتباه است.";
        try {
          const errData = await res.json();
          if (errData?.message) message = errData.message;
          else if (errData?.Message) message = errData.Message;
        } catch {
          /* ignore parse errors */
        }
        setLoginError(message);
        return;
      }

      const data = await res.json();
      const token: string = data.token ?? data.Token ?? "";

      if (!token) {
        setLoginError("خطا در دریافت توکن. لطفا مجددا تلاش کنید.");
        return;
      }

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(AUTH_STORAGE_KEY, "true");

      const admin = isAdminToken(token);
      const resolvedType: "admin" | "user" = admin ? "admin" : "user";
      localStorage.setItem(AUTH_TYPE_KEY, resolvedType);

      setIsAuthenticated(true);
      setLoginType(resolvedType);
      setUsername("");
      setPassword("");
      setIsLoginOpen(false);

      navigate(admin ? "/admin" : "/profile");
    } catch {
      setLoginError("خطا در اتصال به سرور. لطفا دوباره تلاش کنید.");
    } finally {
      setLoginLoading(false);
    }
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

  const openForgotPassword = () => {
    setIsLoginOpen(false);
    resetForgotState();
    setIsForgotOpen(true);
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
    if (!/^(09)\d{9}$/.test(forgotPhone)) {
      setForgotError("شماره موبایل وارد شده معتبر نیست.");
      return;
    }
    setForgotLoading(true);
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
    if (digit && index < 4) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !forgotOtp[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 5);
    if (!pasted) return;
    const newOtp = ["", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
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

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash;
      if (menuItems.some((item) => item.href === hash)) setActiveMenuItem(hash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      isAllNotificationsOpen || isLoginOpen || isForgotOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAllNotificationsOpen, isLoginOpen, isForgotOpen]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(t) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(t)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsAllNotificationsOpen(false);
        setIsLoginOpen(false);
        setIsForgotOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
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
          className={`nav-shell nav-shell-overflow-visible ${scrolled ? "nav-shell-scrolled" : ""}`}
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
                    className={`relative overflow-hidden rounded-xl px-4 py-2 text-sm font-medium transition-all ${isActive ? "text-primary-foreground" : "text-foreground hover:text-primary"}`}
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
              {isAuthenticated && (
                <>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    ref={notificationButtonRef}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAllNotificationsOpen(false);
                      setIsNotificationsOpen((p) => !p);
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

              <Link
                to="/profile"
                onClick={handleProfileClick}
                className="header-action-btn hidden items-center gap-2 px-3 sm:inline-flex"
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
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsMenuOpen((p) => !p);
                  setIsNotificationsOpen(false);
                }}
                className="header-action-btn lg:hidden"
                aria-label="منو"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.button>

              <NotificationsDropdown
                isOpen={isNotificationsOpen}
                isMobile={isMobile}
                notifications={notifications}
                readNotificationIds={readNotificationIds}
                notificationsRef={notificationsRef}
                onClose={() => setIsNotificationsOpen(false)}
                onOpenAll={() => {
                  setIsNotificationsOpen(false);
                  setIsAllNotificationsOpen(true);
                }}
                onMarkRead={markNotificationAsRead}
              />
            </div>
          </div>
        </div>
      </div>

      <AllNotificationsModal
        isOpen={isAllNotificationsOpen}
        unreadCount={unreadCount}
        notifications={notifications}
        readNotificationIds={readNotificationIds}
        onClose={() => setIsAllNotificationsOpen(false)}
        onMarkAllRead={markAllNotificationsAsRead}
        onMarkRead={markNotificationAsRead}
      />

      <LoginModal
        isOpen={isLoginOpen}
        username={username}
        password={password}
        loginError={loginError}
        loginLoading={loginLoading}
        onClose={() => setIsLoginOpen(false)}
        onOpenForgotPassword={openForgotPassword}
        onSubmit={handleLogin}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
      />

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        forgotStep={forgotStep}
        forgotPhone={forgotPhone}
        forgotOtp={forgotOtp}
        forgotNewPassword={forgotNewPassword}
        forgotConfirmPassword={forgotConfirmPassword}
        forgotError={forgotError}
        forgotLoading={forgotLoading}
        otpResendTimer={otpResendTimer}
        otpRefs={otpRefs}
        timerRef={timerRef}
        onClose={closeForgot}
        onSendOtp={handleSendOtp}
        onVerifyOtp={handleVerifyOtp}
        onResendOtp={handleResendOtp}
        onSetNewPassword={handleSetNewPassword}
        onOtpInput={handleOtpInput}
        onOtpKeyDown={handleOtpKeyDown}
        onOtpPaste={handleOtpPaste}
        formatTimer={formatTimer}
        setForgotPhone={setForgotPhone}
        setForgotNewPassword={setForgotNewPassword}
        setForgotConfirmPassword={setForgotConfirmPassword}
        setForgotStep={setForgotStep}
        setForgotError={setForgotError}
        setForgotOtp={setForgotOtp}
        openLogin={() => {
          closeForgot();
          setIsLoginOpen(true);
        }}
      />

      <MobileMenu
        isOpen={isMenuOpen}
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
        isAuthenticated={isAuthenticated}
        unreadCount={unreadCount}
        onMenuItemClick={(href) => {
          setActiveMenuItem(href);
          setIsMenuOpen(false);
        }}
        onOpenNotifications={() => {
          setIsMenuOpen(false);
          setIsAllNotificationsOpen(false);
          setIsNotificationsOpen(true);
        }}
        onProfileClick={handleProfileClick}
        closeMenu={() => setIsMenuOpen(false)}
        closeNotifications={() => setIsNotificationsOpen(false)}
      />
    </motion.header>
  );
}
