import { motion } from 'motion/react';
import { Users, FileCheck, Building2, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '۵۰,۰۰۰+',
    label: 'شهروندان فعال',
    trend: '+۱۲٪',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: FileCheck,
    value: '۱۲,۳۴۵',
    label: 'درخواست پردازش شده',
    trend: '+۲۸٪',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Building2,
    value: '۱۵,۶۷۸',
    label: 'املاک ثبت شده',
    trend: '+۱۵٪',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: TrendingUp,
    value: '۹۵٪',
    label: 'رضایت شهروندان',
    trend: '+۵٪',
    color: 'from-orange-500 to-orange-600',
  },
];

export function StatsSection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xMDUuODk1LTIgMi0yczIgLjg5NSAyIDItLjg5NSAyLTIgMi0yLS44OTUtMi0yem0tMTAgMGMwLTEuMTA1Ljg5NS0yIDItMnMyIC44OTUgMiAyLS44OTUgMi0yIDItMi0uODk1LTItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">آمار و ارقام</h2>
          <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto px-4">
            نگاهی به دستاوردهای پورتال خدمات شهری
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>

                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-white/80 mb-3">{stat.label}</div>

                <div className="flex items-center gap-1 text-green-300">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-medium">{stat.trend}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
