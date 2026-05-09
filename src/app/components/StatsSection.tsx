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
    <section className="py-12 md:py-20 bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(255,255,255,0.18),transparent_34%),radial-gradient(circle_at_82%_84%,rgba(255,255,255,0.12),transparent_32%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2262%22 height=%2262%22 viewBox=%220 0 62 62%22><circle cx=%2231%22 cy=%2231%22 r=%221%22 fill=%22rgba(255,255,255,0.2)%22/></svg>')]" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs md:text-sm">
            گزارش عملکرد
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 md:mb-4">آمار و ارقام</h2>
          <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto px-4">
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
              <div className="mesh-panel rounded-[calc(var(--radius)+8px)] border border-white/28 bg-black/30 p-6 backdrop-blur-lg shadow-[0_18px_36px_rgba(2,16,20,0.35)] transition-colors duration-300 group-hover:bg-black/38">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <stat.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>

                <div className="text-3xl md:text-4xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-white/85 mb-3">{stat.label}</div>

                <div className="flex items-center gap-1 text-white">
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
