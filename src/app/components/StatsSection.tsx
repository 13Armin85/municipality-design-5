import { motion } from 'motion/react';
import { ArrowUpRight, Building2, FileCheck, TrendingUp, Users } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '50,000+',
    label: 'شهروندان فعال',
    trend: '+12%',
    description: 'کاربر فعال در سامانه خدمات غیرحضوری',
    progress: 78,
    color: 'from-primary to-secondary',
  },
  {
    icon: FileCheck,
    value: '12,345',
    label: 'درخواست پردازش شده',
    trend: '+28%',
    description: 'پرونده‌های رسیدگی‌شده تا پایان این ماه',
    progress: 86,
    color: 'from-secondary to-primary',
  },
  {
    icon: Building2,
    value: '15,678',
    label: 'املاک ثبت شده',
    trend: '+15%',
    description: 'املاک ثبت‌شده در پایگاه اطلاعات شهری',
    progress: 69,
    color: 'from-primary/90 to-secondary/90',
  },
  {
    icon: TrendingUp,
    value: '95%',
    label: 'رضایت شهروندان',
    trend: '+5%',
    description: 'میانگین امتیاز ثبت‌شده از کیفیت خدمات',
    progress: 95,
    color: 'from-secondary/90 to-primary/90',
  },
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
              <div className="soft-card soft-card-hover mesh-panel relative isolate h-full overflow-hidden p-5 md:p-6">
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-l ${stat.color}`} />
                <div className={`pointer-events-none absolute -top-12 -left-10 h-28 w-28 rounded-full bg-gradient-to-br ${stat.color} opacity-20 blur-2xl`} />
                <div className={`pointer-events-none absolute -bottom-14 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${stat.color} opacity-20 blur-3xl`} />

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg md:h-16 md:w-16`}>
                    <stat.icon className="h-7 w-7 text-white md:h-8 md:w-8" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-semibold text-primary">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {stat.trend}
                  </span>
                </div>

                <div className="relative z-10 mt-5">
                  <p className="text-3xl font-black tracking-tight text-foreground md:text-4xl">{stat.value}</p>
                  <p className="mt-2 text-sm font-semibold text-foreground md:text-base">{stat.label}</p>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground md:text-sm">{stat.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
