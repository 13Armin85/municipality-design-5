import { Calendar, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface NewsProps {
  isDark: boolean;
}

const newsItems = [
  {
    title: 'راه‌اندازی سامانه نوین پرداخت الکترونیک',
    excerpt: 'با هدف تسهیل در پرداخت عوارض و هزینه‌های شهری، سامانه جدید پرداخت الکترونیک راه‌اندازی شد.',
    date: '۱۵ اردیبهشت ۱۴۰۵',
    category: 'فناوری',
    image: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'بازسازی پارک‌های شهری با استانداردهای جدید',
    excerpt: 'پروژه بازسازی و نوسازی پارک‌های سطح شهر با رویکرد محیط زیستی آغاز شد.',
    date: '۱۲ اردیبهشت ۱۴۰۵',
    category: 'عمران',
    image: 'from-green-500 to-teal-500'
  },
  {
    title: 'برگزاری جلسات مشارکت شهروندی',
    excerpt: 'دعوت از شهروندان برای شرکت در جلسات مشورتی طرح‌های توسعه شهری.',
    date: '۱۰ اردیبهشت ۱۴۰۵',
    category: 'اخبار',
    image: 'from-purple-500 to-pink-500'
  },
];

export function News({ isDark }: NewsProps) {
  return (
    <section className={`py-20 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            اخبار و اطلاعیه‌ها
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            آخرین رویدادها و اطلاعیه‌های شهری
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((news, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                isDark
                  ? 'bg-slate-900 border border-slate-700 hover:border-slate-600 hover:shadow-2xl hover:shadow-blue-500/10'
                  : 'bg-gray-50 border border-gray-200 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10'
              }`}
            >
              {/* Image Placeholder */}
              <div className={`h-48 bg-gradient-to-br ${news.image} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs text-white bg-white/20 backdrop-blur-md border border-white/30">
                    {news.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className={`flex items-center gap-2 mb-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Calendar className="w-4 h-4" />
                  <span>{news.date}</span>
                </div>

                <h3 className={`text-xl mb-3 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {news.title}
                </h3>

                <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {news.excerpt}
                </p>

                <div className={`flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  <span>ادامه مطلب</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className={`px-8 py-4 rounded-xl border transition-all duration-300 ${
            isDark
              ? 'border-slate-700 bg-slate-900 hover:bg-slate-800 text-white'
              : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-900'
          }`}>
            مشاهده همه اخبار
          </button>
        </motion.div>
      </div>
    </section>
  );
}
