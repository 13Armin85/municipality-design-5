import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  Clock3,
  FileCheck2,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Phone,
  ShieldCheck,
  Sun,
  Trash2,
  UserCircle2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useNavigate } from "react-router";

interface ProfilePageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const PROFILE_IMAGE_STORAGE_KEY = "municipality-user-profile-image";
const AUTH_STORAGE_KEY = "municipality-user-authenticated";

const personalInfo = [
  { label: "نام و نام خانوادگی", value: "امیررضا محمدی" },
  { label: "کد ملی", value: "۱۲۳۴۵۶۷۸۹۰" },
  { label: "تاریخ تولد", value: "۱۳۷۶/۰۴/۱۸" },
  { label: "شماره پرونده شهروندی", value: "MRG-148229" },
  { label: "وضعیت حساب", value: "فعال و تایید شده" },
  { label: "تاریخ عضویت", value: "۱۴۰۱/۰۲/۰۹" },
];

const contactInfo = [
  { icon: Phone, label: "شماره همراه", value: "۰۹۱۲۱۲۳۴۵۶۷" },
  { icon: Mail, label: "ایمیل", value: "amirreza.mohammadi@example.com" },
  {
    icon: MapPin,
    label: "نشانی",
    value: "مراغه، خیابان شهید بهشتی، کوچه فرهنگ، پلاک ۲۱",
  },
];

const accountCards = [
  { title: "درخواست‌های فعال", value: "۴", icon: FileCheck2 },
  { title: "ابلاغیه‌های جدید", value: "۲", icon: BadgeCheck },
  { title: "واحد خدمت‌دهنده", value: "شهرداری مراغه", icon: Building2 },
];

const timelineItems = [
  {
    id: "t1",
    title: "استعلام نوسازی ملک",
    subtitle: "در حال بررسی توسط واحد درآمد",
    time: "به‌روزرسانی: امروز، ۱۱:۲۰",
  },
  {
    id: "t2",
    title: "درخواست تمدید پروانه کسب",
    subtitle: "مدارک کامل دریافت شد",
    time: "به‌روزرسانی: دیروز، ۰۹:۴۸",
  },
  {
    id: "t3",
    title: "پرداخت عوارض سالیانه",
    subtitle: "پرداخت موفق و رسید صادر شد",
    time: "به‌روزرسانی: ۱۴۰۵/۰۲/۰۸",
  },
];

