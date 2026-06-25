

// src/app/components/Header.tsx
import {
  ClipboardEvent as ReactClipboardEvent,
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  Suspense,
  lazy,
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
import { useAuthModal } from "./AuthContext";
import { dotNet10ApiFetch } from "../data/api";
import { serviceItems } from "../data/services";
import {
  AUTH_STORAGE_KEY,
  AUTH_TOKEN_KEY,
  AUTH_TYPE_KEY,
  USER_NATIONAL_CODE_KEY,
} from "../utils/authStorage";

import { type ForgotStep } from "../pages/header/Forgotpasswordmodal";

const NotificationsPanel = lazy(() =>
  import("../pages/header/NotificationsPanel").then((module) => ({
    default: module.NotificationsPanel,
  })),
);
const AllNotificationsModal = lazy(() =>
  import("../pages/header/AllNotificationsModal").then((module) => ({
    default: module.AllNotificationsModal,
  })),
);
const LoginModal = lazy(() =>
  import("../pages/header/LoginModal").then((module) => ({
    default: module.LoginModal,
  })),
);
const ForgotPasswordModal = lazy(() =>
  import("../pages/header/Forgotpasswordmodal").then((module) => ({
    default: module.ForgotPasswordModal,
  })),
);
/*
 * تأیید پیامکی ساهکار برای ورود موقتاً غیرفعال شده است.
 * const SahkarVerificationModal = lazy(() =>
 *   import("../pages/header/SahkarVerificationModal").then((module) => ({
 *     default: module.SahkarVerificationModal,
 *   })),
 * );
 */
const SahkarVerificationModal = lazy(() =>
  import("../pages/header/SahkarVerificationModal").then((module) => ({
    default: module.SahkarVerificationModal,
  })),
);
const MobileMenu = lazy(() =>
  import("../pages/header/MobileMenu").then((module) => ({
    default: module.MobileMenu,
  })),
);

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface HeaderMenuItem {
  title: string;
  href: string;
  children?: Array<{
    title: string;
    href: string;
  }>;
}

const menuItems = [
  { title: "صفحه اصلی", href: "#home" },
  {
    title: "خدمات",
    href: "#services",
    children: serviceItems.map((item) => ({
      title: item.title,
      href: item.href,
    })),
  },
  { title: "فعالیت‌ها", href: "#activities" },
  { title: "اخبار", href: "#news" },
  { title: "سوالات متداول", href: "#faq" },
  { title: "پشتیبانی", href: "#support" },
] satisfies HeaderMenuItem[];

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
  { id: "n3", title: "پاسخ تیکت #TK-1082 ثبت شد", time: "امروز، 10:15" },
];

const decodeToken = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const ADMIN_ROLE_NAMES = ["admin", "administrator", "ادمین", "مدیر"];

const isAdminRoleValue = (value: unknown): boolean => {
  if (Array.isArray(value)) return value.some(isAdminRoleValue);
  if (value === null || value === undefined) return false;

  return String(value)
    .split(/[,\s]+/)
    .map((role) => role.trim().toLowerCase())
    .filter(Boolean)
    .some((normalized) =>
      ADMIN_ROLE_NAMES.some((role) => normalized === role),
    );
};

const getClaim = (source: any, keys: string[]) => {
  if (!source || typeof source !== "object") return undefined;
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) return source[key];
  }
  return undefined;
};

const getIsAdminFromAuthPayload = (data: any, token: string) => {
  const payload = decodeToken(token);
  const roleKeys = [
    "role",
    "Role",
    "roles",
    "Roles",
    "roleName",
    "RoleName",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  ];
  const value = data?.value ?? data?.Value;
  const candidates = [
    getClaim(payload, roleKeys),
    getClaim(data, roleKeys),
    getClaim(value, roleKeys),
    getClaim(value?.user ?? value?.User, roleKeys),
    getClaim(data?.user ?? data?.User, roleKeys),
  ];

  return candidates.some(isAdminRoleValue);
};

