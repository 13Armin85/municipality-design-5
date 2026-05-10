import { motion } from 'motion/react';
import { Users, FileCheck, Building2, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Users, value: '50,000+', label: 'شهروندان فعال', trend: '+12%', color: 'from-primary to-secondary' },
  { icon: FileCheck, value: '12,345', label: 'درخواست پردازش شده', trend: '+28%', color: 'from-secondary to-primary' },
  { icon: Building2, value: '15,678', label: 'املاک ثبت شده', trend: '+15%', color: 'from-primary/90 to-secondary/90' },
  { icon: TrendingUp, value: '95%', label: 'رضایت شهروندان', trend: '+5%', color: 'from-secondary/90 to-primary/90' },
];

export function StatsSection() {
  return (
    <section className="stats-spotlight section-decor py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="section-chip mb-3">
            گزارش عملکرد
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground mb-3 md:mb-4">آمار و ارقام</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            نمای کلی از وضعیت خدمات شهری و عملکرد سامانه
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group"
            >
              <div className="soft-card soft-card-hover mesh-panel h-full p-6">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <stat.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>

                <div className="text-3xl md:text-4xl font-black text-foreground mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-muted-foreground mb-3">{stat.label}</div>

                <div className="flex items-center gap-1 text-primary">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-semibold">{stat.trend}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
