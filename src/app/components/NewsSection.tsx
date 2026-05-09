import { motion } from 'motion/react';
import { Calendar, Clock, ArrowLeft, Newspaper } from 'lucide-react';

const news = [
  {
    title: 'راه‌اندازی نسخه جدید پرتال خدمات شهری',
    excerpt: 'نسخه جدید سامانه با بهبود سرعت، دسترسی‌پذیری و پنل پیگیری درخواست‌ها در اختیار شهروندان قرار گرفت.',
    date: '1405/02/18',
    time: '10:30',
    category: 'اطلاعیه',
  },
  {
    title: 'آغاز طرح تشویقی پرداخت عوارض نوسازی',
    excerpt: 'شهروندان می‌توانند در بازه زمانی اعلام‌شده از تخفیف پرداخت آنلاین عوارض نوسازی استفاده کنند.',
    date: '1405/02/16',
    time: '14:15',
    category: 'خبر',
  },
  {
    title: 'به‌روزرسانی خدمات استعلام املاک',
    excerpt: 'سرویس استعلام املاک با نمایش تاریخچه پرونده و وضعیت جاری، دقیق‌تر و کامل‌تر شد.',
    date: '1405/02/13',
    time: '09:00',
    category: 'خدمات',
  },
];

export function NewsSection() {
  return (
    <section id="news" className="py-12 md:py-20 bg-background section-decor">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {news.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group soft-card soft-card-hover overflow-hidden"
            >
              <div className="relative h-28 bg-gradient-to-l from-primary via-secondary to-primary">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.32),transparent_34%)]" />
                <div className="absolute left-4 top-4 w-9 h-9 rounded-lg bg-white/15 text-white flex items-center justify-center border border-white/25">
                  <Newspaper className="w-4 h-4" />
                </div>
                <span className="absolute right-4 top-4 px-3 py-1 rounded-full bg-white/16 border border-white/26 text-white text-xs">
                  {item.category}
                </span>
              </div>

              <div className="p-5 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-foreground mb-3 line-clamp-2">{item.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{item.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="btn-gradient px-6 md:px-8 py-3 text-primary-foreground rounded-xl font-semibold shadow-lg transition-all"
          >
            مشاهده همه اخبار
          </motion.button>
        </div>
      </div>
    </section>
  );
}
