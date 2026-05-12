import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Calendar, Clock, Moon, Sun } from "lucide-react";
import { Link, useParams } from "react-router";
import { newsItems } from "../data/news";

interface NewsDetailPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function NewsDetailPage({ isDark, toggleTheme }: NewsDetailPageProps) {
  const { slug } = useParams();
  const news = newsItems.find((item) => item.slug === slug);

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
                <span className="text-sm">بازگشت </span>
              </Link>

              <div className="min-w-0 text-center">
                <h1 className="truncate text-sm font-bold text-foreground md:text-base">
                  جزئیات خبر
                </h1>
              </div>

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
      </motion.header>

      <section className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6">
        <div className="container mx-auto max-w-4xl px-0 md:px-2 lg:px-6">
          {news ? (
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="soft-card mesh-panel p-5 md:p-7"
            >
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary/25 bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold text-primary">
                  {news.category}
                </span>
              </div>

              <h2 className="text-xl font-black leading-9 text-foreground md:text-3xl md:leading-[1.9]">
                {news.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                {news.excerpt}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground md:text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{news.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{news.time}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm leading-8 text-foreground md:text-base">
                {news.content.map((paragraph, index) => (
                  <p key={`${news.id}-paragraph-${index}`}>{paragraph}</p>
                ))}
              </div>
            </motion.article>
          ) : (
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="soft-card mesh-panel p-5 text-center md:p-7"
            >
              <h2 className="text-xl font-black text-foreground md:text-2xl">
                خبر موردنظر پیدا نشد
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                ممکن است لینک تغییر کرده باشد یا خبر از فهرست اخیر حذف شده باشد.
              </p>
              <div className="mt-6">
                <Link
                  to="/#news"
                  className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  <ArrowRight className="h-4 w-4" />
                  بازگشت به اخبار
                </Link>
              </div>
            </motion.article>
          )}
        </div>
      </section>
    </>
  );
}
