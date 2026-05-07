import { motion } from 'motion/react';
import { Home, FileText, Building, ShoppingCart, Clipboard, MapPin, Wrench, MessageSquare } from 'lucide-react';

const services = [
  {
    icon: Home,
    title: 'املاک من',
    description: 'مشاهده و مدیریت املاک ثبت‌شده',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: FileText,
    title: 'ثبت درخواست',
    description: 'ارسال درخواست‌های شهری و پیگیری',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: Building,
    title: 'پیگیری درخواست‌ها',
    description: 'مشاهده وضعیت درخواست‌های ارسالی',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: ShoppingCart,
    title: 'عوارض نوسازی',
    description: 'پرداخت و مشاهده عوارض نوسازی',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: ShoppingCart,
    title: 'عوارض صنفی',
    description: 'مدیریت عوارض صنفی واحدهای صنفی',
    color: 'from-rose-500 to-rose-600',
  },
  {
    icon: Clipboard,
    title: 'وضعیت عقب نگهداری ملک',
    description: 'استعلام وضعیت و موقعیت ملک',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: MapPin,
    title: 'نقشه زمین‌های مردم',
    description: 'مشاهده نقشه املاک و زمین‌ها',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Wrench,
    title: 'سایر خدمات',
    description: 'دسترسی به خدمات تکمیلی شهری',
    color: 'from-teal-500 to-teal-600',
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">خدمات شهری</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            دسترسی سریع و آسان به تمامی خدمات الکترونیک شهرداری
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <div className="relative h-full bg-card rounded-2xl p-6 border border-border hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-white transition-colors mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground group-hover:text-white/90 transition-colors leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
