import { motion } from 'motion/react';
import { Home, FileText, Building, ShoppingCart, Clipboard, MapPin, Wrench, ArrowUpLeft } from 'lucide-react';

const services = [
  { icon: Home, title: 'املاک من', description: 'مشاهده و مدیریت املاک ثبت‌شده', color: 'from-primary to-secondary' },
  { icon: FileText, title: 'ثبت درخواست', description: 'ارسال درخواست‌های شهری و پیگیری آن‌ها', color: 'from-secondary to-primary' },
  { icon: Building, title: 'پیگیری درخواست‌ها', description: 'بررسی وضعیت پرونده‌های در حال رسیدگی', color: 'from-primary/95 to-secondary/85' },
  { icon: ShoppingCart, title: 'عوارض نوسازی', description: 'پرداخت، مشاهده و چاپ قبض عوارض', color: 'from-secondary/95 to-primary/85' },
  { icon: ShoppingCart, title: 'عوارض صنفی', description: 'مدیریت عوارض واحدهای صنفی', color: 'from-primary to-secondary/90' },
  { icon: Clipboard, title: 'استعلام ملک', description: 'استعلام وضعیت و موقعیت ملک', color: 'from-secondary to-primary/90' },
  { icon: MapPin, title: 'سوابق ملک', description: 'نمایش خلاصه سوابق و پرونده‌ها', color: 'from-primary/85 to-secondary' },
  { icon: Wrench, title: 'سایر خدمات', description: 'دسترسی به خدمات تکمیلی شهرداری', color: 'from-secondary/85 to-primary' },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-12 md:py-20 bg-background section-decor">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="section-chip mb-3">دسترسی سریع</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground mb-3 md:mb-4">خدمات شهری</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            تمامی خدمات الکترونیک اداری در یک نمای متمرکز، ساده و استاندارد
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="group"
            >
              <div className="soft-card soft-card-hover mesh-panel h-full p-5 md:p-6 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-l ${service.color}`} />
                <div className="absolute -bottom-14 -left-14 w-28 h-28 rounded-full bg-[var(--primary-soft)] blur-2xl group-hover:scale-150 transition-transform duration-500" />

                <div className="relative z-10">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <service.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-4">{service.description}</p>

                  <div className="inline-flex items-center gap-1.5 text-primary text-xs md:text-sm font-semibold">
                    ورود به خدمت
                    <ArrowUpLeft className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
