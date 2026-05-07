import { motion } from 'motion/react';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

const news = [
  {
    title: 'افتتاح پورتال جدید خدمات شهری',
    excerpt: 'پورتال یکپارچه خدمات الکترونیک شهرداری با رابط کاربری نوین راه‌اندازی شد',
    date: '۱۴۰۳/۰۲/۱۵',
    time: '۱۰:۳۰',
    category: 'اطلاعیه',
  },
  {
    title: 'تسهیل در پرداخت عوارض',
    excerpt: 'امکان پرداخت آنلاین عوارض با تخفیف ویژه برای شهروندان فراهم شد',
    date: '۱۴۰۳/۰۲/۱۲',
    time: '۱۴:۱۵',
    category: 'خبر',
  },
  {
    title: 'راه‌اندازی سامانه نقشه املاک',
    excerpt: 'شهروندان می‌توانند موقعیت و اطلاعات املاک خود را به صورت آنلاین مشاهده کنند',
    date: '۱۴۰۳/۰۲/۱۰',
    time: '۰۹:۰۰',
    category: 'خدمات',
  },
];

export function NewsSection() {
  return (
    <section id="news" className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">آخرین اخبار</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            به‌روزترین اطلاعیه‌ها و اخبار شهری
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {news.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="h-full bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs md:text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>

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
                    <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 md:px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:shadow-lg transition-all"
          >
            مشاهده همه اخبار
          </motion.button>
        </div>
      </div>
    </section>
  );
}
