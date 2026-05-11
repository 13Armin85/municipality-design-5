import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, BookOpenText, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router';
import { aboutInfoSections, aboutIntro } from '../data/aboutMunicipality';

interface AboutPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function AboutPage({ isDark, toggleTheme }: AboutPageProps) {
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
              <Link to="/" className="header-action-btn inline-flex items-center gap-2 px-3">
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm">بازگشت به صفحه اصلی</span>
              </Link>

              <div className="min-w-0 text-center">
                <p className="text-xs text-muted-foreground md:text-sm">شهرداری مراغه</p>
                <h1 className="truncate text-sm font-bold text-foreground md:text-base">درباره عوارض نوسازی و کسب و پیشه</h1>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="header-action-btn"
                aria-label="تغییر تم"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isDark ? 'sun' : 'moon'}
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

      <section className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6">
        <div className="container mx-auto max-w-7xl px-0 md:px-2 lg:px-6">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-surface hero-grid relative overflow-hidden rounded-[1.6rem] border border-white/20 p-6 shadow-[0_18px_45px_rgba(5,29,25,0.28)] md:p-9"
          >
            <div className="relative z-10">
              <span className="section-chip mb-4 bg-white/10 text-white">صفحه راهنما</span>
              <h2 className="mb-4 text-2xl font-black text-white md:text-3xl lg:text-4xl">اطلاعات کامل عوارض شهری</h2>
              <p className="max-w-4xl text-sm leading-7 text-white/90 md:text-base">{aboutIntro}</p>
            </div>
          </motion.article>

          <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:gap-6 lg:grid-cols-2">
            {aboutInfoSections.map((section, index) => (
              <motion.article
                key={section.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: Math.min(index * 0.03, 0.24) }}
                className="soft-card mesh-panel p-5 md:p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                    <BookOpenText className="h-4 w-4" />
                  </span>
                  <h3 className="text-base font-bold text-foreground md:text-lg">{section.title}</h3>
                </div>

                <div className="space-y-3">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={`${section.id}-paragraph-${paragraphIndex}`} className="text-sm leading-7 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 list-disc space-y-2 pr-5 text-sm leading-7 text-muted-foreground marker:text-primary">
                    {section.bullets.map((bullet, bulletIndex) => (
                      <li key={`${section.id}-bullet-${bulletIndex}`}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
