import { ArrowLeft, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  isDark: boolean;
}

export function Hero({ isDark }: HeroProps) {
  return (
    <section className={`relative pt-32 pb-20 overflow-hidden ${
      isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className={`absolute top-20 -right-20 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-blue-600/20' : 'bg-blue-400/30'
          }`}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className={`absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-cyan-600/20' : 'bg-cyan-400/30'
          }`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" dir="rtl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
              isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-100 border border-blue-200'
            }`}>
              <span className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>سامانه یکپارچه شهری</span>
              <div className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-blue-400' : 'bg-blue-600'}`} />
            </div>

            <h1 className={`text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              شهرداری <span className={isDark ? 'text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-cyan-400' : 'text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-cyan-600'}>هوشمند</span> مراغه
            </h1>

            <p className={`text-lg md:text-xl mb-8 leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              دسترسی آسان و سریع به تمامی خدمات شهری، پیگیری درخواست‌ها و مشاهده اطلاعات شهر در یک پلتفرم یکپارچه
            </p>

            <div className="flex flex-wrap gap-4">
              <button className={`px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                isDark
                  ? 'bg-gradient-to-l from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40'
                  : 'bg-gradient-to-l from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40'
              }`}>
                <span>مشاهده خدمات</span>
                <ArrowLeft className="w-5 h-5" />
              </button>

              <button className={`px-8 py-4 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                isDark
                  ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white backdrop-blur-sm'
                  : 'border-gray-300 bg-white/50 hover:bg-white text-gray-900 backdrop-blur-sm'
              }`}>
                <Play className="w-5 h-5" />
                <span>معرفی سامانه</span>
              </button>
            </div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className={`relative rounded-3xl p-8 ${
              isDark ? 'bg-slate-800/50 backdrop-blur-xl border border-slate-700' : 'bg-white/50 backdrop-blur-xl border border-gray-200'
            }`}>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                    className={`aspect-square rounded-2xl ${
                      isDark
                        ? 'bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600'
                        : 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
