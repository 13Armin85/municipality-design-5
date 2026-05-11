import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, Newspaper } from 'lucide-react';
import { Link } from 'react-router';
import { newsItems } from '../data/news';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

const latestNews = newsItems.slice(0, 5);

export function NewsSection() {
  return (
    <section id="news" className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="section-chip mb-3">مرکز اطلاع‌رسانی</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground mb-3 md:mb-4">آخرین اخبار</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            جدیدترین اطلاعیه‌ها و اخبار رسمی مرتبط با خدمات الکترونیک شهرداری
          </p>
        </motion.div>

        <Carousel
          opts={{
            align: 'start',
            direction: 'rtl',
            loop: latestNews.length > 3,
          }}
          className="relative mx-auto w-full max-w-6xl px-1 md:px-3"
        >
          <CarouselContent>
            {latestNews.map((item, index) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group h-full"
                >
                  <Link
                    to={`/news/${item.slug}`}
                    className="soft-card soft-card-hover block h-full overflow-hidden transition-transform hover:-translate-y-1"
                  >
                    <div className="relative h-28 bg-gradient-to-l from-primary via-secondary to-primary">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.32),transparent_34%)]" />
                      <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 bg-white/15 text-white">
                        <Newspaper className="h-4 w-4" />
                      </div>
                      <span className="absolute right-4 top-4 rounded-full border border-white/26 bg-white/16 px-3 py-1 text-xs text-white">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-5 md:p-6">
                      <h3 className="mb-3 line-clamp-2 text-base font-bold text-foreground md:text-lg">{item.title}</h3>
                      <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground md:text-sm">{item.excerpt}</p>

                      <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{item.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{item.time}</span>
                          </div>
                        </div>
                        <ArrowLeft className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="-left-2 hidden border-border bg-background/90 text-foreground hover:bg-[var(--primary-soft)] md:inline-flex" />
          <CarouselNext className="-right-2 hidden border-border bg-background/90 text-foreground hover:bg-[var(--primary-soft)] md:inline-flex" />
        </Carousel>
      </div>
    </section>
  );
}
