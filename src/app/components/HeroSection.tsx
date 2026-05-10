import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Search, Sparkles } from 'lucide-react';

type HeroSlide = {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  surfaceClass: string;
};

const heroSlides: HeroSlide[] = [
  {
    id: 'services',
    badge: 'درگاه یکپارچه خدمات الکترونیک شهرداری',
    title: 'خدمات شهری مراغه',
    highlight: 'سریع و شفاف',
    description: 'ثبت درخواست، پیگیری پرونده، استعلام ملک و پرداخت عوارض را در یک تجربه ساده انجام دهید.',
    primaryAction: 'ورود به خدمات',
    secondaryAction: 'استعلام ملک',
    surfaceClass:
      'bg-[linear-gradient(145deg,color-mix(in_oklab,var(--primary-gradient-1)_96%,#031b1f)_0%,color-mix(in_oklab,var(--primary-gradient-2)_92%,#0d2940)_60%,color-mix(in_oklab,var(--secondary)_64%,#1b2e45)_100%)]',
  },
  {
    id: 'construction',
    badge: 'پنل پروانه و شهرسازی',
    title: 'مدیریت هوشمند پرونده‌ها',
    highlight: 'مرحله به مرحله',
    description: 'وضعیت پرونده‌ها را دقیق دنبال کنید و پاسخ استعلام‌ها را از یک پنل متمرکز دریافت کنید.',
    primaryAction: 'ثبت پرونده',
    secondaryAction: 'پیگیری پروانه',
    surfaceClass:
      'bg-[linear-gradient(145deg,color-mix(in_oklab,var(--secondary)_92%,#0b2a3a)_0%,color-mix(in_oklab,var(--primary)_86%,#0f2f38)_58%,color-mix(in_oklab,var(--primary-gradient-2)_65%,#28496a)_100%)]',
  },
  {
    id: 'support',
    badge: 'مرکز پاسخ‌گویی شهروندی',
    title: 'پشتیبانی یکپارچه',
    highlight: 'از ثبت تا نتیجه',
    description: 'تیکت ثبت کنید، اعلان بگیرید و پاسخ درخواست خود را در کمترین زمان پیگیری کنید.',
    primaryAction: 'ثبت تیکت',
    secondaryAction: 'مشاهده اطلاعیه‌ها',
    surfaceClass:
      'bg-[linear-gradient(145deg,color-mix(in_oklab,var(--primary-gradient-2)_88%,#0c2435)_0%,color-mix(in_oklab,var(--primary)_84%,#113427)_52%,color-mix(in_oklab,var(--primary-gradient-1)_74%,#1f4f41)_100%)]',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 70 : -70,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -70 : 70,
    transition: { duration: 0.35, ease: 'easeIn' },
  }),
};

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const currentSlide = heroSlides[activeSlide];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setDirection(1);
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, []);

  const goToSlide = (index: number) => {
    if (index === activeSlide) return;
    setDirection(index > activeSlide ? 1 : -1);
    setActiveSlide(index);
  };

  const goNext = () => {
    setDirection(1);
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section id="home" className="relative h-[100dvh] min-h-screen overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.article
          key={currentSlide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className={`absolute inset-0 flex h-full overflow-hidden pt-24 pb-8 md:pt-28 md:pb-10 ${currentSlide.surfaceClass}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,255,255,0.16),transparent_38%),radial-gradient(circle_at_88%_84%,rgba(255,255,255,0.08),transparent_34%)]" />

          <div className="container relative z-10 mx-auto flex h-full w-full flex-col justify-center px-4 md:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs text-white md:text-sm">
                <Sparkles className="h-3.5 w-3.5" />
                {currentSlide.badge}
              </span>

              <h1 className="mb-5 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {currentSlide.title}
                <span className="block bg-gradient-to-l from-white to-white/75 bg-clip-text text-transparent">
                  {currentSlide.highlight}
                </span>
              </h1>

              <p className="mx-auto mb-9 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                {currentSlide.description}
              </p>

              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-gradient inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white md:px-8 md:py-4 md:text-base"
                >
                  {currentSlide.primaryAction}
                  <ArrowLeft className="h-5 w-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md md:px-8 md:py-4 md:text-base"
                >
                  {currentSlide.secondaryAction}
                  <Search className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-center gap-3 md:mt-12">
              <button
                type="button"
                aria-label="اسلاید قبلی"
                onClick={goPrev}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`نمایش اسلاید ${index + 1}`}
                    onClick={() => goToSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === activeSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/65'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                aria-label="اسلاید بعدی"
                onClick={goNext}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent md:h-24" />
        </motion.article>
      </AnimatePresence>
    </section>
  );
}
