import { AnimatePresence, motion } from "motion/react";
import { type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Clock3,
  Headphones,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircleMore,
  Moon,
  Phone,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { Link } from "react-router";
import { FaqSection } from "../components/FaqSection";
import { SupportSection } from "../components/SupportSection";

interface SupportPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

function PageHeader({
  title,
  isDark,
  toggleTheme,
}: SupportPageProps & { title: string }) {
  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"
    >
      <div className="container mx-auto px-0 md:px-2 lg:px-6">
        <div className="nav-shell">
          <div className="flex h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4">
            <Link to="/" className="header-action-btn inline-flex items-center gap-2 px-3">
              <ArrowRight className="h-4 w-4" />
              <span className="text-sm">بازگشت</span>
            </Link>

            <h1 className="truncate text-sm font-bold text-foreground md:text-base">
              {title}
            </h1>

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
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function PageShell({
  title,
  isDark,
  toggleTheme,
  children,
}: SupportPageProps & { title: string; children: ReactNode }) {
  return (
    <>
      <PageHeader title={title} isDark={isDark} toggleTheme={toggleTheme} />
      <main className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6">
        {children}
      </main>
    </>
  );
}

const guideItems = [
  {
    title: "شروع استفاده از خدمات",
    description:
      "ابتدا وارد حساب کاربری شوید، ملک یا پرونده خود را انتخاب کنید و سپس خدمت مورد نظر را از بخش خدمات شهری باز کنید.",
    icon: BookOpenText,
  },
  {
    title: "پیگیری درخواست‌ها",
    description:
      "درخواست‌های ثبت شده از داخل پنل کاربری و بخش فعالیت‌ها قابل مشاهده و پیگیری هستند.",
    icon: ShieldCheck,
  },
  {
    title: "دریافت کمک تخصصی",
    description:
      "اگر در هر مرحله ابهام یا خطا داشتید، از صفحه پشتیبانی تیکت ثبت کنید تا کارشناسان بررسی کنند.",
    icon: Headphones,
  },
];

export function GuidePage({ isDark, toggleTheme }: SupportPageProps) {
  return (
    <PageShell title="راهنما" isDark={isDark} toggleTheme={toggleTheme}>
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center md:mb-10">
          <span className="section-chip mb-3">راهنمای خدمات</span>
          <h2 className="mb-3 text-2xl font-black text-foreground md:text-3xl">
            راهنمای استفاده از پرتال شهرداری
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            مسیرهای اصلی استفاده از سامانه، پیگیری پرونده و دریافت پشتیبانی در
            این بخش خلاصه شده است.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {guideItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="soft-card mesh-panel p-5 md:p-6"
              >
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mb-3 text-base font-bold text-foreground md:text-lg">
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/faq"
            className="btn-gradient inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
          >
            سوالات متداول
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link
            to="/support"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-muted px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-[var(--primary-soft)]"
          >
            ثبت تیکت پشتیبانی
            <MessageCircleMore className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

export function FaqPage({ isDark, toggleTheme }: SupportPageProps) {
  return (
    <PageShell title="سوالات متداول" isDark={isDark} toggleTheme={toggleTheme}>
      <FaqSection />
    </PageShell>
  );
}

export function SupportPage({ isDark, toggleTheme }: SupportPageProps) {
  return (
    <PageShell title="پشتیبانی" isDark={isDark} toggleTheme={toggleTheme}>
      <SupportSection />
    </PageShell>
  );
}

export function ContactPage({ isDark, toggleTheme }: SupportPageProps) {
  return (
    <PageShell title="تماس با ما" isDark={isDark} toggleTheme={toggleTheme}>
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8 text-center md:mb-10">
          <span className="section-chip mb-3">ارتباط با شهرداری</span>
          <h2 className="mb-3 text-2xl font-black text-foreground md:text-3xl">
            تماس با ما
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            برای پیگیری سریع‌تر، ابتدا از سامانه ۱۳۷ یا بخش پشتیبانی آنلاین
            استفاده کنید.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <article className="soft-card mesh-panel p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                <Phone className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-foreground md:text-lg">
                شماره تماس
              </h3>
            </div>
            <p className="text-sm leading-7 text-muted-foreground" dir="ltr">
              137 - 09140077804
            </p>
          </article>

          <article className="soft-card mesh-panel p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                <Mail className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-foreground md:text-lg">
                ایمیل
              </h3>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              info@maragheh.ir
            </p>
          </article>

          <article className="soft-card mesh-panel p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                <MapPin className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-foreground md:text-lg">
                نشانی
              </h3>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              مراغه، بلوار شهید بهشتی
            </p>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              کدپستی: 918377804
            </p>
          </article>

          <article className="soft-card mesh-panel p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                <Clock3 className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-foreground md:text-lg">
                ساعت پاسخ‌گویی
              </h3>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              شنبه تا چهارشنبه، ساعت ۸ تا ۱۶
            </p>
          </article>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            to="/support"
            className="btn-gradient inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
          >
            پشتیبانی آنلاین
            <HelpCircle className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