export function ProfilePage({ isDark, toggleTheme }: ProfilePageProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    const savedImage = localStorage.getItem(PROFILE_IMAGE_STORAGE_KEY);
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    setPhotoMessage(null);

    if (!file.type.startsWith("image/")) {
      setPhotoError("فقط فایل تصویری قابل انتخاب است.");
      event.target.value = "";
      return;
    }

    const maxAllowedSize = 4 * 1024 * 1024;
    if (file.size > maxAllowedSize) {
      setPhotoError("حداکثر حجم عکس باید کمتر از ۴ مگابایت باشد.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
        localStorage.setItem(PROFILE_IMAGE_STORAGE_KEY, reader.result);
        setPhotoMessage("عکس پروفایل با موفقیت ذخیره شد.");
      }
    };
    reader.onerror = () => {
      setPhotoError("بارگذاری عکس انجام نشد. دوباره تلاش کنید.");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleRemovePhoto = () => {
    setProfileImage(null);
    setPhotoMessage("عکس پروفایل حذف شد.");
    setPhotoError(null);
    localStorage.removeItem(PROFILE_IMAGE_STORAGE_KEY);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsLogoutConfirmOpen(false);
    navigate("/");
  };

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"
      >
        <div className="container mx-auto px-0 md:px-2 lg:px-6">
          <div className="nav-shell">
            <div className="flex h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4">
              <Link
                to="/"
                className="header-action-btn inline-flex items-center gap-2 px-3"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm">بازگشت</span>
              </Link>

              <div className="min-w-0 text-center">
                <h1 className="truncate text-sm font-bold text-foreground md:text-base">
                  پروفایل من
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="header-action-btn"
                  aria-label="تغییر تم"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={isDark ? "sun" : "moon"}
                      initial={{ opacity: 0, rotate: -18, scale: 0.9 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 18, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className="inline-flex"
                    >
                      {isDark ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Logout confirm modal */}
      <AnimatePresence>
        {isLogoutConfirmOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="fixed inset-0 z-[85] bg-black/45 backdrop-blur-[2px]"
              aria-label="بستن"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-x-4 top-1/2 z-[90] mx-auto w-full max-w-sm -translate-y-1/2 rounded-3xl border border-border/70 bg-card/95 p-6 shadow-[0_30px_80px_rgba(6,31,27,0.32)] backdrop-blur-xl"
            >
              <div className="mb-5 flex flex-col items-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                  <LogOut className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    خروج از حساب کاربری
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-6">
                    آیا مطمئن هستید؟ پس از خروج باید مجدداً وارد شوید.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogoutConfirmOpen(false)}
                  className="rounded-xl border border-border/70 bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-destructive/90"
                >
                  بله، خارج شو
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6">
        <div className="container mx-auto max-w-7xl px-0 md:px-2 lg:px-6">
          <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
            <motion.aside
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="soft-card mesh-panel p-5 md:p-6"
            >
              <div className="mb-5 text-center">
                <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-[1.5rem] border border-border/80 bg-muted shadow-[0_16px_34px_rgba(4,20,17,0.16)]">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="عکس پروفایل کاربر"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <UserCircle2 className="h-16 w-16" />
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/40 bg-background/85 text-primary shadow-sm">
                    <Camera className="h-4 w-4" />
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground">
                  امیررضا محمدی
                </h3>
                <p className="text-sm text-muted-foreground">
                  شهروند تایید شده
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="btn-gradient rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  بارگذاری عکس
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={!profileImage}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/70 bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-[var(--primary-soft)] disabled:pointer-events-none disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف عکس
                </button>
              </div>

              <AnimatePresence mode="wait">
                {photoError && (
                  <motion.p
                    key={photoError}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                  >
                    {photoError}
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {photoMessage && (
                  <motion.p
                    key={photoMessage}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-3 rounded-xl border border-primary/30 bg-[var(--primary-soft)] px-3 py-2 text-xs text-primary"
                  >
                    {photoMessage}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-5 space-y-2">
                {accountCards.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/70 p-3"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        {item.title}
                      </p>
                      <p className="truncate text-sm font-semibold text-foreground">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Logout button inside sidebar */}
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(true)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/15"
              >
                <LogOut className="h-4 w-4" />
                خروج از حساب کاربری
              </button>
            </motion.aside>

            <div className="grid grid-cols-1 gap-5">
              <motion.article
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                className="soft-card mesh-panel p-5 md:p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <h3 className="text-base font-bold text-foreground md:text-lg">
                    اطلاعات هویتی و حساب
                  </h3>
                </div>

                <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {personalInfo.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-border/70 bg-card/80 px-3 py-2.5"
                    >
                      <dt className="text-xs text-muted-foreground">
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-foreground">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: 0.04 }}
                className="soft-card mesh-panel p-5 md:p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                    <Phone className="h-4 w-4" />
                  </span>
                  <h3 className="text-base font-bold text-foreground md:text-lg">
                    اطلاعات تماس
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {contactInfo.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-2.5"
                    >
                      <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: 0.08 }}
                className="soft-card mesh-panel p-5 md:p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                    <Clock3 className="h-4 w-4" />
                  </span>
                  <h3 className="text-base font-bold text-foreground md:text-lg">
                    آخرین وضعیت درخواست‌ها
                  </h3>
                </div>

                <div className="grid gap-3">
                  {timelineItems.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-border/70 bg-background/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[var(--primary-soft)]"
                    >
                      <h4 className="text-sm font-bold text-foreground">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.subtitle}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {item.time}
                      </p>
                    </article>
                  ))}
                </div>
              </motion.article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