export function Header({ isDark, toggleTheme }: HeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
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

  /*
   * stateهای مرحله ارسال و تأیید کد پیامکی ورود:
   * const [isSahkarOpen, setIsSahkarOpen] = useState(false);
   * const [sahkarNationalCode, setSahkarNationalCode] = useState("");
   * const [sahkarMobile, setSahkarMobile] = useState("");
   * const [sahkarLoginType, setSahkarLoginType] = useState<"user" | "admin">("user");
   */
  const [isSahkarOpen, setIsSahkarOpen] = useState(false);
  const [sahkarNationalCode, setSahkarNationalCode] = useState("");
  const [sahkarMobile, setSahkarMobile] = useState("");
  const [sahkarLoginType, setSahkarLoginType] = useState<"user" | "admin">(
    "user",
  );

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);

  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    isAuthenticated,
    setIsAuthenticated,
  } = useAuthModal();

  const unreadCount = notifications.filter(
    (item) => !readNotificationIds.includes(item.id),
  ).length;

  // ─── Auth Context sync ────────────────────────────────────────────────────

  useEffect(() => {
    if (isLoginModalOpen) {
      setLoginError("");
      setLoginType("user");
      setIsMenuOpen(false);
      setIsNotificationsOpen(false);
      setIsAllNotificationsOpen(false);
      setIsLoginOpen(true);
      setIsLoginModalOpen(false);
    }
  }, [isLoginModalOpen, setIsLoginModalOpen]);

  // ─── Notification handlers ───────────────────────────────────────────────

  const markNotificationAsRead = (id: string) =>
    setReadNotificationIds((prev) =>
      prev.includes(id) ? prev : [...prev, id],
    );

  const markAllNotificationsAsRead = () =>
    setReadNotificationIds(notifications.map((item) => item.id));

  // ─── Login handlers ──────────────────────────────────────────────────────

  const handleProfileClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (isAuthenticated) return;
    event.preventDefault();
    setLoginError("");
    setLoginType("user");
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
      const response = await dotNet10ApiFetch("/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ UserName: username, Password: password }),
      });

      if (!response.ok) {
        setLoginError("نام کاربری یا رمز عبور اشتباه است.");
        return;
      }

      const data = await response.json();

      // بررسی IsSuccess flag از API
      const isSuccess = data.isSuccess ?? data.IsSuccess;
      const isFailure = data.isFailure ?? data.IsFailure;
      if (isFailure || !isSuccess) {
        setLoginError(
          data.error?.name ||
            data.Error?.Description ||
            "نام کاربری یا رمز عبور اشتباه است.",
        );
        return;
      }

      const isActive =
        data.value?.isActive ??
        data.value?.user?.isActive ??
        data.Value?.isActive ??
        data.Value?.user?.isActive ??
        data.user?.isActive ??
        data.isActive;

      if (isActive === false) {
        setLoginError("حساب کاربری شما غیرفعال است.");
        return;
      }

      const token =
        data.value?.token ??
        data.Value?.token ??
        data.token ??
        data.Token ??
        data.access_token ??
        data.AccessToken;

      if (!token) {
        setLoginError("خطا در دریافت توکن. لطفا دوباره تلاش کنید.");
        return;
      }

      const adminStatus = getIsAdminFromAuthPayload(data, token);

      // دریافت کد ملی از response
      const nationalCode =
        data.value?.nationalCode ??
        data.Value?.user?.nationalCode ??
        data.Value?.user?.NationalCode ??
        data.user?.nationalCode ??
        data.user?.NationalCode ??
        data.nationalCode ??
        data.NationalCode;

      // دریافت شماره تلفن از response
      const mobile =
        data.value?.phoneNumber ??
        data.Value?.user?.phoneNumber ??
        data.Value?.user?.PhoneNumber ??
        data.Value?.user?.mobile ??
        data.Value?.user?.Mobile ??
        data.user?.phoneNumber ??
        data.user?.PhoneNumber ??
        data.user?.mobile ??
        data.user?.Mobile ??
        data.phoneNumber ??
        data.PhoneNumber ??
        data.mobile ??
        data.Mobile;

      // بررسی اینکه هر دوی کد ملی و شماره تلفن موجود هستند
      if (!nationalCode || !mobile) {
        setLoginError(
          "خطا: اطلاعات کاربر ناقص است. لطفا با پشتیبانی تماس بگیرید.",
        );
        return;
      }

      if (nationalCode) {
        localStorage.setItem(USER_NATIONAL_CODE_KEY, String(nationalCode));
      }

      localStorage.setItem(AUTH_TOKEN_KEY, token);

      const authenticatedUserType = adminStatus ? "admin" : "user";
      setSahkarNationalCode(String(nationalCode));
      setSahkarMobile(String(mobile));
      setSahkarLoginType(authenticatedUserType);
      setIsLoginOpen(false);
      setUsername("");
      setPassword("");
      setIsSahkarOpen(true);

      /*
       * روند قبلی ارسال کد SMS برای ورود (ساهکار) موقتاً غیرفعال است:
       * setSahkarNationalCode(String(nationalCode));
       * setSahkarMobile(String(mobile));
       * setSahkarLoginType(adminStatus ? "admin" : "user");
       * setIsLoginOpen(false);
       * setUsername("");
       * setPassword("");
       * setIsSahkarOpen(true);
       */
    } catch {
      setLoginError("خطا در اتصال به سرور. لطفا دوباره تلاش کنید.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ─── Forgot password handlers ────────────────────────────────────────────

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
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !forgotOtp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event: ReactClipboardEvent<HTMLInputElement>) => {
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

  const handleSahkarSuccess = () => {
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    localStorage.setItem(AUTH_TYPE_KEY, sahkarLoginType);
    setIsAuthenticated(true);
    setLoginType(sahkarLoginType);
    setIsSahkarOpen(false);
    navigate(sahkarLoginType === "admin" ? "/admin" : "/my-property");
  };

  // ─── Sahkar verification handlers ────────────────────────────────────────

  /*
   * callback قبلی موفقیت تأیید پیامکی ورود:
   * const handleSahkarSuccess = () => {
   *   localStorage.setItem(AUTH_STORAGE_KEY, "true");
   *   localStorage.setItem(AUTH_TYPE_KEY, sahkarLoginType);
   *   setIsAuthenticated(true);
   *   setLoginType(sahkarLoginType);
   *   setIsSahkarOpen(false);
   *   navigate(sahkarLoginType === "admin" ? "/admin" : "/my-property");
   * };
   */

  // ─── Effects ─────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1280px)");
    const syncHeaderMode = () => setIsHeaderCompact(mediaQuery.matches);

    syncHeaderMode();
    mediaQuery.addEventListener("change", syncHeaderMode);
    return () => mediaQuery.removeEventListener("change", syncHeaderMode);
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
    return () => window.removeEventListener("hashchange", syncActiveMenuItem);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const mediaQuery = window.matchMedia("(min-width: 1281px)");
    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };

    if (mediaQuery.matches) {
      setIsMenuOpen(false);
      return;
    }

    mediaQuery.addEventListener("change", closeMenuOnDesktop);
    return () => mediaQuery.removeEventListener("change", closeMenuOnDesktop);
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow =
      isMenuOpen ||
      isAllNotificationsOpen ||
      isLoginOpen ||
      isForgotOpen
        ? "hidden"
        : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isAllNotificationsOpen, isLoginOpen, isForgotOpen]);

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

  // ─── Render ───────────────────────────────────────────────────────────────

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
            {/* Logo */}
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

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 min-[1281px]:flex">
              {menuItems.map((item) => {
                const isActive = item.href === activeMenuItem;
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={() => setActiveMenuItem(item.href)}
                    className={`relative overflow-hidden rounded-xl px-3 py-2 text-sm font-medium transition-all min-[1360px]:px-4 ${
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

            {/* Actions */}
            <div className="relative flex items-center gap-2 md:gap-3">
              {isAuthenticated && (
                <>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    ref={notificationButtonRef}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAllNotificationsOpen(false);
                      setIsNotificationsOpen((prev) => !prev);
                    }}
                    className="header-action-btn relative hidden min-[1281px]:flex"
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
                        className="header-action-btn hidden items-center justify-center sm:inline-flex"
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
                className="header-action-btn min-[1281px]:hidden"
                aria-label="منو"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.button>

              <Suspense fallback={null}>
                <NotificationsPanel
                  isOpen={isNotificationsOpen}
                  notifications={notifications}
                  readNotificationIds={readNotificationIds}
                  notificationsRef={notificationsRef}
                  isMobile={isMobile || isHeaderCompact}
                  onClose={() => setIsNotificationsOpen(false)}
                  onMarkAsRead={markNotificationAsRead}
                  onOpenAll={() => setIsAllNotificationsOpen(true)}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <AllNotificationsModal
          isOpen={isAllNotificationsOpen}
          notifications={notifications}
          readNotificationIds={readNotificationIds}
          unreadCount={unreadCount}
          onClose={() => setIsAllNotificationsOpen(false)}
          onMarkAsRead={markNotificationAsRead}
          onMarkAllAsRead={markAllNotificationsAsRead}
        />

        <LoginModal
          isOpen={isLoginOpen}
          loginType={loginType}
          username={username}
          password={password}
          loginError={loginError}
          loginLoading={loginLoading}
          onClose={() => setIsLoginOpen(false)}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
          onForgotPassword={openForgotPassword}
        />

        <ForgotPasswordModal
          isOpen={isForgotOpen}
          step={forgotStep}
          phone={forgotPhone}
          otp={forgotOtp}
          newPassword={forgotNewPassword}
          confirmPassword={forgotConfirmPassword}
          error={forgotError}
          loading={forgotLoading}
          otpResendTimer={otpResendTimer}
          otpRefs={otpRefs}
          onClose={closeForgot}
          onPhoneChange={setForgotPhone}
          onOtpInput={handleOtpInput}
          onOtpKeyDown={handleOtpKeyDown}
          onOtpPaste={handleOtpPaste}
          onNewPasswordChange={setForgotNewPassword}
          onConfirmPasswordChange={setForgotConfirmPassword}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
          onResendOtp={handleResendOtp}
          onSetNewPassword={handleSetNewPassword}
          onBackToLogin={() => {
            closeForgot();
            setIsLoginOpen(true);
          }}
          onGoToOtpStep={() => {
            setForgotStep("phone");
            setForgotError("");
            setForgotOtp(["", "", "", "", ""]);
            if (timerRef.current) clearInterval(timerRef.current);
          }}
        />

        {/*
          مرحله ارسال و تأیید کد SMS ورود موقتاً غیرفعال است:
          <SahkarVerificationModal
            isOpen={isSahkarOpen}
            nationalCode={sahkarNationalCode}
            mobile={sahkarMobile}
            onClose={() => {
              setIsSahkarOpen(false);
              localStorage.removeItem("auth-token");
            }}
            onSuccess={handleSahkarSuccess}
            onError={setLoginError}
          />
        */}

        <SahkarVerificationModal
          isOpen={isSahkarOpen}
          nationalCode={sahkarNationalCode}
          mobile={sahkarMobile}
          onClose={() => {
            setIsSahkarOpen(false);
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem(AUTH_TYPE_KEY);
          }}
          onSuccess={handleSahkarSuccess}
          onError={setLoginError}
        />
      </Suspense>

      <Suspense fallback={null}>
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
          onNotificationsClick={() => {
            setIsMenuOpen(false);
            setIsAllNotificationsOpen(false);
            setIsNotificationsOpen(true);
          }}
          onProfileClick={(event) => {
            setIsMenuOpen(false);
            setIsNotificationsOpen(false);
            handleProfileClick(event);
          }}
        />
      </Suspense>
    </motion.header>
  );
}

export default Header;
