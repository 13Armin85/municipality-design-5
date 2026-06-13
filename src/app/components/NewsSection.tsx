import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, Newspaper } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { getVisibleNewsItems } from "../data/news";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export function NewsSection() {
  const visibleNews = useMemo(() => getVisibleNewsItems(), []);
  const categories = useMemo(
    () => ["همه", ...Array.from(new Set(visibleNews.map((item) => item.category)))],
    [visibleNews],
  );
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const latestNews = useMemo(
    () =>
      visibleNews
        .filter(
          (item) =>
            selectedCategory === "همه" || item.category === selectedCategory,
        )
        .slice(0, 5),
    [selectedCategory, visibleNews],
  );

  return (
    <section id="news" className="relative overflow-hidden py-16 md:py-24">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 top-0 h-80 w-80 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute -left-24 bottom-8 h-64 w-64 rounded-full bg-secondary/8 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="section-chip mb-3">مرکز اطلاع‌رسانی</span>
          <h2 className="mb-3 text-2xl font-black text-foreground md:text-3xl lg:text-4xl">
            آخرین اخبار
          </h2>
          <p className="mx-auto max-w-2xl px-4 text-sm text-muted-foreground md:text-base">
            جدیدترین اطلاعیه‌ها و اخبار رسمی مرتبط با خدمات الکترونیک شهرداری
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`h-9 rounded-xl border px-4 text-xs font-bold transition-colors md:text-sm ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 bg-card/80 text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Carousel */}
        {latestNews.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              direction: "rtl",
              loop: latestNews.length > 3,
            }}
            className="relative mx-auto w-full max-w-6xl"
          >
          <CarouselContent className="-ml-4">
            {latestNews.map((item, index) => (
              <CarouselItem
                key={item.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="h-full"
                >
                  <Link
                    to={`/news/${item.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_16px_40px_rgba(11,105,104,0.14)]"
                  >
                    {/* Banner */}
                    <div className="relative h-36 shrink-0 overflow-hidden bg-gradient-to-l from-primary via-secondary to-accent">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
                          <div
                            className="absolute inset-0 opacity-[0.07]"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(0deg,transparent,transparent 24px,white 24px,white 25px),repeating-linear-gradient(90deg,transparent,transparent 24px,white 24px,white 25px)",
                            }}
                          />
                        </>
                      )}
                      <div className="absolute inset-0 bg-black/15" />

                      <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/25 bg-white/15 backdrop-blur-sm">
                        <Newspaper className="h-4 w-4 text-white" />
                      </div>

                      <span className="absolute right-4 top-4 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                        {item.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="mb-2.5 line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-base">
                        {item.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                        {item.excerpt}
                      </p>

                      <div className="flex items-center justify-between border-t border-border/60 pt-3.5 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-primary/60" />
                            {item.date}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3 text-primary/60" />
                            {item.time}
                          </span>
                        </div>

                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="-left-3 hidden h-10 w-10 rounded-xl border-border/70 bg-card/90 text-foreground shadow-md backdrop-blur-sm hover:border-primary/50 hover:bg-[var(--primary-soft)] hover:text-primary md:flex" />
          <CarouselNext className="-right-3 hidden h-10 w-10 rounded-xl border-border/70 bg-card/90 text-foreground shadow-md backdrop-blur-sm hover:border-primary/50 hover:bg-[var(--primary-soft)] hover:text-primary md:flex" />
          </Carousel>
        ) : (
          <div className="mx-auto max-w-xl rounded-2xl border border-border/70 bg-card/80 px-4 py-8 text-center text-sm text-muted-foreground">
            خبری در این دسته‌بندی برای نمایش وجود ندارد.
          </div>
        )}
      </div>
    </section>
  );
}
