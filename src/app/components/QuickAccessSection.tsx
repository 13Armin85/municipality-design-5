import { motion } from 'motion/react';
import { Phone, Mail, MessageCircle, MapPin, ExternalLink } from 'lucide-react';

const quickLinks = [
  {
    icon: Phone,
    title: 'پشتیبانی تلفنی',
    description: '۱۳۷ - ۰۹۱۴۰۰۷۷۸۰۴',
    color: 'from-blue-500 to-blue-600',
    action: 'تماس',
  },
  {
    icon: MessageCircle,
    title: 'چت آنلاین',
    description: 'پاسخگویی سریع ۲۴ ساعته',
    color: 'from-green-500 to-green-600',
    action: 'شروع گفتگو',
  },
  {
    icon: Mail,
    title: 'ایمیل پشتیبانی',
    description: 'info@maragheh.ir',
    color: 'from-purple-500 to-purple-600',
    action: 'ارسال ایمیل',
  },
  {
    icon: MapPin,
    title: 'آدرس شهرداری',
    description: 'مراغه، بلوار شهید بهشتی',
    color: 'from-orange-500 to-orange-600',
    action: 'مسیریابی',
  },
];

export function QuickAccessSection() {
  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">دسترسی سریع</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            راه‌های ارتباطی و دسترسی به خدمات پشتیبانی
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {quickLinks.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="h-full bg-card rounded-2xl p-6 border border-border hover:border-transparent hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <link.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-white transition-colors mb-2">
                    {link.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground group-hover:text-white/90 transition-colors mb-4 leading-relaxed">
                    {link.description}
                  </p>

                  <div className="flex items-center gap-2 text-primary group-hover:text-white transition-colors">
                    <span className="text-sm font-medium">{link.action}</span>
                    <ExternalLink className="w-4 h-4" />
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
