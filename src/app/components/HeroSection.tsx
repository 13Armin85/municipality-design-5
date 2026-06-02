import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

const heroSlides = [
  {
    id: "slide-1",
    imageSrc: "/images/Gemini_Generated_Image_a6500ga6500ga650.png",
    alt: "Hero slide 1",
    width: 1376,
    height: 768,
  },
  {
    id: "slide-2",
    imageSrc: "/images/ChatGPT%20Image%20May%2011,%202026,%2001_36_30%20AM.png",
    alt: "Hero slide 2",
    width: 1774,
    height: 887,
  },
  {
    id: "slide-3",
    imageSrc: "/images/Gemini_Generated_Image_hbitsmhbitsmhbit.png",
    alt: "Hero slide 3",
    width: 1376,
    height: 768,
  },
];

// استفاده از Set برای ذخیره عکس‌های preload شده
const preloadedImages = new Set<string>();
const requestedImages = new Set<string>();

// Preload تمام تصاویر هنگام load کردن صفحه - فقط یک‌بار
const preloadImages = () => {
  heroSlides.forEach((slide) => {
    // اگر قبلاً درخواست شده، دوباره نکن
    if (requestedImages.has(slide.imageSrc)) {
      return;
    }

    requestedImages.add(slide.imageSrc);

    const img = new Image();
    img.src = slide.imageSrc;
    img.onload = () => {
      preloadedImages.add(slide.imageSrc);
    };
    img.onerror = () => {
      console.error(`Failed to preload image: ${slide.imageSrc}`);
    };
  });
};

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 70 : -70,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -70 : 70,
    transition: { duration: 0.35, ease: "easeIn" },
  }),
};

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const currentSlide = heroSlides[activeSlide];

  // Preload images on mount
  useEffect(() => {
    preloadImages();
  }, []);

  // Auto-play slides
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > activeSlide ? 1 : -1);
      setActiveSlide(index);
      setIsAutoPlay(false);
    },
    [activeSlide],
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlay(false);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
    setIsAutoPlay(false);
  }, []);

  return (
    <section
      id="home"
      className="relative px-3 pb-8 pt-24 sm:px-4 sm:pt-28 lg:px-6"
    >
      <div className="relative mx-auto aspect-[16/9] w-full max-w-[92rem] overflow-hidden rounded-[1.25rem] border border-white/25 bg-[#102620] sm:h-[clamp(18rem,52svh,40rem)] sm:aspect-auto sm:rounded-[1.5rem] lg:rounded-[1.75rem]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.article
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 overflow-hidden"
          >
            {heroSlides.map((slide, index) => (
              <img
                key={slide.id}
                src={slide.imageSrc}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                sizes="(max-width: 640px) 94vw, (max-width: 1024px) 92vw, 1280px"
                className={`absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-500 sm:object-cover ${
                  index === activeSlide ? "opacity-100" : "opacity-0"
                }`}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "auto"}
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              />
            ))}
            <div className="absolute inset-0 bg-black/20" />
          </motion.article>
        </AnimatePresence>

        {/* ناوبری */}
        <div className="absolute inset-x-0 bottom-3 z-20 px-2 sm:bottom-6 sm:px-5 lg:px-6">
          <div className="mx-auto flex w-fit max-w-full items-center justify-center gap-1.5 rounded-2xl border border-white/30 bg-white/10 px-2.5 py-1.5 backdrop-blur-sm sm:gap-3 sm:px-4 sm:py-3">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={goPrev}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20 sm:h-10 sm:w-10 sm:rounded-xl"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 sm:h-2.5 ${
                    index === activeSlide
                      ? "w-8 bg-white sm:w-10"
                      : "w-2 bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next slide"
              onClick={goNext}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20 sm:h-10 sm:w-10 sm:rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
