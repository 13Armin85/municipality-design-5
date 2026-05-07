import { Users, FileCheck, Building, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface StatsProps {
  isDark: boolean;
}

const statsData = [
  { icon: Users, label: 'کاربران فعال', value: 12450, suffix: '+', color: 'from-blue-500 to-cyan-500' },
  { icon: FileCheck, label: 'درخواست‌های ثبت‌شده', value: 8920, suffix: '+', color: 'from-purple-500 to-pink-500' },
  { icon: Building, label: 'املاک ثبت‌شده', value: 15680, suffix: '+', color: 'from-green-500 to-teal-500' },
  { icon: TrendingUp, label: 'رضایت شهروندان', value: 94, suffix: '%', color: 'from-orange-500 to-red-500' },
];

function Counter({ target, suffix, isDark }: { target: number; suffix: string; isDark: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className={`text-4xl md:text-5xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {count.toLocaleString('fa-IR')}{suffix}
    </span>
  );
}

export function Stats({ isDark }: StatsProps) {
  return (
    <section className={`py-20 relative overflow-hidden ${
      isDark ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl text-white mb-4">
            آمار و اطلاعات
          </h2>
          <p className="text-lg text-blue-100">
            نگاهی به عملکرد سامانه شهروندی
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 backdrop-blur-xl ${
                isDark
                  ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                  : 'bg-white/10 border border-white/20 hover:bg-white/20'
              } transition-all duration-300 group`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>

              {/* Value */}
              <div className="mb-2">
                <Counter target={stat.value} suffix={stat.suffix} isDark={isDark} />
              </div>

              {/* Label */}
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-blue-50'}`}>
                {stat.label}
              </p>

              {/* Decorative line */}
              <div className={`absolute bottom-0 right-0 h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${stat.color} rounded-full`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
